from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import LLMResult
import time

class MetricsCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.metrics = {
            "time_to_first_token": None,
        }
        self.start_time = None

    def on_llm_start(self, serialized, prompts, **kwargs):
        """
        Called when the LLM starts running.
        NOTE: This is only called for regular LLMs, not for chat models. If/when chat models are added, add support for on_chat_model_start.
        """
        self.start_time = time.perf_counter()

    def on_llm_new_token(self, token: str, **kwargs):
        """Called when a new token is generated. Useful for tracking time to first token and performance over time"""
        current_time = time.perf_counter()
        if (self.metrics['time_to_first_token'] is None):
            self.metrics['time_to_first_token'] = current_time - self.start_time
        # NOTE: Exluting this for now to limit response size, but may add it back in later
        #self.metrics['token_timestamps'].append(current_time) 
    
    def _calculate_performance_benchmarks(self, generation_info: dict) -> dict:
        """Calculate performance metrics for model comparison"""
        
        performance_metrics = {}
        
        total_duration = generation_info.get('total_duration', 0) 
        if total_duration > 0:
            total_seconds = total_duration / 1_000_000_000   

            load_duration = generation_info.get('load_duration', 0)         

            prompt_eval_count = generation_info.get('prompt_eval_count', 0)
            prompt_eval_duration = generation_info.get('prompt_eval_duration', 0) 
            prompt_eval_seconds = prompt_eval_duration / 1_000_000_000
            
            eval_count = generation_info.get('eval_count', 0)
            eval_duration = generation_info.get('eval_duration', 0)
            eval_seconds = eval_duration / 1_000_000_000

            context_length = len(generation_info.get('context', []))
            
            performance_metrics.update({
                'load_time_ratio': load_duration / total_duration,
                'prompt_tokens_per_second': (prompt_eval_count / prompt_eval_seconds) if prompt_eval_seconds > 0 else 0,
                'prompt_time_ratio': prompt_eval_duration / total_duration,
                'tokens_per_second': (eval_count / eval_seconds) if eval_seconds > 0 else 0,
                'generation_time_ratio': eval_duration / total_duration,
                'total_throughput_tokens_per_sec': (prompt_eval_count + eval_count) / total_seconds,
                'overhead_time': total_duration - load_duration - prompt_eval_duration - eval_duration,
                'context_length': context_length,
                'context_window_prompt_fill_rate': (prompt_eval_count / context_length) if context_length > 0 else 0,
                'context_window_response_fill_rate': (eval_count / context_length) if context_length > 0 else 0
            })
        
        return performance_metrics

    def on_llm_end(self, response: LLMResult, **kwargs):
        """
        Called when the LLM has finished running. Useful for tracking metrics like prompt evaluation duration, 
        evaluation duration, total duration, load duration, prompt evaluation count, and evaluation count.

        NOTE: The expectation here is that metrics will be pulled or derived from response generation chunks.
        """  
        try:
            if (response.generations and 
                len(response.generations) > 0 and
                len(response.generations[0]) > 0):

                generation_chunk = response.generations[0][0]

                if (hasattr(generation_chunk, 'generation_info')):
                    self.metrics['created_at'] = generation_chunk.generation_info.get('created_at')
                    self.metrics['total_duration'] = generation_chunk.generation_info.get('total_duration')
                    self.metrics['load_duration'] = generation_chunk.generation_info.get('load_duration')
                    self.metrics['prompt_eval_count'] = generation_chunk.generation_info.get('prompt_eval_count')
                    self.metrics['prompt_eval_duration'] = generation_chunk.generation_info.get('prompt_eval_duration')
                    self.metrics['eval_count'] = generation_chunk.generation_info.get('eval_count')
                    self.metrics['eval_duration'] = generation_chunk.generation_info.get('eval_duration')                    
                    self.metrics.update(self._calculate_performance_benchmarks(generation_chunk.generation_info))
                    # TODO: Additional metrics can be added here
        except Exception as e:
            print(f"Error extracting metrics: {e}")
            

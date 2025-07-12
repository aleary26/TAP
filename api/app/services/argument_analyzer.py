import time
import re
from pydantic import ValidationError

from app.models.analysis import AnalysisResponse, AnalysisStatistics
from app.models.argument_analysis import ArgumentAnalysisResult
from app.services.prompt_manager import prompt_manager
from app.services.ollama_manager import ollama_manager
from app.services.metrics_calback_handler import MetricsCallbackHandler


class ArgumentAnalyzer:
    """ Text Analysis Service focused on argument extraction and evaluation. """
    def __init__(self):
        pass

    def _generate_fallback_response(self) -> ArgumentAnalysisResult:
        """ Generate a fallback response in case of analysis failure. """
        return ArgumentAnalysisResult(
            arguments=[],
            overall_assessment="Analysis failed - consider possible model or prompt issues.",
            credibility_score=0.0,
            argument_count=0,
            well_supported_arguments=0
        )   

    def _extract_analysis_from_response(self, response: str) -> ArgumentAnalysisResult:
        """ 
        Extract and parse JSON from LLM response. Flexible implementation to handle various 
        formats since not all prompt + model combinations will return strrictly structured output
        """
        cleaned_response = response.strip()
        try:
            # Attempt to parse the response directly
            try:
                return ArgumentAnalysisResult.model_validate_json(cleaned_response)
            except ValidationError:
                print("Direct JSON parsing failed, attempting to extract JSON from response")
            
            # Attempt to find JSON by looking for balanced braces
            try:
                start_idx = cleaned_response.find('{')
                if start_idx == -1: # no point in continuing if no opening brace
                    print("No opening brace found in response")
                    return None
                
                # print(f"Found opening brace at index {start_idx}")
                brace_count = 0
                end_idx = -1
                for i,char in enumerate(cleaned_response[start_idx:], start_idx):
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            end_idx = i
                            break
                
                if end_idx != -1:
                    # print(f"Found closing brace at index {end_idx}")
                    # print(f"Extracted JSON: {cleaned_response[start_idx:end_idx + 1]}")
                    return ArgumentAnalysisResult.model_validate_json(cleaned_response[start_idx:end_idx + 1])               
            except ValidationError as e:
                print(f"Failed to extract JSON from response through brace matching. Attempting regex extraction: {e}")

            # Use regex to find json-like structures        
            # Pattern to match JSON object starting with { and ending with }
            json_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
            matches = re.findall(json_pattern, cleaned_response, re.DOTALL)
            
            # Try parsing each match, starting with the longest (most complete)
            matches.sort(key=len, reverse=True)
            for match in matches:
                try:
                    return ArgumentAnalysisResult.model_validate_json(match)
                except ValidationError:
                    continue
        except Exception as e:
            print(f"Analysis extraction failed: {e}")
        
        return None

    async def analyze_text(self, text: str, model_name: str, prompt_name: str) -> AnalysisResponse:
        """ 
        Analyse text for arguments and their credibility using the specified Ollama model.

        Through prompting, input text is run through the argument analysis pipeline for:
        1. Argument extraction and identification
        2. Supporting claims analysis
        3. Logical framework evaluation
        4. Overall credibility assessment
        """
        if not await ollama_manager.is_model_available(model_name):
            raise ValueError(f"Model '{model_name}' is not available")
        
        prompt_template = prompt_manager.create_langchain_prompt(prompt_name)
        if not prompt_template:
            raise ValueError(f"Prompt '{prompt_name}' not found")

        try:
            llm = ollama_manager.get_model_instance(model_name)

            # Create LCEL chain
            chain = prompt_template | llm

            metrics_callback = MetricsCallbackHandler()

            result = await chain.ainvoke(
                {"text": text},
                config={"callbacks": [metrics_callback]}
            )
         
            parsed_result = self._extract_analysis_from_response(result)
            success = parsed_result is not None

            if not parsed_result:
                print("Warning: Could not extract valid JSON from LLM response.")
                print(f"Raw response: {result[:500]}...")  # Log first 500 chars for debugging
                parsed_result = self._generate_fallback_response()
            
            return AnalysisResponse(
                model_used=model_name,
                success=success,
                timestamp=time.time(),
                result=parsed_result,
                raw_model_response=result,
                statistics=AnalysisStatistics(**metrics_callback.metrics)
            )
        except ValidationError as e:
            print(f"Callback metrics: {metrics_callback.metrics}")
            print(f"Error validating statistics: {e}")
            raise
        except Exception as e:
            print(f"Error analyzing text: {e}")
            raise

argument_analyzer = ArgumentAnalyzer()

            

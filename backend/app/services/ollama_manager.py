from typing import Dict, List
import ollama
from langchain_ollama import OllamaLLM #, ChatOllama, OllamaEmbeddings


from app.core.config import settings
#from app.services.prompt_manager import prompt_manager
from app.models.llm_models import ModelHyperparameters, ModelMetadata, ModelInfo

class OllamaManager:
    """Manager for interacting with Ollama models and provides LangChain integration"""
    def __init__(self):
        self.client = ollama.Client(host=settings.ollama_base_url)
        # in memory caching of model instances and configurations
        self.llm_instances: Dict[str, OllamaLLM] = {}
        self.model_configurations: Dict[str, ModelHyperparameters] = {} # TODO: this will eventually be loaded from a config file
        self.available_models: Dict[str, ModelInfo] = {}

    async def is_model_available(self, model_name: str) -> bool:
        """Check if a specific model is available. If there are no cached models, fetch the list."""
        if not self.available_models:
            await self.get_available_models() # TODO: instead of doing this as a side effect, make this a direct call earlier
        return model_name in self.available_models
    
    async def get_available_models(self) -> List[ModelInfo]:
        """ Get list of available models from Ollama and cache with available metadata."""
        # clear the cached list of models to start fresh
        self.available_models = {}
        try:
            list_response: ollama.ListResponse = self.client.list()
            model_list = []
            for model in list_response.models:
                details = model.get('details', {})
                metadata = ModelMetadata(
                    name=model.get('model', "Unknown"),
                    description=details.get('description', "No description available"),
                    version=details.get('version', "Unknown"),
                    size=model.get('size', None),
                    parameter_count=details.get('parameter_size', None),
                    architecture=details.get('family', None),
                    quantization=details.get('quantization_level', None)
                )
                model_info = ModelInfo(
                    metadata=metadata,
                    hyperparameters=self.model_configurations.get(model.get('model', "Unknown"), ModelHyperparameters())
                )
                self.available_models[model.model] = model_info
                model_list.append(model_info)
            return model_list            
        except Exception as e:
            print(f"Error fetching models from Ollama: {e}")
            return []

    def get_model_instance(self, model_name: str) -> OllamaLLM:
        """ Get or create a LanChange Ollama LLM instance with current configuration."""
        if model_name not in self.llm_instances:
            hyperparams = self.model_configurations.get(model_name, ModelHyperparameters()) # TODO: implement saving model configurations

            self.llm_instances[model_name] = OllamaLLM(
                model=model_name,
                base_url=settings.ollama_base_url,
                temperature=hyperparams.temperature or None,
                top_p=hyperparams.top_p or None,
                top_k=hyperparams.top_k or None,
                num_ctx=hyperparams.context_length or None,
                repeate_penalty=hyperparams.repeat_penalty or None,
                verbose=settings.langchain_verbose
            )
        return self.llm_instances[model_name]
    
ollama_manager = OllamaManager()





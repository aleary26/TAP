from typing import Dict, List, Optional
import ollama
import os
import json
from langchain_ollama import OllamaLLM #, ChatOllama, OllamaEmbeddings


from app.core.config import settings
from app.models.llm_models import ModelHyperparameters, ModelMetadata, ModelInfo

class OllamaManager:
    """Manager for interacting with Ollama models and provides LangChain integration"""
    def __init__(self, model_configs_dir: str = "model_configurations"):
        self.client = ollama.Client(host=settings.ollama_base_url)
        self.model_configs_dir = model_configs_dir
        self.llm_instances: Dict[str, OllamaLLM] = {}
        self.model_configurations: Dict[str, ModelHyperparameters] = {}
        self.available_models: Dict[str, ModelInfo] = {}
        
        self._ensure_model_configs_directory()
        self._load_model_configurations()

    def _ensure_model_configs_directory(self):
        """Ensure the model configurations directory exists."""
        if not os.path.exists(self.model_configs_dir):
            os.makedirs(self.model_configs_dir)

    def _load_model_configuration_from_file(self, model_name: str) -> Optional[ModelHyperparameters]:
        """Load a model configuration from a JSON file."""
        try:
            safe_filename = self._sanitize_filename(model_name)
            with open(os.path.join(self.model_configs_dir, f"{safe_filename}.json"), "r", encoding="utf-8") as file:
                data = json.load(file)
                return ModelHyperparameters(**data)
        except FileNotFoundError:
            print(f"Model configuration '{model_name}' not found.")
        except Exception as e:
            print(f"Error loading model configuration '{model_name}': {e}")
        return None

    def _load_model_configurations(self):
        """Load all model configurations from the configurations directory."""
        if not os.path.exists(self.model_configs_dir):
            return
        
        for filename in os.listdir(self.model_configs_dir):
            if filename.endswith(".json"):
                model_name = filename[:-5]  # Remove .json extension. note: this is a sanitized string
                config = self._load_model_configuration_from_file(model_name)
                if config:
                    self.model_configurations[config.ollama_model_name] = config

    def _sanitize_filename(self, filename: str) -> str:
        """It's not uncommon for a model name to contain problematic characters (e.g. phi4:14b). This function sanitizes the filename to make it safe for file system operations."""
        sanitized = filename.replace(':', '_').replace('/', '_').replace('\\', '_').replace('?', '_').replace('*', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')
        return sanitized

    def _save_model_configuration_to_file(self, model_name: str, config: ModelHyperparameters):
        """Save a model configuration to a JSON file."""
        try:
            config_dict = config.model_dump(mode='json', exclude_none=False, exclude_unset=False) 
            safe_filename = self._sanitize_filename(model_name)            
            with open(os.path.join(self.model_configs_dir, f"{safe_filename}.json"), "w", encoding="utf-8") as file:
                json.dump(config_dict, file, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving model configuration '{model_name}': {e}")
            raise

    def get_model_configuration(self, model_name: str) -> ModelHyperparameters:
        """Get model configuration, loading from file if not in cache."""
        if model_name not in self.model_configurations:
            config = self._load_model_configuration_from_file(model_name)
            if config:
                self.model_configurations[model_name] = config
            else:
                return ModelHyperparameters(ollama_model_name=model_name)
        return self.model_configurations[model_name]

    def save_model_configuration(self, model_name: str, config: ModelHyperparameters) -> bool:
        """Save model configuration to file and update cache."""
        try:
            config.ollama_model_name = model_name
            self._save_model_configuration_to_file(model_name, config)
            self.model_configurations[config.ollama_model_name] = config
            if (config.ollama_model_name in self.available_models):
                self.available_models[config.ollama_model_name].hyperparameters = config
            if config.ollama_model_name in self.llm_instances:
                del self.llm_instances[config.ollama_model_name]
            return True
        except Exception as e:
            print(f"Error saving model configuration '{model_name}': {e}")
            return False

    def delete_model_configuration(self, model_name: str) -> bool:
        """Delete model configuration from file and cache."""
        success = False
        safe_filename = self._sanitize_filename(model_name)        
        config_file = os.path.join(self.model_configs_dir, f"{safe_filename}.json")
        if os.path.exists(config_file):
            try:
                os.remove(config_file)
                success = True
            except Exception as e:
                print(f"Error deleting model configuration file '{safe_filename}': {e}")
                raise
        
        if model_name in self.model_configurations:
            del self.model_configurations[model_name]
            success = True

        if model_name in self.available_models:
            del self.available_models[model_name]
        
        if model_name in self.llm_instances:
            del self.llm_instances[model_name]
        
        return success

    async def is_model_available(self, model_name: str) -> bool:
        """Check if a specific model is available. If there are no cached models, fetch the list."""
        if not self.available_models or model_name not in self.available_models:
            await self.get_available_models() 
        return model_name in self.available_models
    
    async def get_model_info(self, model_name: str) -> ModelInfo:
        """Get model info for a specific model."""
        if model_name not in self.available_models:
            await self.get_available_models() 
        return self.available_models[model_name]
    
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
                    hyperparameters=self.get_model_configuration(model.get('model', "Unknown"))
                )
                self.available_models[model.model] = model_info
                model_list.append(model_info)
            return model_list            
        except Exception as e:
            print(f"Error fetching models from Ollama: {e}")
            return []

    def get_model_instance(self, model_name: str) -> OllamaLLM:
        """ Get or create a LangChain Ollama LLM instance with current configuration."""
        if model_name not in self.llm_instances:
            hyperparams = self.get_model_configuration(model_name)

            self.llm_instances[model_name] = OllamaLLM(
                model=model_name,
                base_url=settings.ollama_base_url,
                temperature=hyperparams.temperature,
                top_p=hyperparams.top_p,
                top_k=hyperparams.top_k,
                num_ctx=hyperparams.context_length,
                repeat_last_n=hyperparams.repeat_last_n,
                repeat_penalty=hyperparams.repeat_penalty,
                num_gpu=hyperparams.gpu_count,
                seed=hyperparams.seed,
                verbose=settings.langchain_verbose
            )
        return self.llm_instances[model_name]
    
ollama_manager = OllamaManager()





from fastapi import APIRouter, HTTPException

from app.services.ollama_manager import ollama_manager
from app.models.llm_models import ModelsResponse

llm_models_router = APIRouter()

@llm_models_router.get("/models", response_model=ModelsResponse)
async def get_models():
    """
    Get information about available analysis models.
    
    Returns a list of all available LLM models from Ollama
    """
    try:
        models_info = await ollama_manager.get_available_models()        
        return ModelsResponse(models=models_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get models: {str(e)}")
    

# TODO: /models/{model_name}/configure
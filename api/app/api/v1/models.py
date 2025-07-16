from fastapi import APIRouter, HTTPException, Path
from typing import Dict, Any

from app.services.ollama_manager import ollama_manager
from app.models.llm_models import ModelsResponse, ModelInfo, ModelGenerationParams, ModelResetResponse

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

@llm_models_router.get("/models/{model_name}", response_model=ModelInfo)
async def get_model_configuration(
    model_name: str = Path(..., description="Name of the model to get configuration for")
):
    """
    Get configuration for a specific model.
    
    Returns the current generation parameter configuration for the specified model.
    If no custom configuration exists, returns the default configuration.
    """
    try:
        if not await ollama_manager.is_model_available(model_name):
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        model_info = await ollama_manager.get_model_info(model_name)
        
        if not model_info:
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        return model_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model configuration: {str(e)}")

@llm_models_router.put("/models/{model_name}", response_model=ModelInfo)
async def update_model_configuration(
    generation_params: ModelGenerationParams,
    model_name: str = Path(..., description="Name of the model to update configuration for")
):
    """
    Update generation parameter configuration for a specific model.
    
    Saves the provided generation parameters as the new configuration for the specified model.
    This will override any existing configuration for the model.
    """
    try:
        if not await ollama_manager.is_model_available(model_name):
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        success = ollama_manager.save_model_configuration(model_name, generation_params)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save model configuration")
        
        model_info = await ollama_manager.get_model_info(model_name)        
        
        return model_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update model configuration: {str(e)}")

@llm_models_router.delete("/models/{model_name}/reset", response_model=ModelResetResponse)
async def reset_model_configuration(
    model_name: str = Path(..., description="Name of the model to reset configuration for")
):
    """
    Reset model configuration to default values.
    
    Removes any custom configuration for the specified model and reverts to default settings.
    """
    try:
        if not await ollama_manager.is_model_available(model_name):
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        success = ollama_manager.delete_model_configuration(model_name)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to reset model configuration")
        
        model_info = await ollama_manager.get_model_info(model_name)
        
        return ModelResetResponse(success=success, model_info=model_info)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset model configuration: {str(e)}")

from typing import List, Optional
from pydantic import BaseModel, Field

class ModelGenerationParams(BaseModel):
    """ Generation parameter settings for LLM models."""
    ollama_model_name: Optional[str] = Field(None, description="Ollama model name")
    temperature: Optional[float] = Field(0.8, ge=0.0, le=1.0, description="Sampling temperature")
    top_p: Optional[float] = Field(0.9, ge=0.0, le=1.0, description="Top-p (nucleus) sampling")
    top_k: Optional[int] = Field(40, ge=1, description="Top-k sampling")
    max_tokens: Optional[int] = Field(500, ge=1, description="Maximum tokens to generate")
    repeat_last_n: Optional[int] = Field(64, ge=1, description="Number of tokens to consider for repetition")
    repeat_penalty: Optional[float] = Field(1.1, ge=0.0, description="Repetition penalty")
    context_length: Optional[int] = Field(2048, ge=1, description="Context window length")
    seed: Optional[int] = Field(None, ge=0, description="Random seed")
    gpu_count: Optional[int] = Field(0, ge=-1, description="Number of GPUs to use. -1 means the number must be set dynamically, and 0 disables GPU usage.")

class ModelMetadata(BaseModel):
    """ Metadata for LLM models. """
    name: str = Field(..., description="Model name")
    description: str = Field(..., description="Model description")
    version: str = Field(..., description="Model version")
    size: Optional[int] = Field(None, description="Model size in bytes")
    parameter_count: Optional[str] = Field(None, description="Number of parameters (e.g., '7B', '13B')")
    architecture: Optional[str] = Field(None, description="Model architecture")
    quantization: Optional[str] = Field(None, description="Quantization method")

class ModelInfo(BaseModel):
    """ Information about a specific LLM model. """
    metadata: ModelMetadata = Field(default_factory=ModelMetadata, description="Model metadata")
    generation_params: ModelGenerationParams = Field(default_factory=ModelGenerationParams, description="Model generation parameters") 

class ModelsResponse(BaseModel):
    """Response containing available models."""
    models: List[ModelInfo] = Field(..., description="List of available models")

 

class ModelResetResponse(BaseModel):
    """Response containing the result of a model reset."""
    success: bool = Field(..., description="Whether the model reset was successful")
    model_info: ModelInfo = Field(..., description="Model information after reset")
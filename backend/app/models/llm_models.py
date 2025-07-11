from typing import List, Optional
from pydantic import BaseModel, Field

class ModelHyperparameters(BaseModel):
    """ Configuration settings for LLM models."""
    temperature: float = Field(0.3, ge=0.0, le=1.0, description="Sampling temperature")
    top_p: Optional[float] = Field(0.9, ge=0.0, le=1.0, description="Top-p (nucleus) sampling")
    top_k: Optional[int] = Field(40, ge=1, description="Top-k sampling")
    max_tokens: Optional[int] = Field(500, ge=1, description="Maximum tokens to generate")
    repeat_penalty: Optional[float] = Field(1.1, ge=0.0, description="Repetition penalty")
    context_length: Optional[int] = Field(2048, ge=1, description="Context window length")
    gpu_count: Optional[int] = Field(0, ge=0, description="Number of GPUs to use")

class ModelMetadata(BaseModel):
    """ Metadata for LLM models. """
    name: str = Field(..., description="Model name")
    description: str = Field(..., description="Model description")
    version: str = Field(..., description="Model version")
    size: Optional[int] = Field(None, description="Model size in bytes")
    parameter_count: Optional[str] = Field(None, description="Number of parameters (e.g., '7B', '13B')")
    architecture: Optional[str] = Field(None, description="Model architecture")
    quantization: Optional[str] = Field(None, description="Quantization method")
    # embedding_length: Optional[int] = Field(None, description="Embedding dimension length")
    # context_length: Optional[int] = Field(None, description="Maximum context length")

class ModelInfo(BaseModel):
    """ Information about a specific LLM model. """
    metadata: ModelMetadata = Field(default_factory=ModelMetadata, description="Model metadata")
    hyperparameters: ModelHyperparameters = Field(default_factory=ModelHyperparameters, description="Model hyperparameters") 

class ModelsResponse(BaseModel):
    """Response containing available models."""
    models: List[ModelInfo] = Field(..., description="List of available models") 
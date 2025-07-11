from typing import List
from pydantic import BaseModel, Field

from app.models.analysis import ApplicationType

class Prompt(BaseModel):
    """A prompt defined by the user."""
    name: str = Field(..., description="Prompt name/identifier used to store and retrieve a prompt")
    title: str = Field(..., description="Human-readable title")
    description: str = Field(..., description="Description of what this prompt does")
    application: ApplicationType = Field(..., description="Type of application this prompt is used for")
    input_variables: List[str] = Field(..., description="Variables required by this prompt")
    template: str = Field(..., description="The prompt template")
    version: str = Field("1.0.0", description="Prompt version")
    preferred_models: List[str] = Field(default_factory=list, description="Models this prompt works best with")
    tags: List[str] = Field(default_factory=list, description="Tags for categorizing prompts")


class PromptsResponse(BaseModel):
    """Response containing available prompts."""
    prompts: List[Prompt] = Field(..., description="List of available prompts") 
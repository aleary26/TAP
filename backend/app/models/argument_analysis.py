from typing import List, Optional
from pydantic import BaseModel, Field

class LogicalFrameworkStep(BaseModel):
    """A step in the logical framework analysis."""
    step_number: str = Field(..., description="Step identifier (e.g., '1', '2', '∴')")
    statement: str = Field(..., description="The logical statement for this step")

class Argument(BaseModel):
    """Analysis of a single argument found in the text."""
    argument: str = Field(..., description="The argument being made")
    supporting_claims: List[str] = Field(default_factory=list, description="Claims that support this argument")
    qualifiers: List[str] = Field(default_factory=list, description="Qualifiers or limitations mentioned")
    logical_framework: List[LogicalFrameworkStep] = Field(default_factory=list, description="Logical structure of the argument")
    model_assessment: str = Field(..., description="Analysis model's assessment of the argument quality and support")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence in the argument analysis")

class ArgumentAnalysisResult(BaseModel):
    """ Complete argument analysis results for input text. """
    arguments: List[Argument] = Field(..., description="Arguments extracted from the text")
    overall_assessment: str = Field(..., description="Overall assessment of the text's argumentation")
    credibility_score: float = Field(..., ge=0.0, le=1.0, description="Overall credibility score")
    argument_count: int = Field(..., ge=0, description="Total number of arguments identified")
    well_supported_arguments: int = Field(..., ge=0, description="Number of well-supported arguments")
    
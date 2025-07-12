from typing import Optional, Union
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

from app.models.argument_analysis import ArgumentAnalysisResult

class ApplicationType(Enum):
    """Enum for different application types."""
    ARGUMENT_ANALYSIS = "argument_analysis"

class AnalysisRequest(BaseModel):
    """Request model for text analysis."""
    text: str = Field(..., min_length=10, description="Text to analyse")
    application: ApplicationType = Field(..., description="Type of analysis to perform")
    model_name: Optional[str] = Field(default=None, description="Analysis model to use")
    prompt_name: Optional[str] = Field(default=None, description="Name of the prompt to use for analysis")

AnalysisResult = Union[ArgumentAnalysisResult] # Eventually, this will contain all possible analysis results

class AnalysisStatistics(BaseModel):
    """Statistics for an analysis."""        
    created_at: datetime = Field(..., description="Timestamp of the analysis")
    total_duration: int = Field(..., description="Total time taken to process the analysis (ns)")
    load_duration: int = Field(..., description="Time to load the model into memory (ns)")
    load_time_ratio: float = Field(..., description="The proportion of time spent loading the model into memory")
    time_to_first_token: float = Field(..., description="Time taken to generate the first token (s)")
    prompt_eval_count: int = Field(..., description="Number of tokens in the input prompt")
    prompt_eval_duration: int = Field(..., description="Time to process prompt (ns)")
    prompt_tokens_per_second: float = Field(..., description="The rate of processing input tokens")
    prompt_time_ratio: float = Field(..., description="The proportion of time spent processing the input prompt")
    eval_count: int = Field(..., description="Number of tokens generated for the response") 
    eval_duration: int = Field(..., description="Time to generate the complete response (ns)")       
    tokens_per_second: float = Field(..., description="The rate of token generation for the response")
    generation_time_ratio: float = Field(..., description="The proportion of time spent generating the response")
    total_throughput_tokens_per_sec: float = Field(..., description="Total throughput tokens per second")       
    context_length: int = Field(..., description="The size of the context window") 
    context_window_prompt_fill_rate: float = Field(..., description="How much of the model's context window is used by the input prompt")
    context_window_response_fill_rate: float = Field(..., description="How much of the model's context window is used by the response")  
    overhead_time: int = Field(..., description="Overhead time (ns)")

class AnalysisResponse(BaseModel):
    """ Response model for analsysis results. """
    model_used: str = Field(..., description="Model used for analysis")
    success: bool = Field(..., description="Whether the analysis was successful")
    timestamp: datetime = Field(default_factory=datetime.now, description="Analysis timestamp")
    result: Optional[AnalysisResult] = Field(default=None, description="Tool specific analysis result")
    raw_model_response: Optional[str] = Field(None, description="Raw model response")
    statistics: Optional[AnalysisStatistics] = Field(None, description="Analysis statistics and metadata") 



from fastapi import APIRouter, HTTPException

from app.models.analysis import (
    ApplicationType,
    AnalysisRequest,
    AnalysisResponse
)

from app.services.argument_analyzer import argument_analyzer

analysis_router = APIRouter()

@analysis_router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Route request to the correct analysis function. Currently supports the following applications:

    - argument_analysis: Analyze text for arguments and their credibility.
    """
    try:
        match request.application:
            case ApplicationType.ARGUMENT_ANALYSIS:
                return await argument_analyzer.analyze_text(
                    text=request.text,
                    model_name=request.model_name,
                    prompt_name=request.prompt_name
                )
            case _:
                raise HTTPException(status_code=400, detail="Invalid analysis type specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

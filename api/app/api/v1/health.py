from fastapi import APIRouter

health_check_router = APIRouter()

@health_check_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "text-analysis-api"} 
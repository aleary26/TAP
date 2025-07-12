from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.api.v1 import analysis, prompts, health, models

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_description,
    debug=settings.debug,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.health_check_router, prefix=settings.api_prefix, tags=["Health Check"])
app.include_router(analysis.analysis_router, prefix=settings.api_prefix, tags=["Text Analysis"])
app.include_router(prompts.prompts_router, prefix=settings.api_prefix, tags=["Prompt Management"])
app.include_router(models.llm_models_router, prefix=settings.api_prefix, tags=["Model Management"])

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": settings.app_description,
        "docs_url": "/docs",
        "health_url": f"{settings.api_prefix}/health"
    }

def main():
    uvicorn.run(app, host=settings.host, port=settings.port, reload=settings.debug)

if __name__ == "__main__":
    main()
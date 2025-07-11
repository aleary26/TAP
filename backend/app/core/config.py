from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Applciations settings."""
    app_name: str = "Text Analysis Platform (TAP)"
    app_version: str = "0.1.0"
    app_description: str = "A platform for text analysis and processing."

    # CORS settings
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"] # Only allow local dev origins for now

    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000

    # API settings
    api_prefix: str = "/api/v1"

    # Dev settings
    debug: bool = True

    # LLM model settings
    ollama_base_url: str = "http://localhost:11434"    
    langchain_verbose: bool = False

    class Config:
        env_file = ".env"

settings = Settings()


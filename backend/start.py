#!/usr/bin/env python3
"""
Startup script for the TAP API.
"""

import uvicorn
from app.core.config import settings

def main():
    """
    Main entry point for the TAP API.
    """
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Debug mode: {settings.debug}")
    print(f"API will be available at: http://localhost:8000{settings.api_prefix}")
    print("API documentation will be available at: http://localhost:8000/docs")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info"
    )

if __name__ == "__main__":
    main()
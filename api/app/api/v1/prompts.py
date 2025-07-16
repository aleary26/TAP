from fastapi import APIRouter, HTTPException, Path

from app.services.prompt_manager import prompt_manager
from app.models.prompts import PromptsResponse, Prompt

prompts_router = APIRouter()

@prompts_router.get("/prompts", response_model=PromptsResponse)
async def get_prompts():
    """Get a list of all available prompts."""
    try:
        prompts = prompt_manager.get_all_prompts()
        return PromptsResponse(prompts=prompts.values())
    except Exception as e:
        print(f"Error fetching prompts: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get prompts: {str(e)}")

@prompts_router.post("/prompts", response_model=Prompt)
async def create_prompt(prompt: Prompt):
    """Create a new prompt."""
    try:
        success = prompt_manager.create_prompt(prompt)
        if not success:
            raise HTTPException(status_code=500, detail="Prompt creation failed")
        return prompt
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create prompt: {str(e)}")

@prompts_router.put("/prompts/{prompt_name}", response_model=Prompt)
async def update_prompt(
    prompt: Prompt,
    prompt_name: str = Path(..., description="Name of the prompt to update")
):
    """Update an existing prompt."""
    try:
        success = prompt_manager.update_prompt(prompt_name, prompt)
        if not success:
            raise HTTPException(status_code=404, detail=f"'{prompt_name}' not found")
        return prompt
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update prompt: {str(e)}")

@prompts_router.delete("/prompts/{prompt_name}", response_model=bool)
async def delete_prompt(
    prompt_name: str = Path(..., description="Name of the prompt to delete")
):
    """Delete a prompt by name."""
    try:
        success = prompt_manager.delete_prompt(prompt_name)
        if not success:
            raise HTTPException(status_code=404, detail=f"'{prompt_name}' not found")
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete prompt: {str(e)}")



import os
import json
from typing import Dict, Optional, List
from langchain.prompts import PromptTemplate


from app.models.prompts import Prompt

class PromptManager:
    """Manages prompts created by the user."""
    def __init__(self, prompts_dir: str = "prompts"):
        self.prompts_dir = prompts_dir
        self.prompts: Dict[str, Prompt] = {}
        self._ensure_prompts_directory()
        self._load_prompts_from_directory()

    def _ensure_prompts_directory(self):
        """Ensure the prompts directory exists."""       
        if not os.path.exists(self.prompts_dir):
            os.makedirs(self.prompts_dir)

    def _load_prompt_from_file(self, prompt_name: str) -> Optional[Prompt]:
        """Load a prompt from a JSON file."""
        try:
            with open(os.path.join(self.prompts_dir, f"{prompt_name}.json"), "r", encoding="utf-8") as file:
                data = json.load(file)
                return Prompt(**data) 
        except FileNotFoundError:
            print(f"Prompt '{prompt_name}' not found.")            
        except Exception as e:
            print(f"Error loading prompt '{prompt_name}': {e}")
        return None
            
    def _load_prompts_from_directory(self):
        """Load prompts from the prompts directory."""      
        for filename in os.listdir(self.prompts_dir):
            if filename.endswith(".json"):
                prompt_name = filename[:-5]  # Remove .json extension
                prompt = self._load_prompt_from_file(prompt_name)
                if prompt:
                    self.prompts[prompt.name] = prompt

    def get_prompt(self, prompt_name: str) -> Optional[Prompt]:
        """Retrieve a prompt by name. If not found, attempt to retrieve it from the file system."""
        if prompt_name in self.prompts:
            return self.prompts[prompt_name]
                
        prompt = self._load_prompt_from_file(prompt_name)
        if prompt:
            self.prompts[prompt.name] = prompt
            return prompt
        return None
        
    def get_all_prompts(self) -> Dict[str, Prompt]:
        """Refresh cached prompts and return them."""
        self._load_prompts_from_directory()
        return self.prompts.copy()
    
    def _save_prompt_to_file(self, prompt_name: str, prompt: Prompt):
        """Save a prompt to a JSON file."""        
        try:
            with open(os.path.join(self.prompts_dir, f"{prompt_name}.json"), "w", encoding="utf-8") as file:
                json.dump(prompt.model_dump(mode='json'), file, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"Error saving prompt '{prompt_name}': {e}")
            raise

    def create_prompt(self, prompt: Prompt) -> bool:
        """Write a new prompt to the file system and add it to the cache."""
        try:
            self._save_prompt_to_file(prompt.name, prompt)
            self.prompts[prompt.name] = prompt
            return True
        except Exception as e:
            print(f"Error creating prompt '{prompt.name}': {e}")
            return False
        
    def update_prompt(self, prompt_name: str, prompt: Prompt) -> bool:
        """Overwrite an existing prompt in the file system and update the cache."""
        if prompt_name not in self.prompts:
            print(f"Prompt '{prompt_name}' does not exist.")
            return False
        if prompt.name != prompt_name:
            print(f"Prompt name mismatch: expected '{prompt_name}', got '{prompt.name}'")
            return False
        
        try:
            self._save_prompt_to_file(prompt_name, prompt)
            self.prompts[prompt_name] = prompt
            return True
        except Exception as e:
            print(f"Error updating prompt '{prompt_name}': {e}")
            raise
        
    def delete_prompt(self, prompt_name: str) -> bool:
        """Delete a prompt from the file system and the cache."""
        success = False
        if os.path.exists(os.path.join(self.prompts_dir, f"{prompt_name}.json")):
            try:
                os.remove(os.path.join(self.prompts_dir, f"{prompt_name}.json"))
                success = True
            except Exception as e:
                print(f"Error deleting prompt '{prompt_name}': {e}")
                raise
        
        if prompt_name in self.prompts:
            del self.prompts[prompt_name]
            success = True
        
        return success

    def create_langchain_prompt(self, prompt_name: str) -> Optional[PromptTemplate]:
        """Create a LangChain PromptTemplate from a user-defined prompt"""
        prompt = self.get_prompt(prompt_name)
        if prompt:
            return PromptTemplate(
                input_variables=prompt.input_variables,
                template=prompt.template
            )
        return None
    
prompt_manager = PromptManager() 

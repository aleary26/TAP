import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { ModelInfo, ModelHyperparameters } from '@/types/models';
import type { Prompt } from '@/types/prompts';
import type { ApplicationType } from '@/types/analysis';
import { apiService } from '@/services/api';

// State interface
interface PlatformState {
  models: ModelInfo[];
  prompts: Prompt[];
  activeModelName: string;
  activePromptName: string;
  activeApplicationType: ApplicationType;
  modelsLoading: boolean;
  promptsLoading: boolean;
  modelsError: string | null;
  promptsError: string | null;
}

// Action types
type PlatformAction =
  | { type: 'SET_MODELS'; payload: ModelInfo[] }
  | { type: 'SET_PROMPTS'; payload: Prompt[] }
  | { type: 'SET_ACTIVE_MODEL'; payload: string }
  | { type: 'SET_ACTIVE_PROMPT'; payload: string }
  | { type: 'SET_ACTIVE_APPLICATION'; payload: ApplicationType }
  | { type: 'SET_MODELS_LOADING'; payload: boolean }
  | { type: 'SET_PROMPTS_LOADING'; payload: boolean }
  | { type: 'SET_MODELS_ERROR'; payload: string | null }
  | { type: 'SET_PROMPTS_ERROR'; payload: string | null }
  | { type: 'UPDATE_MODEL'; payload: ModelInfo };

// Initial state
const initialState: PlatformState = {
  models: [],
  prompts: [],
  activeModelName: '',
  activePromptName: '',
  activeApplicationType: 'argument_analysis',
  modelsLoading: false,
  promptsLoading: false,
  modelsError: null,
  promptsError: null,
};

// Reducer
function platformReducer(
  state: PlatformState,
  action: PlatformAction
): PlatformState {
  switch (action.type) {
    case 'SET_MODELS':
      return { ...state, models: action.payload };
    case 'SET_PROMPTS':
      return { ...state, prompts: action.payload };
    case 'SET_ACTIVE_MODEL':
      return { ...state, activeModelName: action.payload };
    case 'SET_ACTIVE_PROMPT':
      return { ...state, activePromptName: action.payload };
    case 'SET_ACTIVE_APPLICATION':
      return { ...state, activeApplicationType: action.payload };
    case 'SET_MODELS_LOADING':
      return { ...state, modelsLoading: action.payload };
    case 'SET_PROMPTS_LOADING':
      return { ...state, promptsLoading: action.payload };
    case 'SET_MODELS_ERROR':
      return { ...state, modelsError: action.payload };
    case 'SET_PROMPTS_ERROR':
      return { ...state, promptsError: action.payload };
    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map(model =>
          model.metadata.name === action.payload.metadata.name ? action.payload : model
        )
      };
    default:
      return state;
  }
}

// Context interface
interface PlatformContextType {
  state: PlatformState;
  setActiveModel: (modelName: string) => void;
  setActivePrompt: (promptName: string) => void;
  setActiveApplication: (applicationType: ApplicationType) => void;
  loadModels: () => Promise<void>;
  loadPrompts: () => Promise<void>;
  refreshPrompts: () => Promise<void>;
  updateModel: (modelName: string, hyperparameters: ModelHyperparameters) => Promise<ModelInfo>;
  resetModel: (modelName: string) => Promise<ModelInfo>;
}

// Create context
const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

// Provider component
interface PlatformProviderProps {
  children: ReactNode;
}

export const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(platformReducer, initialState);

  // Load models function
  const loadModels = async () => {
    dispatch({ type: 'SET_MODELS_LOADING', payload: true });
    dispatch({ type: 'SET_MODELS_ERROR', payload: null });
    
    try {
      const response = await apiService.getModels();
      dispatch({ type: 'SET_MODELS', payload: response.models });
      
      // Set first model as active if no active model is set
      if (response.models.length > 0) {
        dispatch({ type: 'SET_ACTIVE_MODEL', payload: response.models[0].metadata.name });
      }
    } catch (error) {
      console.error('Error loading models:', error);
      dispatch({ 
        type: 'SET_MODELS_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load models. Please ensure Ollama is running.' 
      });
    } finally {
      dispatch({ type: 'SET_MODELS_LOADING', payload: false });
    }
  };

  // Load prompts function
  const loadPrompts = async () => {
    dispatch({ type: 'SET_PROMPTS_LOADING', payload: true });
    dispatch({ type: 'SET_PROMPTS_ERROR', payload: null });
    
    try {
      const response = await apiService.getPrompts();
      dispatch({ type: 'SET_PROMPTS', payload: response.prompts });
      
      // Set first prompt as active if no active prompt is set
      if (response.prompts.length > 0) {
        dispatch({ type: 'SET_ACTIVE_PROMPT', payload: response.prompts[0].name });
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      dispatch({ 
        type: 'SET_PROMPTS_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load prompts' 
      });
    } finally {
      dispatch({ type: 'SET_PROMPTS_LOADING', payload: false });
    }
  };

  // Set active model
  const setActiveModel = (modelName: string) => {
    dispatch({ type: 'SET_ACTIVE_MODEL', payload: modelName });
  };

  // Set active prompt
  const setActivePrompt = (promptName: string) => {
    dispatch({ type: 'SET_ACTIVE_PROMPT', payload: promptName });
  };

  // Set active application
  const setActiveApplication = (applicationType: ApplicationType) => {
    dispatch({ type: 'SET_ACTIVE_APPLICATION', payload: applicationType });
  };

  // Refresh prompts (alias for loadPrompts for component compatibility)
  const refreshPrompts = loadPrompts;

  // Update model hyperparameters
  const updateModel = async (modelName: string, hyperparameters: ModelHyperparameters): Promise<ModelInfo> => {
    try {
      const updatedModel = await apiService.updateModel(modelName, hyperparameters);
      dispatch({ type: 'UPDATE_MODEL', payload: updatedModel });
      return updatedModel;
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  };

  // Reset model hyperparameters to defaults
  const resetModel = async (modelName: string): Promise<ModelInfo> => {
    try {
      const response = await apiService.resetModel(modelName);
      dispatch({ type: 'UPDATE_MODEL', payload: response.model_info });
      return response.model_info;
    } catch (error) {
      console.error('Error resetting model:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    loadModels();
    loadPrompts();
  }, []);

  const contextValue: PlatformContextType = {
    state,
    setActiveModel,
    setActivePrompt,
    setActiveApplication,
    loadModels,
    loadPrompts,
    refreshPrompts,
    updateModel,
    resetModel,
  };

  return (
    <PlatformContext.Provider value={contextValue}>
      {children}
    </PlatformContext.Provider>
  );
};

// Custom hook to use the context
export const usePlatformContext = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }
  return context;
};

// Convenience hooks for specific parts of the state
export const useModels = () => {
  const { state, setActiveModel, loadModels, updateModel, resetModel } = usePlatformContext();
  return {
    models: state.models,
    activeModelName: state.activeModelName,
    modelsLoading: state.modelsLoading,
    modelsError: state.modelsError,
    setActiveModel,
    loadModels,
    updateModel,
    resetModel,
  };
};

export const usePrompts = () => {
  const { state, setActivePrompt, loadPrompts, refreshPrompts } = usePlatformContext();
  return {
    prompts: state.prompts,
    activePromptName: state.activePromptName,
    promptsLoading: state.promptsLoading,
    promptsError: state.promptsError,
    setActivePrompt,
    loadPrompts,
    refreshPrompts,
  };
};

export const useApplications = () => {
  const { state, setActiveApplication } = usePlatformContext();
  return {
    activeApplicationType: state.activeApplicationType,
    setActiveApplication,
  };
}; 
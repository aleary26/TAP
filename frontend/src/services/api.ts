import type {
  AnalysisRequest,
  AnalysisResponse,
  MessageResponse,
} from "../types/analysis";
import type { ModelsResponse } from "../types/models";
import type { PromptsResponse, Prompt } from "../types/prompts";
import type {
  ApiAnalysisResponse,
  ApiModelsResponse,
  ApiPromptsResponse,
  ApiPrompt,
  ApiMessageResponse,
} from "../types/api";
import {
  transformAnalysisRequestToApi,
  transformAnalysisResponseFromApi,
  transformModelsResponseFromApi,
  transformPromptsResponseFromApi,
  transformPromptToApi,
  transformPromptFromApi,
  transformMessageResponseFromApi,
} from "../utils/api-transformers";

const API_BASE = "http://localhost:8000/api/v1";

class APIError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      let errorMessage = `HTTP error with status: ${response.status}`;
      let errorDetails = undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
        errorDetails = errorData.details;
      } catch {
        /* fail silently and use default message */
      }
      throw new APIError(errorMessage, response.status, errorDetails);
    }

    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : ((await response.text()) as unknown as T);
  } catch (error) {
    // If the error is already an instance of the APIError, rethrow it.
    // Otherwise, reformat the error as an APIError before throwing.
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      `Network error: ${
        error instanceof Error ? error.message : "type unknown"
      }`,
      0
    );
  }
}

export const apiService = {
  // Model Management
  async getModels(): Promise<ModelsResponse> {
    const apiResponse = await makeRequest<ApiModelsResponse>("/models");
    return transformModelsResponseFromApi(apiResponse);
  },

  // Prompt Management
  async getPrompts(): Promise<PromptsResponse> {
    const apiResponse = await makeRequest<ApiPromptsResponse>("/prompts");
    return transformPromptsResponseFromApi(apiResponse);
  },

  async createPrompt(prompt: Prompt): Promise<Prompt> {
    const apiPrompt = transformPromptToApi(prompt);
    const apiResponse = await makeRequest<ApiPrompt>("/prompts", {
      method: "POST",
      body: JSON.stringify(apiPrompt),
    });
    return transformPromptFromApi(apiResponse);
  },

  async updatePrompt(prompt: Prompt): Promise<Prompt> {
    if (!prompt.name) {
      throw new APIError("Prompt name is required for update", 400);
    }

    const apiPrompt = transformPromptToApi(prompt);
    const apiResponse = await makeRequest<ApiPrompt>(`/prompts/${prompt.name}`, {
      method: "PUT",
      body: JSON.stringify(apiPrompt),
    });
    return transformPromptFromApi(apiResponse);
  },

  async deletePrompt(promptName: string): Promise<MessageResponse> {
    const apiResponse = await makeRequest<ApiMessageResponse>(`/prompts/${promptName}`, {
      method: "DELETE",
    });
    return transformMessageResponseFromApi(apiResponse);
  },

  // Analysis
  async analyzeText(request: AnalysisRequest): Promise<AnalysisResponse> {
    const apiRequest = transformAnalysisRequestToApi(request);
    const apiResponse = await makeRequest<ApiAnalysisResponse>("/analyze", {
      method: "POST",
      body: JSON.stringify(apiRequest),
    });
    return transformAnalysisResponseFromApi(apiResponse);
  },
};

export interface ModelHyperparemters {
    temperature: number;
    topP?: number;
    topK?: number;
    maxTokens?: number;
    repeatLastN?: number;
    repeatPenalty?: number;
    contextLength?: number;
    seed?: number;
    gpuCount?: number;
}

export interface ModelMetadata {
    name: string;
    description: string;
    version: string;
    size?: number;
    parameterCount?: string;
    architecture?: string;
    quantization?: string;
}

export interface ModelInfo {
    metadata: ModelMetadata;
    hyperparameters: ModelHyperparemters;
}

export interface ModelsResponse {
  models: ModelInfo[];
}
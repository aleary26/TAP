// Backend API Types 
export interface ApiLogicalFrameworkStep {
    step_number: string;
    statement: string;
}

export interface ApiArgument {
    argument: string;
    supporting_claims: string[];
    qualifiers: string[];
    logical_framework: ApiLogicalFrameworkStep[];
    model_assessment: string;
    confidence_score: number;
}

export interface ApiArgumentAnalysisResult {
    arguments: ApiArgument[];
    overall_assessment: string;
    credibility_score: number;
    argument_count: number;
    well_supported_arguments: number;
}

export interface ApiAnalysisRequest {
    text: string;
    application: string;
    model_name?: string;
    prompt_name?: string;
}

export interface ApiAnalysisStatistics {
    created_at: string;
    total_duration: number;
    load_duration: number;
    load_time_ratio: number;
    time_to_first_token: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    prompt_tokens_per_second: number;
    prompt_time_ratio: number;
    eval_count: number;
    eval_duration: number;
    tokens_per_second: number;
    generation_time_ratio: number;
    total_throughput_tokens_per_sec: number;
    context_length: number;
    context_window_prompt_fill_rate: number;
    context_window_response_fill_rate: number;
    overhead_time: number;
}

export interface ApiAnalysisResponse {
    model_used: string;
    success: boolean;
    timestamp: string;
    result: ApiArgumentAnalysisResult;
    raw_model_response: string;
    statistics: ApiAnalysisStatistics;
}

export interface ApiModelHyperparameters {
    temperature: number;
    top_p?: number;
    top_k?: number;
    max_tokens?: number;
    repeat_last_n?: number;
    repeat_penalty?: number;
    context_length?: number;
    seed?: number;
    gpu_count?: number;
}

export interface ApiModelMetadata {
    name: string;
    description: string;
    version: string;
    size?: number;
    parameter_count?: string;
    architecture?: string;
    quantization?: string;
}

export interface ApiModelInfo {
    metadata: ApiModelMetadata;
    hyperparameters: ApiModelHyperparameters;
}

export interface ApiModelsResponse {
    models: ApiModelInfo[];
}

export interface ApiPrompt {
    name: string;
    title: string;
    description: string;
    application: string;
    input_variables: string[];
    template: string;
    version: string;
    preferred_models: string[];
    tags: string[];
}

export interface ApiPromptsResponse {
    prompts: ApiPrompt[];
}

export interface ApiMessageResponse {
    message: string;
}

export interface ApiModelResetResponse {
    success: boolean;
    model_info: ApiModelInfo;
}
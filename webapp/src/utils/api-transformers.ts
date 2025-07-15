import type {
  AnalysisRequest,
  AnalysisResponse,
  AnalysisStatistics,
  MessageResponse,
  ApplicationType,
} from '@/types/analysis';
import type { ModelsResponse, ModelInfo } from '@/types/models';
import type { PromptsResponse, Prompt } from '@/types/prompts';
import type { ArgumentAnalysisResult, LogicalFrameworkStep, Argument } from '@/types/argument-analysis';

import type {
  ApiAnalysisRequest,
  ApiAnalysisResponse,
  ApiAnalysisStatistics,
  ApiMessageResponse,
  ApiModelsResponse,
  ApiModelInfo,
  ApiPromptsResponse,
  ApiPrompt,
  ApiArgumentAnalysisResult,
  ApiLogicalFrameworkStep,
  ApiArgument,
} from '@/types/api';

// Analysis Request Transformers
export function transformAnalysisRequestToApi(request: AnalysisRequest): ApiAnalysisRequest {
  return {
    text: request.text,
    application: request.applicationType,
    model_name: request.modelName,
    prompt_name: request.promptName
  };
}

// Analysis Response Transformers
export function transformLogicalFrameworkStepFromApi(step: ApiLogicalFrameworkStep): LogicalFrameworkStep {
  return {
    stepNumber: step.step_number,
    statement: step.statement
  };
}

export function transformArgumentFromApi(arg: ApiArgument): Argument {
  return {
    argument: arg.argument,
    supportingClaims: arg.supporting_claims,
    qualifiers: arg.qualifiers,
    logicalFramework: arg.logical_framework.map(transformLogicalFrameworkStepFromApi),
    modelAssessment: arg.model_assessment,
    confidenceScore: arg.confidence_score
  };
}

export function transformArgumentAnalysisResultFromApi(result: ApiArgumentAnalysisResult): ArgumentAnalysisResult {
  return {
    arguments: result.arguments.map(transformArgumentFromApi),
    overallAssessment: result.overall_assessment,
    credibilityScore: result.credibility_score,
    argumentCount: result.argument_count,
    wellSupportedArgumentsCount: result.well_supported_arguments
  };
}

export function transformAnalysisStatisticsFromApi(stats: ApiAnalysisStatistics): AnalysisStatistics {
  return {
    createdAt: stats.created_at,
    totalDuration: stats.total_duration,
    loadDuration: stats.load_duration,
    loadTimeRatio: stats.load_time_ratio,
    timeToFirstToken: stats.time_to_first_token,
    promptEvalCount: stats.prompt_eval_count,
    promptEvalDuration: stats.prompt_eval_duration,
    promptTokensPerSecond: stats.prompt_tokens_per_second,
    promptTimeRatio: stats.prompt_time_ratio,
    evalCount: stats.eval_count,
    evalDuration: stats.eval_duration,
    tokensPerSecond: stats.tokens_per_second,
    generationTimeRatio: stats.generation_time_ratio,
    totalThroughputTokensPerSec: stats.total_throughput_tokens_per_sec,
    contextLength: stats.context_length,
    contextWindowPromptFillRate: stats.context_window_prompt_fill_rate,
    contextWindowResponseFillRate: stats.context_window_response_fill_rate,
    overheadTime: stats.overhead_time
  };
}

export function transformAnalysisResponseFromApi(response: ApiAnalysisResponse): AnalysisResponse {
  const result = transformArgumentAnalysisResultFromApi(response.result);
  
  return {
    modelUsed: response.model_used,
    success: response.success,
    timestamp: response.timestamp,
    result,
    rawModelResponse: response.raw_model_response,
    statistics: transformAnalysisStatisticsFromApi(response.statistics)
  };
}

export function transformModelInfoFromApi(modelInfo: ApiModelInfo): ModelInfo {
  return {
    metadata: {
      name: modelInfo.metadata.name,
      description: modelInfo.metadata.description,
      version: modelInfo.metadata.version,
      size: modelInfo.metadata.size,
      parameterCount: modelInfo.metadata.parameter_count,
      architecture: modelInfo.metadata.architecture,
      quantization: modelInfo.metadata.quantization
    },
    hyperparameters: {
      temperature: modelInfo.hyperparameters.temperature,
      topP: modelInfo.hyperparameters.top_p,
      topK: modelInfo.hyperparameters.top_k,
      maxTokens: modelInfo.hyperparameters.max_tokens,
      repeatLastN: modelInfo.hyperparameters.repeat_last_n,
      repeatPenalty: modelInfo.hyperparameters.repeat_penalty,
      contextLength: modelInfo.hyperparameters.context_length,
      seed: modelInfo.hyperparameters.seed,
      gpuCount: modelInfo.hyperparameters.gpu_count
    }
  };
}

export function transformModelsResponseFromApi(response: ApiModelsResponse): ModelsResponse {
  return {
    models: response.models.map(transformModelInfoFromApi)
  };
}

export function transformPromptFromApi(prompt: ApiPrompt): Prompt {
  return {
    name: prompt.name,
    title: prompt.title,
    description: prompt.description,
    application: prompt.application as ApplicationType,
    inputVariables: prompt.input_variables,
    template: prompt.template,
    version: prompt.version,
    preferredModels: prompt.preferred_models,
    tags: prompt.tags
  };
}

export function transformPromptToApi(prompt: Prompt): ApiPrompt {
  return {
    name: prompt.name,
    title: prompt.title,
    description: prompt.description,
    application: prompt.application,
    input_variables: prompt.inputVariables,
    template: prompt.template,
    version: prompt.version,
    preferred_models: prompt.preferredModels,
    tags: prompt.tags
  };
}

export function transformPromptsResponseFromApi(response: ApiPromptsResponse): PromptsResponse {
  return {
    prompts: response.prompts.map(transformPromptFromApi)
  };
}

export function transformMessageResponseFromApi(response: ApiMessageResponse): MessageResponse {
  return {
    message: response.message
  };
} 
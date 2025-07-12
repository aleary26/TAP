import type { ArgumentAnalysisResult } from '@/types/argument-analysis';

const ApplicationType = {
    ARGUMENT_ANALYSIS: 'argument_analysis',
};
export type ApplicationType = (typeof ApplicationType)[keyof typeof ApplicationType];

export interface AnalysisRequest {
    text: string;
    applicationType: ApplicationType;
    modelName: string;
    promptName: string;
};

export interface AnalysisStatistics {
    createdAt: string;
    totalDuration: number;
    loadDuration: number;
    loadTimeRatio: number;
    timeToFirstToken: number;
    promptEvalCount: number;
    promptEvalDuration: number;
    promptTokensPerSecond: number;
    promptTimeRatio: number;
    evalCount: number;
    evalDuration: number;
    tokensPerSecond: number;
    generationTimeRatio: number;
    totalThroughputTokensPerSec: number;
    contextLength: number;
    contextWindowPromptFillRate: number;
    contextWindowResponseFillRate: number;
    overheadTime: number;
}

export interface AnalysisResponse {
    modelUsed: string;
    success: boolean;
    timestamp: string;
    result: ArgumentAnalysisResult; // TODO: eventually this will be a union type for different analysis types
    rawModelResponse: string;
    statistics: AnalysisStatistics;
}

export interface MessageResponse {
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}




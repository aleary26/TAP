import type { ApplicationType } from '@/types/analysis';

export interface Prompt {
    name: string;
    title: string;
    description: string;
    application: ApplicationType;
    inputVariables: string[];
    template: string;
    version: string;
    preferredModels: string[];
    tags: string[];
}

export interface PromptsResponse {
    prompts: Prompt[];
}



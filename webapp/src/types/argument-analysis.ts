export interface LogicalFrameworkStep {
    stepNumber: string; // string to allow for symbols like ∴ (therefore) and other formats
    statement: string;
}

export interface Argument {
    argument: string;
    supportingClaims: string[];
    qualifiers: string[];
    logicalFramework: LogicalFrameworkStep[];
    modelAssessment: string;
    confidenceScore: number;
}

export interface ArgumentAnalysisResult {
    arguments: Argument[];
    overallAssessment: string;
    credibilityScore: number;
    argumentCount: number;
    wellSupportedArgumentsCount: number;
}

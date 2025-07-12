import React from "react";
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Brain,
  FileText,
  Target,
} from "lucide-react";
import type { ArgumentAnalysisResult } from "@/types/argument-analysis";
import ArgumentCard from "@/components/apps/argument_analysis/molecules/ArgumentCard";
import MetricCard from "@/components/core/atoms/MetricCard";

interface ArgumentAnalysisResultsProps {
  modelUsed: string;
  result: ArgumentAnalysisResult;
}

const ArgumentAnalysis: React.FC<ArgumentAnalysisResultsProps> = ({
  modelUsed,
  result,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "green";
    if (score >= 0.6) return "orange";
    return "red";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Moderate";
    return "Low";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Argument Analysis Results
          </h2>
          <span className="text-sm text-gray-500">
            Model: {modelUsed}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={BarChart3}
            title="Credibility"
            value={`${Math.round(result.credibilityScore * 100)}%`}
            description={getScoreLabel(result.credibilityScore)}
            colorClass={getScoreColor(result.credibilityScore)}
          />

          <MetricCard
            icon={Target}
            title="Arguments"
            value={result.argumentCount}
            description="Total identified"
            colorClass="blue"
          />

          <MetricCard
            icon={CheckCircle}
            title="Strong"
            value={result.wellSupportedArgumentsCount}
            description="Well-supported"
            colorClass="green"
          />

          <MetricCard
            icon={AlertTriangle}
            title="Weak"
            value={result.argumentCount - result.wellSupportedArgumentsCount}
            description="Weak arguments"
            colorClass="orange"
          />

        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              Overall Assessment
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed text-left">
            {result.overallAssessment}
          </p>
        </div>
      </div>

      {result.arguments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Detailed Argument Analysis</span>
          </h3>
          <div className="space-y-6">
            {result.arguments.map((argument, index) => (
              <ArgumentCard key={index} argument={argument} />
            ))}
          </div>
        </div>
      )}

      {result.arguments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Arguments Identified
          </h3>
          <p className="text-gray-600 text-left">
            The analysis did not identify any clear argumentative claims in the
            provided text. This could mean the text is primarily descriptive or
            informational rather than argumentative.
          </p>
        </div>
      )}
    </div>
  );
};

export default ArgumentAnalysis;

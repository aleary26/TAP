import React from "react";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Brain,
  List,
  ArrowRight,
} from "lucide-react";
import type { Argument } from "@/types/argument-analysis";

interface ArgumentCardProps {
  argument: Argument;
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({ argument }) => {
  const getConfidenceColor = () => {
    if (argument.confidenceScore >= 0.8)
      return "text-success-600 bg-success-50";
    if (argument.confidenceScore >= 0.6)
      return "text-warning-600 bg-warning-50";
    return "text-danger-600 bg-danger-50";
  };

  const getConfidenceBorderColor = () => {
    if (argument.confidenceScore >= 0.8) return "border-l-success-500";
    if (argument.confidenceScore >= 0.6) return "border-l-warning-500";
    return "border-l-danger-500";
  };

  const getConfidenceLabel = () => {
    if (argument.confidenceScore >= 0.8) return "High Confidence";
    if (argument.confidenceScore >= 0.6) return "Moderate Confidence";
    return "Low Confidence";
  };

  return (
    <div
      className={`border rounded-lg p-6 border-l-4 ${getConfidenceBorderColor()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor()}`}
          >
            <Target className="h-4 w-4 mr-1" />
            Argument
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(argument.confidenceScore * 100)}% confidence
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor()}`}
        >
          {getConfidenceLabel()}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Main Argument
        </h4>
        <p className="text-gray-800 leading-relaxed text-left">{argument.argument}</p> 
      </div>

      {argument.supportingClaims.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Supporting Claims ({argument.supportingClaims.length})
          </h5>
          <ul className="space-y-2">
            {argument.supportingClaims.map((claim, index) => (
              <li
                key={index}
                className="text-sm text-green-700 flex items-start"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {claim}
              </li>
            ))}
          </ul>
        </div>
      )}

      {argument.qualifiers.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
          <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Qualifiers & Limitations ({argument.qualifiers.length})
          </h5>
          <ul className="space-y-2">
            {argument.qualifiers.map((qualifier, index) => (
              <li
                key={index}
                className="text-sm text-yellow-700 flex items-start"
              >
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {qualifier}
              </li>
            ))}
          </ul>
        </div>
      )}

      {argument.logicalFramework.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
            <List className="h-4 w-4 mr-1" />
            Logical Framework
          </h5>
          <div className="space-y-3">
            {argument.logicalFramework.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex-shrink-0">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-700 text-left">{step.statement}</p> 
                </div>
                {index < argument.logicalFramework.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <Brain className="h-4 w-4 mr-1" />
          AI Assessment
        </h5>
        <p className="text-sm text-gray-700 leading-relaxed text-left">
          {argument.modelAssessment}
        </p>
      </div>
    </div>
  );
};

export default ArgumentCard;

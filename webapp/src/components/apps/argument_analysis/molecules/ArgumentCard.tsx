import React from "react";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Brain,
  List,
} from "lucide-react";
import type { Argument } from "@/types/argument-analysis";
import HighlightCard from "@/components/core/atoms/HighlightCard";
import BulletList from "@/components/core/atoms/BulletList";
import LogicalFrameworkList from "@/components/apps/argument_analysis/molecules/LogicalFrameworkList";

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
        <HighlightCard 
          title={`Supporting Claims (${argument.supportingClaims.length})`} 
          color="green" 
          icon={<TrendingUp className="h-4 w-4 mr-1" />}
        >
          <BulletList
            items={argument.supportingClaims}
            bulletColor="bg-green-500"
            textColor="text-green-700"
          />
        </HighlightCard>
      )}

      {argument.qualifiers.length > 0 && (
        <HighlightCard 
          title={`Qualifiers & Limitations (${argument.qualifiers.length})`} 
          color="yellow" 
          icon={<AlertTriangle className="h-4 w-4 mr-1" />}
        >
          <BulletList
            items={argument.qualifiers}
            bulletColor="bg-yellow-500"
            textColor="text-yellow-700"
          />
        </HighlightCard>
      )}

      {argument.logicalFramework.length > 0 && (
        <HighlightCard 
          title="Logical Framework" 
          color="blue" 
          icon={<List className="h-4 w-4 mr-1" />}
        >
          <LogicalFrameworkList
            steps={argument.logicalFramework}
            stepColor="bg-blue-200 text-blue-800"
            textColor="text-blue-700"
            arrowColor="text-blue-400"
          />
        </HighlightCard>
      )}

      <HighlightCard title="AI Assessment" color="gray" icon={<Brain className="h-4 w-4 mr-1" />}>
        <p className="text-sm text-gray-700 leading-relaxed text-left">
          {argument.modelAssessment}
        </p>
      </HighlightCard>
    </div>
  );
};

export default ArgumentCard;

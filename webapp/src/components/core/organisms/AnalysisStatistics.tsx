import React from "react";
import {
  BarChart3,
  Clock,
  Database,
  Zap,
  FileText,
  Gauge
} from "lucide-react";
import type { AnalysisStatistics as AnalysisStatisticsType } from "@/types/analysis";
import MetricCard from "@/components/core/atoms/MetricCard";
import TokenUsageChart from "@/components/core/atoms/TokenUsageChart";
import ResponseTimeline from "@/components/core/atoms/ResponseTimeline";
import TokenThroughputDisplay from "@/components/core/molecules/TokenThroughputDisplay";
import { formatDuration, formatPercentage, formatNumber, formatTimestamp } from "@/utils/formatting";

interface AnalysisStatisticsProps {
  modelUsed: string;
  statistics?: AnalysisStatisticsType;
  timestamp?: string;
}

const AnalysisStatistics: React.FC<AnalysisStatisticsProps> = ({
  modelUsed,
  statistics,
  timestamp,
}) => { 

  if (!statistics) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Statistics Available</h3>
        <p className="text-gray-600">
          Statistics were not captured for this analysis. This may occur because the selected application does not support them.
        </p>
      </div>
    );
  }

  const totalTokens = (statistics.promptEvalCount || 0) + (statistics.evalCount || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Clock}
          title="Total Duration"
          value={formatDuration(statistics.totalDuration || 0)}
          description="End-to-End"
          colorClass="blue"
        />
        
        <MetricCard
          icon={Database}
          title="Token Count"
          value={formatNumber(totalTokens)}
          description="Prompt + Response"
          colorClass="green"
        />
        
        <MetricCard
          icon={Zap}
          title="Model Used"
          value={modelUsed}
          description="Analysis model"
          colorClass="purple"
        />
        
        <MetricCard
          icon={FileText}
          title="Analysis Time"
          value={formatTimestamp(timestamp)}
          description="Request timestamp"
          colorClass="orange"
        />
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Generation Timeline</h3>
        <ResponseTimeline
          loadDuration={statistics.loadDuration || 0}
          promptEvalDuration={statistics.promptEvalDuration || 0}
          evalDuration={statistics.evalDuration || 0}
          totalDuration={statistics.totalDuration || 0}
          timeToFirstToken={statistics.timeToFirstToken}
        />
      </div>

      <TokenThroughputDisplay
        timeToFirstToken={statistics.timeToFirstToken}
        promptTokensPerSecond={statistics.promptTokensPerSecond || 0}
        tokensPerSecond={statistics.tokensPerSecond || 0}
        totalThroughputTokensPerSec={statistics.totalThroughputTokensPerSec || 0}
      />

      {statistics.contextLength && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Context Window Usage</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TokenUsageChart
              promptTokens={statistics.promptEvalCount || 0}
              responseTokens={statistics.evalCount || 0}
            />
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                
                <MetricCard
                  icon={Gauge}
                  title="Prompt Fill Rate"
                  value={formatPercentage(statistics.contextWindowPromptFillRate || 0)}
                  description="% of consumed context used by prompt"
                  colorClass="blue"
                />
                
                <MetricCard
                  icon={Gauge}
                  title="Response Fill Rate"
                  value={formatPercentage(statistics.contextWindowResponseFillRate || 0)}
                  description="% of consumed context used by response"
                  colorClass="green"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      
      
    </div>
  );
};

export default AnalysisStatistics; 
 import React from "react";
import { TrendingUp, Clock, Zap, Timer } from "lucide-react";
import MetricCard from "@/components/core/atoms/MetricCard";
import { formatTokensPerSecond } from "@/utils/formatting";

interface TokenThroughputDisplayProps {
  timeToFirstToken: number;
  promptTokensPerSecond: number;
  tokensPerSecond: number;
  totalThroughputTokensPerSec: number;
}

const TokenThroughputDisplay: React.FC<TokenThroughputDisplayProps> = ({
  timeToFirstToken,
  promptTokensPerSecond,
  tokensPerSecond,
  totalThroughputTokensPerSec,
}) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Throughput</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Timer}
          title="TTFT"
          value={`${timeToFirstToken.toFixed(3)}s`}
          description="Time to first token"
          colorClass="blue"
        />
        
        <MetricCard
          icon={Clock}
          title="Prompt Speed"
          value={formatTokensPerSecond(promptTokensPerSecond)}
          description="Input processing"
          colorClass="purple"
        />
        
        <MetricCard
          icon={Zap}
          title="Generation"
          value={formatTokensPerSecond(tokensPerSecond)}
          description="Response generation"
          colorClass="green"
        />
        
        <MetricCard
          icon={TrendingUp}
          title="Overall"
          value={formatTokensPerSecond(totalThroughputTokensPerSec)}
          description="Total throughput"
          colorClass="orange"
        />
      </div>
    </div>
  );
};


export default TokenThroughputDisplay; 
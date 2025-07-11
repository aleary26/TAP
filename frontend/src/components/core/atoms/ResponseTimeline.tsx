import React from "react";
import { Clock, Database, Zap, Target } from "lucide-react";
import { formatDuration } from "@/utils/formatting";

interface ResponseTimelineProps {
  loadDuration: number;
  promptEvalDuration: number;
  evalDuration: number;
  totalDuration: number;
  timeToFirstToken?: number;
}

const ResponseTimeline: React.FC<ResponseTimelineProps> = ({
  loadDuration,
  promptEvalDuration,
  evalDuration,
  totalDuration
}) => {
  const overheadTime = totalDuration - loadDuration - promptEvalDuration - evalDuration;

  const phases = [
    {
      name: "Model Loading",
      duration: loadDuration,
      color: "bg-blue-500",
      icon: Database,
      description: "Loading model into memory",
    },
    {
      name: "Prompt Processing",
      duration: promptEvalDuration,
      color: "bg-purple-500",
      icon: Target,
      description: "Analyzing input prompt",
    },
    {
      name: "Response Generation",
      duration: evalDuration,
      color: "bg-green-500",
      icon: Zap,
      description: "Generating response tokens",
    },
    {
      name: "Overhead",
      duration: overheadTime,
      color: "bg-gray-400",
      icon: Clock,
      description: "System overhead",
    },
  ];

  const getPhaseWidth = (duration: number) => {
    if (totalDuration === 0) return 0;
    return (duration / totalDuration) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex h-8 bg-gray-200 rounded-lg overflow-hidden">
          {phases.map((phase, index) => {
            const width = getPhaseWidth(phase.duration);
            if (width <= 0) return null;
            
            return (
              <div
                key={index}
                className={`${phase.color} flex items-center justify-center relative group`}
                style={{ width: `${width}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                  {phase.name}: {formatDuration(phase.duration)}
                </div>
                {width > 10 && (
                  <phase.icon className="h-4 w-4 text-white" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0s</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {phases.map((phase, index) => {
          if (phase.duration <= 0) return null;
          
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${phase.color}`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{phase.name}</div>
                <div className="text-sm text-gray-600">{formatDuration(phase.duration)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {((phase.duration / totalDuration) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>      
    </div>
  );
};

export default ResponseTimeline; 
import React, { useState } from "react";
import {
  BarChart3,
  Code,
  Target,
} from "lucide-react";
import type { AnalysisResponse } from "@/types/analysis";
import ArgumentAnalysis from "@/components/apps/argument_analysis/organisms/ArgumentAnalysis";
import AnalysisStatistics from "@/components/core/organisms/AnalysisStatistics";
import AnalysisInProgressDisplay from "@/components/core/atoms/AnalysisInProgressDisplay";

interface TabbedArgumentAnalysisResultsProps {
  analysis: AnalysisResponse;
  isLoading?: boolean;
}

const TabbedArgumentAnalysisResults: React.FC<
  TabbedArgumentAnalysisResultsProps
> = ({ analysis, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<"results" | "statistics" | "response">(
    "results"
  );



  const tabs = [
    {
      id: "results" as const,
      label: "Argument Analysis",
      icon: <Target className="h-4 w-4" />,
      count: analysis.result.arguments.length,
    },
    {
      id: "statistics" as const,
      label: "Statistics & Metadata",
      icon: <BarChart3 className="h-4 w-4" />,
      count: analysis.statistics ? 1 : 0,
    },
    {
      id: "response" as const,
      label: "Response Content",
      icon: <Code className="h-4 w-4" />,
      count: analysis.rawModelResponse ? 1 : 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {isLoading && <AnalysisInProgressDisplay />}

      <div className={`p-6 ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}>
        {activeTab === 'results' && ( <ArgumentAnalysis modelUsed={analysis.modelUsed} result={analysis.result} /> )}

        {activeTab === 'statistics' && (
          <AnalysisStatistics
            modelUsed={analysis.modelUsed}
            statistics={analysis.statistics}
            timestamp={analysis.timestamp}
          />
        )}

        {activeTab === 'response' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Model Response</h3>
            <div className="bg-white border rounded p-3 max-h-128 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap text-left">
                {analysis.rawModelResponse}
              </pre>
            </div>
          </div>         
        )}
        
      </div>
    </div>
  );
};

export default TabbedArgumentAnalysisResults;

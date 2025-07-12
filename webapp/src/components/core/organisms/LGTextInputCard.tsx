import React, { useState, useMemo } from 'react';
import type { AnalysisRequest, AnalysisResponse } from '@/types/analysis';
import { apiService } from '@/services/api';
import { useModels, usePrompts, useApplications } from '@/contexts/PlatformContext';

interface LGTextInputCardProps {
  placeholder: string;
  label: string;
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: AnalysisResponse) => void;
  onAnalysisError: (error: string) => void;
  isAnalyzing: boolean;
}

const LGTextInputCard: React.FC<LGTextInputCardProps> = ({
  placeholder,
  label,
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
  isAnalyzing
}) => {
  const [text, setText] = useState("");

  const { models, activeModelName } = useModels();
  const { activePromptName } = usePrompts();
  const { activeApplicationType } = useApplications();

  const activeModelInfo = useMemo(
    () => models.find((m) => m.metadata.name === activeModelName),
    [models, activeModelName]
  );

  const handleAnalyze = async () => {
    if (!text.trim()) {
      onAnalysisError("Please entrer some text to analyze");
      return;
    }

    if (!activeModelName) {
      onAnalysisError("Please select a model first");
      return;
    }

    if (!activePromptName) {
      onAnalysisError("Please select a prompt first");
      return;
    }

    onAnalysisStart();

    try {
      const request: AnalysisRequest = {
        text: text.trim(),
        modelName: activeModelName,
        applicationType: activeApplicationType,
        promptName: activePromptName,
      };

      const result = await apiService.analyzeText(request);
      onAnalysisComplete(result);
    } catch (error: unknown) {
      console.error("Analysis failed:", error);
      onAnalysisError(
        error instanceof Error ? error.message : "Analysis failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-lg font-medium text-gray-700">
            {label}
          </label>
          {activeModelInfo && (
            <div className="text-sm text-gray-500">
              Using: {activeModelInfo.metadata.name}
            </div>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {text.length} characters
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim() || !activeModelName}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Text"}
        </button>
      </div>
    </div>
  );
};

export default LGTextInputCard; 
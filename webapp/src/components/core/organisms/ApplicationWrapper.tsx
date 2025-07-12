import React, { useState } from 'react';
import type { AnalysisResponse } from '@/types/analysis';
import { useApplications } from '@/contexts/PlatformContext';
import LGTextInputCard from '@/components/core/organisms/LGTextInputCard';
import ReadyDisplayCard from '@/components/apps/argument_analysis/molecules/ReadyDisplayCard';
import TabbedArgumentAnalysisResults from '@/components/apps/argument_analysis/organisms/TabbedArgumentAnalysisResults';

interface ApplicationWrapperProps {
  onError: (error: string) => void;
}

const ApplicationWrapper: React.FC<ApplicationWrapperProps> = ({ onError }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { activeApplicationType } = useApplications();

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleAnalysisError = (error: string) => {
    setIsAnalyzing(false);
    onError(error);
  };

  const loadAppComponent = (result: AnalysisResponse) => {
    switch (activeApplicationType) {
      case "argument_analysis":
        return <TabbedArgumentAnalysisResults analysis={result} isLoading={isAnalyzing} />;
      default:
        return <div>No application selected</div>;
    }
  };

  const getApplicationConfig = () => {
    switch (activeApplicationType) {
      case "argument_analysis":
        return {
          inputPlaceholder: "Enter the text you want to have analyzed by the selected application...",
          inputLabel: "Text to Analyze"
        };
      default:
        return {
          inputPlaceholder: "Enter text to analyze...",
          inputLabel: "Text to Analyze"
        };
    }
  };

  const appConfig = getApplicationConfig();

  return (
    <div className="lg:col-span-2 space-y-6">
      <LGTextInputCard
        placeholder={appConfig.inputPlaceholder}
        label={appConfig.inputLabel}
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
        isAnalyzing={isAnalyzing}
      />


      {analysisResult && loadAppComponent(analysisResult)}


      {!analysisResult && <ReadyDisplayCard isAnalyzing={isAnalyzing} />}
    </div>
  );
};

export default ApplicationWrapper; 
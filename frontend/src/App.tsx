import { useState } from "react";
import { useModels } from "@/contexts/PlatformContext";
import AppHeader from "@/components/core/atoms/AppHeader";
import AppFooter from "@/components/core/atoms/AppFooter";
import ErrorDisplay from "@/components/core/molecules/ErrorDisplay";
import PlatformSelector from "@/components/core/organisms/PlatformSelector";
import ApplicationWrapperComponent from "@/components/core/organisms/ApplicationWrapperComponent";

import "./App.css";

function App() {
  const [error, setError] = useState<string | null>(null);
  const { modelsError } = useModels();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AppHeader title="Text Analysis Platform" description="Evaluation and testing platform for AI-based text analysis applications" size="lg" />
        {(error || modelsError) && ( 
          <ErrorDisplay message={error || modelsError} allowDismiss={!!error} onClose={() => setError(null) } /> 
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PlatformSelector />
          </div>
          
          <ApplicationWrapperComponent onError={handleError} />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

export default App;

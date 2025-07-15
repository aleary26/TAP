import React, { useState, useMemo } from "react";
import { useModels } from "@/contexts/PlatformContext";
import ModelCard from "@/components/core/molecules/ModelCard";
import { ChevronDown } from "lucide-react";

const ModelSelector: React.FC = () => {
  const { models, activeModelName, setActiveModel } = useModels();
  const [showDropdown, setShowDropdown] = useState(false);

  const activeModelInfo = useMemo(
    () => models.find((m) => m.metadata.name === activeModelName),
    [models, activeModelName]
  );
  const inactiveModels = useMemo(
    () => models.filter((m) => m.metadata.name !== activeModelName),
    [models, activeModelName]
  );

  const handleModelSwitch = (modelName: string) => {
    setActiveModel(modelName);
    setShowDropdown(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">Model</h3>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span>Switch Model</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <div className="p-2 border-b">
                <p className="text-sm font-medium text-gray-700">
                  Available Models
                </p>
              </div>
              {inactiveModels.map((model) => (
                <ModelCard
                  key={model.metadata.name}
                  model={model.metadata}
                  isActive={false}
                  onActivate={handleModelSwitch}
                />
              ))}
              {inactiveModels.length === 0 && (
                <div className="p-4 text-gray-400 text-center text-sm">
                  No other models available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeModelInfo ? (
        <ModelCard
          model={activeModelInfo.metadata}
          modelInfo={activeModelInfo}
          isActive={true}
          onActivate={handleModelSwitch}
        />
      ) : (
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No active model selected</p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 
import React from "react";
import ApplicationSelector from "@/components/core/molecules/ApplicationSelector";
import ModelSelector from "@/components/core/molecules/ModelSelector";
import PromptSelector from "@/components/core/molecules/PromptSelector";

const PlatformSelector: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          TAP Management
        </h2>
      </div>

      <ApplicationSelector />

      <ModelSelector />

      <PromptSelector />
    </div>
  );
};

export default PlatformSelector; 
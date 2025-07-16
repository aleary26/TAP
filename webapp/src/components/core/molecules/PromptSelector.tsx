import React, { useState, useMemo } from "react";
import type { Prompt } from "@/types/prompts";
import { usePrompts, useApplications, usePlatformContext } from "@/contexts/PlatformContext";
import { ChevronDown } from "lucide-react";

const PromptSelector: React.FC = () => {
  const { prompts, activePromptName, setActivePrompt } = usePrompts();
  const { activeApplicationType } = useApplications();
  const { startEditingPrompt } = usePlatformContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPrompts = useMemo(
    () => prompts.filter((prompt) => prompt.application === activeApplicationType),
    [prompts, activeApplicationType]
  );

  const activePrompt = useMemo(
    () => filteredPrompts.find((p) => p.name === activePromptName),
    [filteredPrompts, activePromptName]
  );

  const handlePromptSwitch = (promptName: string) => {
    setActivePrompt(promptName);
    setShowDropdown(false);
  };

  const handlePromptEdit = (prompt: Prompt | null) => {
    startEditingPrompt(prompt, prompt === null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">Prompt</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span>Switch Prompt</span>
              <ChevronDown 
                            size={16}
                            className={`transform transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <div className="p-2 border-b">
                  <p className="text-sm font-medium text-gray-700">
                    Available Prompts
                  </p>
                </div>
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.name}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handlePromptSwitch(prompt.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {prompt.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {prompt.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {prompt.preferredModels.length > 0 && (
                            <span className="text-xs text-blue-600">
                              Works with: {prompt.preferredModels.join(", ")}
                            </span>
                          )}
                          {prompt.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {prompt.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {prompt.name === activePromptName && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredPrompts.length === 0 && (
                  <div className="p-4 text-gray-400 text-center text-sm">
                    No prompts available for this application
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => handlePromptEdit(null)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            New Prompt
          </button>
        </div>
      </div>

      {activePrompt ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-lg">{activePrompt.title}</div>
            <button
              onClick={() => handlePromptEdit(activePrompt)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-3 text-left">
            {activePrompt.description}
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Version: {activePrompt.version}</span>
            {activePrompt.preferredModels.length > 0 && (
              <span>
                Preferred Models: {activePrompt.preferredModels.join(", ")}
              </span>
            )}
          </div>
          {activePrompt.tags.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {activePrompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            No active prompt selected for {activeApplicationType}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptSelector; 
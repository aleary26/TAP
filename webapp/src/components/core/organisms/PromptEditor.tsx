import React, { useState, useEffect } from "react";
import type { ValidationResult } from "@/types/analysis";
import type { Prompt } from "@/types/prompts";
import type { ModelInfo } from "@/types/models";
import { textContainsJson } from "@/utils/validation";

interface PromptEditorProps {
  prompt: Prompt | null;
  isCreating: boolean;
  availableModels: ModelInfo[];
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  isCreating,
  availableModels,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Prompt>({
    name: "",
    title: "",
    description: "",
    application: "argument_analysis", // Assuming this is the only type for now
    inputVariables: [],
    template: "",
    version: "1.0.0",
    preferredModels: [],
    tags: [],
  });
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    if (prompt) {
      setFormData(prompt);
    }
  }, [prompt]);

  const validateForm = (): ValidationResult => {
    const errors: string[] = [];

    // Required fields
    if (!formData.name.trim()) errors.push("Prompt name is required");
    if (!formData.title.trim()) errors.push("Prompt title is required");
    if (!formData.description.trim()) errors.push("Prompt description is required");
    if (formData.name.length > 25) errors.push("Prompt name too long. Limit to 25 characters");
    if (formData.title.length > 25) errors.push("Prompt title too long. Limit to 25 characters");
    
    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      errors.push("Prompt name can only contain alphanumeric characters and underscores");
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(formData.title)) {
      errors.push( "Prompt title can only contain alphanumeric characters and spaces");
    }

    // There's no strict enforcement of the JSON format expected (yet). For now, just 
    // verify that the template contains a JSON object, and allow the response failing
    // to indicate that the template provided is invalid.
    if (!textContainsJson(formData.template)) {
      errors.push("Prompt template must contain a valid JSON object defining the expected output format. For an example of what's expected, review api/prompts/example/argument_analysis.json");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  useEffect(() => {
    if (!validation.isValid) {
      setValidation(validateForm());
    }
  }, [formData]);

  const handleInputChange = (field: keyof Prompt, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModelToggle = (modelName: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredModels: prev.preferredModels.includes(modelName)
        ? prev.preferredModels.filter((m) => m !== modelName)
        : [...prev.preferredModels, modelName],
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = () => {
    const validationResult = validateForm();
    if (validationResult.isValid) {
      onSave(formData);
    } else {
      setValidation(validationResult);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isCreating ? "Create New Prompt" : "Edit Prompt"}
        </h2>
        <p className="text-gray-600">
          {isCreating
            ? "Define a new prompt for text analysis."
            : "Edit the details of the prompt."}
        </p>
      </div>

      {!validation.isValid && (
        <div className="mb-6">
          {validation.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
              <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., argument_analysis_v1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for the prompt to be used for querying and as a file name.
            </p>
          </div>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Argument Analysis"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Display name for the prompt in the UI.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description of what this prompt does..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Template *
          </label>
          <textarea
            value={formData.template}
            onChange={(e) => handleInputChange("template", e.target.value)}
            placeholder="Enter your prompt template with input variables and expected JSON output format..."
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Template should include input variables (e.g., {"{text}"}) and specify the expected JSON output format.
          </p>
        </div>

        {/* Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => handleInputChange("version", e.target.value)}
              placeholder="1.0.0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Preferred Models */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Models
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableModels.map((model) => (
              <label
                key={model.metadata.name}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.preferredModels.includes(model.metadata.name)}
                  onChange={() => handleModelToggle(model.metadata.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {model.metadata.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {model.metadata.architecture} • {model.metadata.size}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-400">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!validation.isValid}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Create Prompt" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;

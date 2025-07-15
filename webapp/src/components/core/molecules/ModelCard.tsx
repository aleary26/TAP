import React from 'react';
import type { ModelMetadata } from "@/types/models";

interface ModelCardProps {
    model: ModelMetadata;
    isActive: boolean;
    onActivate: (modelName: string) => void;    
}

const ModelCard: React.FC<ModelCardProps> = ({
    model,
    isActive,
    onActivate
}) => {

    let displayItems = [];
    
    if (model.architecture) {
        displayItems.push(model.architecture);
    }
    if (model.size) {
        displayItems.push(`${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB`);
    }
    if (model.quantization) {
        displayItems.push(model.quantization);
    }    

    return (
      <div className={`p-2 ${isActive ? "bg-blue-50 rounded-lg border border-blue-500" : "hover:bg-gray-50 cursor-pointer"}`} onClick={() => onActivate(model.name)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{model.name}</div>
            <div className="text-xs text-gray-500">
              {displayItems.join(" • ")}
            </div>
          </div>
        </div>
      </div>
    );
};

export default ModelCard;
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
    return (
      <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onActivate(model.name)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{model.name}</div>
            <div className="text-xs text-gray-500">
              {model.architecture} • {model.size}
            </div>
          </div>
          {isActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      </div>
    );
};

export default ModelCard;
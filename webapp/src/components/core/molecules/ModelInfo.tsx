import React from 'react';
import type { ModelMetadata } from '@/types/models';
import { bytesToGigabytes } from '@/utils/conversions';

interface ModelInfoProps {
    model: ModelMetadata;
    isActive?: boolean;
}

const ModelInfo: React.FC<ModelInfoProps> = ({ model, isActive = false }) => {
    const displayItems = [];
    
    if (model.architecture) {
        displayItems.push(model.architecture);
    }
    if (model.size) {
        displayItems.push(`${bytesToGigabytes(model.size).toFixed(2)} GB`);
    }
    if (model.quantization) {
        displayItems.push(model.quantization);
    }

    const nameClass = isActive 
        ? "font-semibold text-lg text-blue-900 text-left" 
        : "font-medium text-sm";
    
    const detailsClass = isActive 
        ? "text-xs text-blue-600 mt-1"
        : "text-xs text-gray-500";

    return (
        <div>
            <div className={nameClass}>{model.name}</div>
            {displayItems.length > 0 && (
                <div className={detailsClass}>
                    {displayItems.join(" • ")}
                </div>
            )}
        </div>
    );
};

export default ModelInfo; 
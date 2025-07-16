import React, { useState, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import GenerationParamField from './GenerationParamField';
import type { ModelGenerationParams } from '@/types/models';

interface GenerationParamsListProps {
    generationParams: ModelGenerationParams;
    isEditing: boolean;
    editingGenerationParams?: ModelGenerationParams | null;
    onGenerationParamChange?: (key: keyof ModelGenerationParams, value: number | undefined) => void;
    defaultRowsToShow?: number;
}

const GenerationParamsList: React.FC<GenerationParamsListProps> = ({
    generationParams,
    isEditing,
    editingGenerationParams,
    onGenerationParamChange,
    defaultRowsToShow = 3
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setIsExpanded(true);
        }
    }, [isEditing]);

    const handleChange = (key: keyof ModelGenerationParams) => (value: number | undefined) => {
        onGenerationParamChange?.(key, value);
    };

    const getEditingValue = (key: keyof ModelGenerationParams) => {
        return isEditing ? editingGenerationParams?.[key] : generationParams[key];
    };

    const shouldShowField = (key: keyof ModelGenerationParams) => {
        return generationParams[key] !== undefined || isEditing;
    };

    const fieldConfigs = [
        {
            key: 'temperature' as keyof ModelGenerationParams,
            label: 'Temperature',
            step: '0.1',
            min: '0',
            max: '2',
            alwaysShow: true
        },
        {
            key: 'contextLength' as keyof ModelGenerationParams,
            label: 'Context Length',
            min: '1'
        },
        {
            key: 'topP' as keyof ModelGenerationParams,
            label: 'Top P',
            step: '0.1',
            min: '0',
            max: '1'
        },
        {
            key: 'topK' as keyof ModelGenerationParams,
            label: 'Top K',
            min: '1'
        },
        {
            key: 'maxTokens' as keyof ModelGenerationParams,
            label: 'Max Tokens',
            min: '1'
        },
        {
            key: 'repeatPenalty' as keyof ModelGenerationParams,
            label: 'Repeat Penalty',
            step: '0.1',
            min: '0'
        },
        {
            key: 'repeatLastN' as keyof ModelGenerationParams,
            label: 'Repeat Last N',
            min: '1'
        },
        {
            key: 'seed' as keyof ModelGenerationParams,
            label: 'Seed',
            min: '0'
        },
        {
            key: 'gpuCount' as keyof ModelGenerationParams,
            label: 'GPU Count',
            min: '-1'
        }
    ];

    const visibleFields = fieldConfigs.filter(config => 
        config.alwaysShow || shouldShowField(config.key)
    );

    const fieldsToShow = isExpanded ? visibleFields : visibleFields.slice(0, defaultRowsToShow);
    const hasMoreFields = visibleFields.length > defaultRowsToShow;

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <Settings size={16} className="text-blue-600" />
                    <span className="text-blue-900">Generation Params</span>W
                </div>
                {hasMoreFields && !isEditing && (
                    <button
                        onClick={toggleExpansion}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                    >
                        <span>{isExpanded ? 'Show less' : `Show ${visibleFields.length - defaultRowsToShow} more`}</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm transition-all duration-300 ease-in-out">
                {fieldsToShow.map((config) => (
                    <GenerationParamField
                        key={config.key}
                        label={config.label}
                        value={getEditingValue(config.key)}
                        isEditing={isEditing}
                        onChange={handleChange(config.key)}
                        step={config.step}
                        min={config.min}
                        max={config.max}
                    />
                ))}
            </div>

            {!isExpanded && hasMoreFields && !isEditing && (
                <div className="mt-2 text-center">
                    <div className="text-xs text-gray-400">
                        {visibleFields.length - defaultRowsToShow} more parameter{visibleFields.length - defaultRowsToShow !== 1 ? 's' : ''} available
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerationParamsList; 
import React from 'react';
import { Settings } from 'lucide-react';
import HyperparameterField from './HyperparameterField';
import type { ModelHyperparameters } from '@/types/models';

interface HyperparametersListProps {
    hyperparameters: ModelHyperparameters;
    isEditing: boolean;
    editingHyperparameters?: ModelHyperparameters | null;
    onHyperparameterChange?: (key: keyof ModelHyperparameters, value: number | undefined) => void;
}

const HyperparametersList: React.FC<HyperparametersListProps> = ({
    hyperparameters,
    isEditing,
    editingHyperparameters,
    onHyperparameterChange
}) => {
    const handleChange = (key: keyof ModelHyperparameters) => (value: number | undefined) => {
        onHyperparameterChange?.(key, value);
    };

    const getEditingValue = (key: keyof ModelHyperparameters) => {
        return isEditing ? editingHyperparameters?.[key] : hyperparameters[key];
    };

    const shouldShowField = (key: keyof ModelHyperparameters) => {
        return hyperparameters[key] !== undefined || isEditing;
    };

    return (
        <div className="border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-3">
                <Settings size={16} className="text-blue-600" />
                <span className="font-medium text-blue-900">Hyperparameters</span>
            </div>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm">
                {/* Temperature */}
                <HyperparameterField
                    label="Temperature"
                    value={getEditingValue('temperature')}
                    isEditing={isEditing}
                    onChange={handleChange('temperature')}
                    step="0.1"
                    min="0"
                    max="2"
                />

                {/* Context Length */}
                {shouldShowField('contextLength') && (
                    <HyperparameterField
                        label="Context Length"
                        value={getEditingValue('contextLength')}
                        isEditing={isEditing}
                        onChange={handleChange('contextLength')}
                        min="1"
                    />
                )}

                {/* Top P */}
                {shouldShowField('topP') && (
                    <HyperparameterField
                        label="Top P"
                        value={getEditingValue('topP')}
                        isEditing={isEditing}
                        onChange={handleChange('topP')}
                        step="0.1"
                        min="0"
                        max="1"
                    />
                )}

                {/* Top K */}
                {shouldShowField('topK') && (
                    <HyperparameterField
                        label="Top K"
                        value={getEditingValue('topK')}
                        isEditing={isEditing}
                        onChange={handleChange('topK')}
                        min="1"
                    />
                )}

                {/* Max Tokens */}
                {shouldShowField('maxTokens') && (
                    <HyperparameterField
                        label="Max Tokens"
                        value={getEditingValue('maxTokens')}
                        isEditing={isEditing}
                        onChange={handleChange('maxTokens')}
                        min="1"
                    />
                )}

                {/* Repeat Penalty */}
                {shouldShowField('repeatPenalty') && (
                    <HyperparameterField
                        label="Repeat Penalty"
                        value={getEditingValue('repeatPenalty')}
                        isEditing={isEditing}
                        onChange={handleChange('repeatPenalty')}
                        step="0.1"
                        min="0"
                    />
                )}

                {/* Repeat Last N */}
                {shouldShowField('repeatLastN') && (
                    <HyperparameterField
                        label="Repeat Last N"
                        value={getEditingValue('repeatLastN')}
                        isEditing={isEditing}
                        onChange={handleChange('repeatLastN')}
                        min="1"
                    />
                )}

                {/* Seed */}
                {shouldShowField('seed') && (
                    <HyperparameterField
                        label="Seed"
                        value={getEditingValue('seed')}
                        isEditing={isEditing}
                        onChange={handleChange('seed')}
                        min="0"
                    />
                )}

                {/* GPU Count */}
                {shouldShowField('gpuCount') && (
                    <HyperparameterField
                        label="GPU Count"
                        value={getEditingValue('gpuCount')}
                        isEditing={isEditing}
                        onChange={handleChange('gpuCount')}
                        min="-1"
                    />
                )}
            </div>
        </div>
    );
};

export default HyperparametersList; 
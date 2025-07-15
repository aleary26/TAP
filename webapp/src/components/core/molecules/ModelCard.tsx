import React, { useState } from 'react';
import { Settings, RotateCcw, Edit, Save, X } from 'lucide-react';
import type { ModelMetadata, ModelInfo, ModelHyperparameters } from "@/types/models";
import { useModels } from '@/contexts/PlatformContext';

interface ModelCardProps {
    model: ModelMetadata;
    modelInfo?: ModelInfo;
    isActive: boolean;
    onActivate: (modelName: string) => void;    
}

const ModelCard: React.FC<ModelCardProps> = ({
    model,
    modelInfo,
    isActive,
    onActivate
}) => {
    const { updateModel, resetModel } = useModels();
    const [isEditing, setIsEditing] = useState(false);
    const [editingHyperparameters, setEditingHyperparameters] = useState<ModelHyperparameters | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [hasEditsThisSession, setHasEditsThisSession] = useState(false);

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

    const handleEdit = () => {
        if (modelInfo) {
            setEditingHyperparameters({ ...modelInfo.hyperparameters });
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingHyperparameters(null);
    };

    const handleSave = async () => {
        if (editingHyperparameters) {
            setIsUpdating(true);
            try {
                await updateModel(model.name, editingHyperparameters);
                setIsEditing(false);
                setEditingHyperparameters(null);
                setHasEditsThisSession(true);
            } catch (error) {
                console.error('Failed to update model:', error);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetModel(model.name);
            setHasEditsThisSession(false);
        } catch (error) {
            console.error('Failed to reset model:', error);
        } finally {
            setIsResetting(false);
        }
    };

    const handleHyperparameterChange = (key: keyof ModelHyperparameters, value: number | undefined) => {
        if (editingHyperparameters) {
            setEditingHyperparameters({
                ...editingHyperparameters,
                [key]: value
            });
        }
    };

    if (!isActive) {
        return (
            <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onActivate(model.name)}>
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
    }

    return (
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-500">
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-lg text-blue-900">{model.name}</div>
                <div className="flex space-x-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={handleEdit}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                disabled={!modelInfo}
                            >
                                <Edit size={14} />
                                <span>Edit</span>
                            </button>
                            {hasEditsThisSession && (
                                <button
                                    onClick={handleReset}
                                    className="text-sm text-orange-600 hover:text-orange-800 flex items-center space-x-1"
                                    disabled={isResetting || !modelInfo}
                                >
                                    <RotateCcw size={14} />
                                    <span>{isResetting ? 'Resetting...' : 'Reset'}</span>
                                </button>
                            )}
                        </>
                    )}
                    {isEditing && (
                        <>
                            <button
                                onClick={handleSave}
                                className="text-sm text-green-600 hover:text-green-800 flex items-center space-x-1"
                                disabled={isUpdating}
                            >
                                <Save size={14} />
                                <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                            >
                                <X size={14} />
                                <span>Cancel</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
                        
            <div className="flex items-center space-x-4 text-xs text-blue-600 mb-4">
                {displayItems.length > 0 && (
                    <span>{displayItems.join(" • ")}</span>
                )}
            </div>

            {modelInfo && (
                <div className="border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                        <Settings size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-900">Hyperparameters</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm">
                        {/* Temperature */}
                        <div className="flex items-center">
                            <label className="text-gray-700 font-medium flex-1 text-left">Temperature:</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="2"
                                    value={editingHyperparameters?.temperature || 0}
                                    onChange={(e) => handleHyperparameterChange('temperature', parseFloat(e.target.value) || 0)}
                                    className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                />
                            ) : (
                                <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.temperature}</div>
                            )}
                        </div>

                        {/* Context Length */}
                        {(modelInfo.hyperparameters.contextLength !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Context Length:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editingHyperparameters?.contextLength || ''}
                                        onChange={(e) => handleHyperparameterChange('contextLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.contextLength || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* Top P */}
                        {(modelInfo.hyperparameters.topP !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Top P:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="1"
                                        value={editingHyperparameters?.topP || ''}
                                        onChange={(e) => handleHyperparameterChange('topP', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-200 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.topP || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* Top K */}
                        {(modelInfo.hyperparameters.topK !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Top K:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editingHyperparameters?.topK || ''}
                                        onChange={(e) => handleHyperparameterChange('topK', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.topK || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* Max Tokens */}
                        {(modelInfo.hyperparameters.maxTokens !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Max Tokens:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editingHyperparameters?.maxTokens || ''}
                                        onChange={(e) => handleHyperparameterChange('maxTokens', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.maxTokens || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        

                        {/* Repeat Penalty */}
                        {(modelInfo.hyperparameters.repeatPenalty !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Repeat Penalty:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={editingHyperparameters?.repeatPenalty || ''}
                                        onChange={(e) => handleHyperparameterChange('repeatPenalty', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.repeatPenalty || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* Repeat Last N */}
                        {(modelInfo.hyperparameters.repeatLastN !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Repeat Last N:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editingHyperparameters?.repeatLastN || ''}
                                        onChange={(e) => handleHyperparameterChange('repeatLastN', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.repeatLastN || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* Seed */}
                        {(modelInfo.hyperparameters.seed !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">Seed:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingHyperparameters?.seed || ''}
                                        onChange={(e) => handleHyperparameterChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.seed || 'N/A'}</div>
                                )}
                            </div>
                        )}

                        {/* GPU Count */}
                        {(modelInfo.hyperparameters.gpuCount !== undefined || isEditing) && (
                            <div className="flex items-center">
                                <label className="text-gray-700 font-medium flex-1 text-left">GPU Count:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="-1"
                                        value={editingHyperparameters?.gpuCount || ''}
                                        onChange={(e) => handleHyperparameterChange('gpuCount', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-right text-gray-900 w-16 px-1"
                                    />
                                ) : (
                                    <div className="text-gray-900 w-16 text-right">{modelInfo.hyperparameters.gpuCount || 'N/A'}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelCard;
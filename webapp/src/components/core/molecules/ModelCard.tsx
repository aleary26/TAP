import React, { useState } from 'react';
import type { ModelMetadata, ModelInfo, ModelGenerationParams } from "@/types/models";
import { useModels } from '@/contexts/PlatformContext';
import ModelInfoDisplay from './ModelInfo';
import ModelCardActions from './ModelCardActions';
import GenerationParamsList from './GenerationParamsList';

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
    const [editingGenerationParams, setEditingGenerationParams] = useState<ModelGenerationParams | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [hasEditsThisSession, setHasEditsThisSession] = useState(false);

    const handleEdit = () => {
        if (modelInfo) {
            setEditingGenerationParams({ ...modelInfo.generationParams });
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingGenerationParams(null);
    };

    const handleSave = async () => {
        if (editingGenerationParams) {
            setIsUpdating(true);
            try {
                await updateModel(model.name, editingGenerationParams);
                setIsEditing(false);
                setEditingGenerationParams(null);
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

    const handleGenerationParamChange = (key: keyof ModelGenerationParams, value: number | undefined) => {
        if (editingGenerationParams) {
            setEditingGenerationParams({
                ...editingGenerationParams,
                [key]: value
            });
        }
    };

    if (!isActive) {
        return (
            <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onActivate(model.name)}>
                <div className="flex items-center justify-between">
                    <div>
                        <ModelInfoDisplay model={model} isActive={false} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-500">
            <div className="flex items-center justify-between mb-2">
                <ModelInfoDisplay model={model} isActive={true} />
                <ModelCardActions
                    isEditing={isEditing}
                    isUpdating={isUpdating}
                    isResetting={isResetting}
                    hasEditsThisSession={hasEditsThisSession}
                    canEdit={!!modelInfo}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    onReset={handleReset}
                />
            </div>

            {modelInfo && (
                <GenerationParamsList
                    generationParams={modelInfo.generationParams}
                    isEditing={isEditing}
                    editingGenerationParams={editingGenerationParams}
                    onGenerationParamChange={handleGenerationParamChange}
                />
            )}
        </div>
    );
};

export default ModelCard;
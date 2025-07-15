import React, { useState } from 'react';
import type { ModelMetadata, ModelInfo, ModelHyperparameters } from "@/types/models";
import { useModels } from '@/contexts/PlatformContext';
import ModelInfoDisplay from './ModelInfo';
import ModelCardActions from './ModelCardActions';
import HyperparametersList from './HyperparametersList';

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
                <HyperparametersList
                    hyperparameters={modelInfo.hyperparameters}
                    isEditing={isEditing}
                    editingHyperparameters={editingHyperparameters}
                    onHyperparameterChange={handleHyperparameterChange}
                />
            )}
        </div>
    );
};

export default ModelCard;
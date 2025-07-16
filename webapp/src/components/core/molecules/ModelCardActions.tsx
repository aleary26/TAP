import React from 'react';
import { RotateCcw, Edit, Save, X } from 'lucide-react';

interface ModelCardActionsProps {
    isEditing: boolean;
    isUpdating: boolean;
    isResetting: boolean;
    hasEditsThisSession: boolean;
    canEdit: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onReset: () => void;
}

const ModelCardActions: React.FC<ModelCardActionsProps> = ({
    isEditing,
    isUpdating,
    isResetting,
    hasEditsThisSession,
    canEdit,
    onEdit,
    onSave,
    onCancel,
    onReset
}) => {
    if (isEditing) {
        return (
            <div className="flex space-x-2">
                <button
                    onClick={onSave}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center space-x-1"
                    disabled={isUpdating}
                >
                    <Save size={14} />
                    <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                    onClick={onCancel}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                    <X size={14} />
                    <span>Cancel</span>
                </button>
            </div>
        );
    }

    return (
        <div className="flex space-x-2">
            <button
                onClick={onEdit}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                disabled={!canEdit}
            >
                <Edit size={14} />
                <span>Edit</span>
            </button>
            {hasEditsThisSession && (
                <button
                    onClick={onReset}
                    className="text-sm text-orange-600 hover:text-orange-800 flex items-center space-x-1"
                    disabled={isResetting || !canEdit}
                >
                    <RotateCcw size={14} />
                    <span>{isResetting ? 'Resetting...' : 'Reset'}</span>
                </button>
            )}
        </div>
    );
};

export default ModelCardActions; 
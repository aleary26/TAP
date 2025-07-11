import React from "react";

interface ErrorDisplayProps {
    message: string | null;
    allowDismiss: boolean;
    onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, allowDismiss, onClose }) => {
    return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
                <div className="text-red-800">
                    <strong>Error:</strong> {message || "An unknown error occurred."}
                </div>
                {allowDismiss && (
                    <button
                        onClick={onClose}
                        className="ml-auto text-red-600 hover:text-red-800"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorDisplay;
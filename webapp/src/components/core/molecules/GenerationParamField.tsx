import React from 'react';
import GenerationParamInput from '../atoms/GenerationParamInput';

interface GenerationParamFieldProps {
    label: string;
    value: number | undefined;
    isEditing: boolean;
    onChange?: (value: number | undefined) => void;
    step?: string;
    min?: string;
    max?: string;
    displayValue?: string;
}

const GenerationParamField: React.FC<GenerationParamFieldProps> = ({
    label,
    value,
    isEditing,
    onChange,
    step,
    min,
    max,
    displayValue
}) => {
    const formatDisplayValue = () => {
        if (displayValue) return displayValue;
        return value?.toString() ?? 'N/A';
    };

    return (
        <div className="flex items-center">
            <label className="text-gray-700 font-medium flex-1 text-left">
                {label}:
            </label>
            {isEditing && onChange ? (
                <GenerationParamInput
                    type="number"
                    value={value || ''}
                    onChange={onChange}
                    step={step}
                    min={min}
                    max={max}
                />
            ) : (
                <div className="text-gray-900 w-16 text-right">
                    {formatDisplayValue()}
                </div>
            )}
        </div>
    );
};

export default GenerationParamField; 
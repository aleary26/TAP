import React from 'react';
import HyperparameterInput from '../atoms/HyperparameterInput';

interface HyperparameterFieldProps {
    label: string;
    value: number | undefined;
    isEditing: boolean;
    onChange?: (value: number | undefined) => void;
    step?: string;
    min?: string;
    max?: string;
    displayValue?: string;
}

const HyperparameterField: React.FC<HyperparameterFieldProps> = ({
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
                <HyperparameterInput
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

export default HyperparameterField; 
import React from 'react';

interface HyperparameterInputProps {
    type: 'number';
    value: number | string;
    onChange: (value: number | undefined) => void;
    step?: string;
    min?: string;
    max?: string;
    className?: string;
}

const HyperparameterInput: React.FC<HyperparameterInputProps> = ({
    type,
    value,
    onChange,
    step,
    min,
    max,
    className = ""
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            onChange(undefined);
            return;
        }
        
        if (step && step.includes('.')) {
            onChange(parseFloat(inputValue) || undefined);
        } else {
            onChange(parseInt(inputValue) || undefined);
        }
    };

    return (
        <input
            type={type}
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className={`
                bg-transparent 
                border-0 
                border-b 
                border-gray-300 
                focus:border-blue-500 
                focus:ring-0 
                focus:outline-none
                text-right 
                text-gray-900 
                w-16 
                px-1
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                ${className}
            `}
        />
    );
};

export default HyperparameterInput; 
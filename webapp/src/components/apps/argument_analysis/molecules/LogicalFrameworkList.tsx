import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LogicalStep {
    stepNumber: string;
    statement: string;
}

interface LogicalFrameworkListProps {
    steps: LogicalStep[];
    stepColor: string;
    textColor: string;
    arrowColor: string;
}

const LogicalFrameworkList: React.FC<LogicalFrameworkListProps> = ({ 
    steps, 
    stepColor, 
    textColor, 
    arrowColor 
}) => {
    return (
        <div className="space-y-3">
            {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                    <div className={`flex items-center justify-center w-6 h-6 ${stepColor} rounded-full text-xs font-semibold flex-shrink-0`}>
                        {step.stepNumber}
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm ${textColor} text-left`}>{step.statement}</p> 
                    </div>
                    {index < steps.length - 1 && (
                        <ArrowRight className={`h-4 w-4 ${arrowColor} flex-shrink-0 mt-0.5`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default LogicalFrameworkList; 
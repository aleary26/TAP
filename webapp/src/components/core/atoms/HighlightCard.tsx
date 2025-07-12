import React from 'react';

interface HighlightCardProps {
    title: string;    
    icon: React.ReactNode;
    color: string;
    children: React.ReactNode;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ title, icon, color, children }) => {    
    return (
        <div className={`mb-4 p-4 bg-${color}-50 rounded-lg`}>
            <h5 className={`text-sm font-semibold text-${color}-800 mb-2 flex items-center`}>
                {icon}
                {title}
            </h5>
            {children}
        </div>
    );
};

export default HighlightCard;
import React from 'react';

interface AppHeaderProps {
    title: string;
    description: string;
    size: "sm" | "md" | "lg";
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, description, size }) => {
    const sizeConfig = {
        sm: {
            headerTag: 'h3' as const,
            headerClasses: 'text-xl font-semibold text-gray-900 mb-2',
            descriptionClasses: 'text-gray-600 mb-6 max-w-md mx-auto'
        },
        md: {
            headerTag: 'h2' as const,
            headerClasses: 'text-2xl font-semibold text-gray-900 mb-2',
            descriptionClasses: 'text-md text-gray-600 mx-auto'
        },
        lg: {
            headerTag: 'h1' as const,
            headerClasses: 'text-4xl font-bold text-gray-900 mb-2',
            descriptionClasses: 'text-xl text-gray-600 mx-auto'
        }
    };

    const config = sizeConfig[size];
    const HeaderTag = config.headerTag;

    return (
        <div className="text-center mb-8">
            <HeaderTag className={config.headerClasses}>
                {title}
            </HeaderTag>
            <p className={config.descriptionClasses}>
                {description}
            </p>
        </div>
    );
};

export default AppHeader;
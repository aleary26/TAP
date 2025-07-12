import React from 'react';

interface BulletListProps {
    items: string[];
    bulletColor: string;
    textColor: string;
}

const BulletList: React.FC<BulletListProps> = ({ items, bulletColor, textColor }) => {
    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li
                    key={index}
                    className={`text-sm ${textColor} flex items-start`}
                >
                    <span className={`w-1.5 h-1.5 ${bulletColor} rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                    {item}
                </li>
            ))}
        </ul>
    );
};

export default BulletList; 
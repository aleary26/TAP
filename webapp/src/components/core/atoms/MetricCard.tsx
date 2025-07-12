import React from "react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  colorClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  colorClass = "bg-blue-50 text-blue-600",
}) => {
  const getColorClasses = () => {
    switch (colorClass) {
      case "blue":
        return {
          background: "bg-blue-50",
          icon: "text-blue-600",
          title: "text-blue-900",
          value: "text-blue-900",
          description: "text-blue-700",
        };
      case "green":
        return {
          background: "bg-green-50",
          icon: "text-green-600",
          title: "text-green-900",
          value: "text-green-900",
          description: "text-green-700",
        };
      case "purple":
        return {
          background: "bg-purple-50",
          icon: "text-purple-600",
          title: "text-purple-900",
          value: "text-purple-900",
          description: "text-purple-700",
        };
      case "orange":
        return {
          background: "bg-orange-50",
          icon: "text-orange-600",
          title: "text-orange-900",
          value: "text-orange-900",
          description: "text-orange-700",
        };
      case "red":
        return {
          background: "bg-red-50",
          icon: "text-red-600",
          title: "text-red-900",
          value: "text-red-900",
          description: "text-red-700",
        };
      case "gray":
        return {
          background: "bg-gray-50",
          icon: "text-gray-600",
          title: "text-gray-900",
          value: "text-gray-900",
          description: "text-gray-700",
        };
      default:
        return {
          background: "bg-blue-50",
          icon: "text-blue-600",
          title: "text-blue-900",
          value: "text-blue-900",
          description: "text-blue-700",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`${colors.background} p-4 rounded-lg`}>
      <div className="flex items-center space-x-2 mb-2">
        <Icon className={`h-5 w-5 ${colors.icon}`} />
        <span className={`font-medium ${colors.title}`}>{title}</span>
      </div>
      <div className={`text-lg font-bold ${colors.value}`}>
        {value}
      </div>
      {description && (
        <div className={`text-sm ${colors.description} mt-1`}>
          {description}
        </div>
      )}
    </div>
  );
};

export default MetricCard; 
import React, { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import type { ApplicationType } from "@/types/analysis";
import { useApplications } from "@/contexts/PlatformContext";

const APPLICATION_INFO: Record<ApplicationType, {
    title: string;
    description: string;
    icon: React.ReactNode;
}> = {
    argument_analysis: {
        title: "Argument Analysis",
        description: "Analyze text for logical arguments and credibility assessment",
        icon: <Brain size={24} className="text-purple-600" />,
    },
};

const ApplicationSelector: React.FC = () => {
    const { activeApplicationType, setActiveApplication } = useApplications();
    const [showDropdown, setShowDropdown] = useState(false);

    const activeAppInfo = APPLICATION_INFO[activeApplicationType];
    const availableApplications = Object.keys(APPLICATION_INFO) as ApplicationType[];
    const inactiveApplications = availableApplications.filter(app => app !== activeApplicationType);

    const handleApplicationSwitch = (applicationType: ApplicationType) => {
        setActiveApplication(applicationType);
        setShowDropdown(false);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">Application</h3>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <span>Switch Application</span>
                        <ChevronDown 
                            size={16}
                            className={`transform transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                            <div className="p-2 border-b">
                                <p className="text-sm font-medium text-gray-700">
                                    Available Applications
                                </p>
                            </div>
                            {inactiveApplications.map((appType) => {
                                const appInfo = APPLICATION_INFO[appType];
                                return (
                                    <div
                                        key={appType}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                        onClick={() => handleApplicationSwitch(appType)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{appInfo.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{appInfo.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {appInfo.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {inactiveApplications.length === 0 && (
                                <div className="p-4 text-gray-400 text-center text-sm">
                                    No other applications available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-start space-x-3">
                    <span className="text-3xl">{activeAppInfo.icon}</span>
                    <div className="flex-1">
                        <div className="font-semibold text-lg text-purple-900 text-left">
                            {activeAppInfo.title}
                        </div>
                        <div className="text-sm text-purple-700 mt-1 text-left">
                            {activeAppInfo.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationSelector; 
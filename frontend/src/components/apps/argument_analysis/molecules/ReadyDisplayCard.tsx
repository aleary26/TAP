import React from 'react';
import {
    FileText,
    Search,
    Brain
} from "lucide-react";
import MetricCard from "@/components/core/atoms/MetricCard";
import AppHeader from "@/components/core/atoms/AppHeader";
import AnalysisInProgressDisplay from "@/components/core/atoms/AnalysisInProgressDisplay";

const robotIcon = "🤖";

interface ReadyDisplayCardProps {
    isAnalyzing?: boolean;
}

const ReadyDisplayCard: React.FC<ReadyDisplayCardProps> = ({ isAnalyzing = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {isAnalyzing && <AnalysisInProgressDisplay />}
            <div className={`p-8 text-center ${isAnalyzing ? 'opacity-75' : ''}`}>
                <div className="text-6xl mb-4">{robotIcon}</div>

                <AppHeader 
                    size="sm"
                    title="Ready to Analyze" 
                    description="Enter some text above and click 'Analyze Text' to get started. The active model will identify arguments, assess their credibility, and provide detailed insights."  
                />


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">

                    <MetricCard
                        icon={FileText}
                        title="Argument Detection"
                        value=""
                        description="Identifies main arguments and supporting claims"
                        colorClass="blue"
                    />

                    <MetricCard
                        icon={Search}
                        title="Credibility"
                        value=""
                        description="Evaluates argument strength and evidence quality"
                        colorClass="green"
                    />

                    <MetricCard
                        icon={Brain}
                        title="Logical Analysis"
                        value=""
                        description="Maps logical structure and reasoning patterns"
                        colorClass="purple"
                    />

                </div>
            </div>
        </div>
    );
};

export default ReadyDisplayCard;
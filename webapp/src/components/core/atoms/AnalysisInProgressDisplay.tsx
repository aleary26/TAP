import React from 'react';
import { Search } from 'lucide-react';

const AnalysisInProgressDisplay: React.FC = () => {
  return (
    <div className="px-6 py-3 border-b border-gray-200 bg-red-50">
      <div className="flex items-center justify-center">
        <span className="text-red-600 font-medium animate-pulse flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Analyzing...</span>
        </span>
      </div>
    </div>
  );
};

export default AnalysisInProgressDisplay; 
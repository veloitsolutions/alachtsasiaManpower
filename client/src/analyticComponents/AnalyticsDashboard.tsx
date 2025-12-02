import React, { useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import useAnalyticsData from '../hooks/useAnalyticsData';
import StatsSummary from './StatsSummary';
import WorkerPerformanceChart from './WorkerPerformanceChart';
import ComparisonTable from './ComparisonTable';

const AnalyticsDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'comparison'>('overview');
  const { workersData, loading, error, refetch } = useAnalyticsData();
  
  if (loading && workersData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
        <p>{error}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:text-red-800"
        >
          <RefreshCcw size={16} className="mr-1" />
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Worker Analytics Dashboard</h1>
        <button 
          onClick={() => refetch()} 
          className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:shadow-lg active:bg-primary/80"
        >
          <RefreshCcw size={16} className="mr-2" />
          <span className="hidden sm:inline">Refresh Data</span>
          <span className="sm:hidden">Refresh</span>
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
          <button
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              selectedTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              selectedTab === 'performance'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTab('performance')}
          >
            Performance
          </button>
          <button
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              selectedTab === 'comparison'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTab('comparison')}
          >
            Comparison
          </button>
        </nav>
      </div>
      
      <div className="mt-4 sm:mt-6">
        {selectedTab === 'overview' && (
          <>
            <StatsSummary workersData={workersData} />
            <WorkerPerformanceChart workersData={workersData} />
          </>
        )}
        
        {selectedTab === 'performance' && (
          <WorkerPerformanceChart workersData={workersData} showRadar={true} />
        )}
        
        {selectedTab === 'comparison' && (
          <ComparisonTable workersData={workersData} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

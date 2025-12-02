import React, { useMemo } from 'react';
import { Eye, ThumbsUp, Phone, Share2, MessageCircle, Download } from 'lucide-react';

interface WorkerStats {
  workerId: string;
  workerNameEng: string;
  workerNameArabic: string;
  stats: {
    VIEW?: number;
    CALL?: number;
    SHARE?: number;
    WHATSAPP?: number;
    DOWNLOAD_RESUME?: number;
    [key: string]: number | undefined;
  };
}

interface StatsSummaryProps {
  workersData: WorkerStats[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-3 sm:p-4 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-900">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsSummary: React.FC<StatsSummaryProps> = ({ workersData }) => {
  const stats = useMemo(() => {
    let totalViews = 0;
    let totalCalls = 0;
    let totalShares = 0;
    let totalWhatsapp = 0;
    let totalDownloads = 0;
    let totalInteractions = 0;
    
    workersData.forEach(worker => {
      totalViews += worker.stats.VIEW || 0;
      totalCalls += worker.stats.CALL || 0;
      totalShares += worker.stats.SHARE || 0;
      totalWhatsapp += worker.stats.WHATSAPP || 0;
      totalDownloads += worker.stats.DOWNLOAD_RESUME || 0;
      
      Object.values(worker.stats).forEach(value => {
        totalInteractions += value || 0;
      });
    });
    
    return {
      totalViews,
      totalCalls,
      totalShares,
      totalWhatsapp,
      totalDownloads,
      totalInteractions,
      totalProfiles: workersData.length
    };
  }, [workersData]);
  
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Overall Performance</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard 
          title="Total Views"
          value={stats.totalViews}
          icon={<Eye className="h-4 w-4 sm:h-6 sm:w-6" />}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Total Calls"
          value={stats.totalCalls}
          icon={<Phone className="h-4 w-4 sm:h-6 sm:w-6" />}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Total Shares"
          value={stats.totalShares}
          icon={<Share2 className="h-4 w-4 sm:h-6 sm:w-6" />}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Total WhatsApp"
          value={stats.totalWhatsapp}
          icon={<MessageCircle className="h-4 w-4 sm:h-6 sm:w-6" />}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Resume Downloads"
          value={stats.totalDownloads}
          icon={<Download className="h-4 w-4 sm:h-6 sm:w-6" />}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Total Interactions"
          value={stats.totalInteractions}
          icon={<div className="flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 font-bold">Σ</div>}
          color="border-gray-900"
        />
        
        <StatCard 
          title="Total Workers"
          value={stats.totalProfiles}
          icon={<div className="flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 font-bold">👥</div>}
          color="border-gray-900"
        />
      </div>
    </div>
  );
};

export default StatsSummary;

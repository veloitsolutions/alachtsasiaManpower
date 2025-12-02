import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

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

interface ComparisonTableProps {
  workersData: WorkerStats[];
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ workersData }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'total', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;
  
  const processedData = workersData.map(worker => {
    const viewCount = worker.stats.VIEW || 0;
    const callCount = worker.stats.CALL || 0;
    const shareCount = worker.stats.SHARE || 0;
    const whatsappCount = worker.stats.WHATSAPP || 0;
    const downloadCount = worker.stats.DOWNLOAD_RESUME || 0;
    const totalCount = Object.values(worker.stats).reduce((sum: number, val) => sum + (val || 0), 0);
    
    const engagementRate = viewCount > 0 
      ? ((callCount + shareCount + whatsappCount + downloadCount) / viewCount * 100).toFixed(1) 
      : '0.0';
    
    const fullName = worker.workerNameEng || worker.workerNameArabic || 'Unknown';
    
    return {
      id: worker.workerId,
      name: fullName,
      views: viewCount,
      calls: callCount,
      shares: shareCount,
      whatsapp: whatsappCount,
      downloads: downloadCount,
      total: totalCount,
      engagementRate: parseFloat(engagementRate)
    };
  });
  
  const filteredData = searchTerm 
    ? processedData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : processedData;
  
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const paginatedData = sortedData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);
  
  const chartData = sortedData.slice(0, 10).map(item => {
    const nameParts = item.name.split(' ');
    const shortenedName = nameParts[0].length > 8 ? nameParts[0].substring(0, 8) + '...' : nameParts[0];
    
    return {
      name: shortenedName,
      fullName: item.name,
      views: item.views,
      calls: item.calls,
      shares: item.shares,
      whatsapp: item.whatsapp,
      downloads: item.downloads
    };
  });
  
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };
  
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} className="ml-1" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
  };
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  
  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Top 10 Workers Breakdown</h3>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0 && payload[0].payload.fullName) {
                  return payload[0].payload.fullName;
                }
                return label;
              }} 
            />
            <Legend />
            <Bar dataKey="views" stackId="a" fill="#0088FE" name="Views" />
            <Bar dataKey="calls" stackId="a" fill="#FFBB28" name="Calls" />
            <Bar dataKey="shares" stackId="a" fill="#FF8042" name="Shares" />
            <Bar dataKey="whatsapp" stackId="a" fill="#8884d8" name="WhatsApp" />
            <Bar dataKey="downloads" stackId="a" fill="#00C49F" name="Downloads" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-medium">Worker Performance Comparison</h3>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search worker"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('name')}>
                      <span className="truncate">Worker Name</span>
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('views')}>
                      <span className="truncate">Views</span>
                      {getSortIcon('views')}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('calls')}>
                      <span className="truncate">Calls</span>
                      {getSortIcon('calls')}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('whatsapp')}>
                      <span className="truncate">WhatsApp</span>
                      {getSortIcon('whatsapp')}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('total')}>
                      <span className="truncate">Total</span>
                      {getSortIcon('total')}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort('engagementRate')}>
                      <span className="truncate">Engagement</span>
                      {getSortIcon('engagementRate')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[150px]" title={item.name}>
                        {item.name}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.calls}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.whatsapp}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.total}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 ${item.engagementRate > 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {item.engagementRate}%
                        </span>
                        <div className="w-8 sm:w-16 bg-gray-200 rounded-full h-2 hidden sm:block">
                          <div 
                            className={`h-2 rounded-full ${item.engagementRate > 5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min(item.engagementRate * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {filteredData.length > rowsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
            <div className="text-sm text-gray-700">
              Showing {currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            
            <div className="flex justify-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="hidden sm:flex">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageToShow = totalPages <= 5 ? i : Math.min(Math.max(0, currentPage - 2 + i), totalPages - 1);
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => setCurrentPage(pageToShow)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors ${
                          currentPage === pageToShow ? 'bg-primary text-white border-primary z-10' : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {pageToShow + 1}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium bg-primary text-white border-primary z-10">
                    {currentPage + 1}
                  </button>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;

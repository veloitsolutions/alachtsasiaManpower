import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface WorkerPerformanceChartProps {
  workersData: WorkerStats[];
  showRadar?: boolean;
}

const WorkerPerformanceChart: React.FC<WorkerPerformanceChartProps> = ({ workersData, showRadar = false }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const processedData = workersData.map(worker => {
    const fullName = worker.workerNameEng || worker.workerNameArabic || 'Unknown';
    const nameParts = fullName.split(' ');
    const shortenedName = nameParts[0].length > 8 ? nameParts[0].substring(0, 8) + '...' : nameParts[0];
    
    return {
      id: worker.workerId,
      name: shortenedName,
      fullName: fullName,
      views: worker.stats.VIEW || 0,
      calls: worker.stats.CALL || 0,
      whatsapp: worker.stats.WHATSAPP || 0,
      share: worker.stats.SHARE || 0,
      downloads: worker.stats.DOWNLOAD_RESUME || 0,
      total: Object.values(worker.stats).reduce((sum: number, val) => sum + (val || 0), 0)
    };
  });

  const sortedData = [...processedData].sort((a, b) => b.total - a.total);
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentData = sortedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  const goToNextPage = () => setCurrentPage(prev => (prev + 1) % totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1));

  const topPerformers = sortedData.slice(0, 3);
  const radarData = [
    { stat: 'Views', fullMark: 100 },
    { stat: 'Calls', fullMark: 100 },
    { stat: 'WhatsApp', fullMark: 100 },
    { stat: 'Share', fullMark: 100 },
    { stat: 'Downloads', fullMark: 100 },
  ].map(item => {
    const entry: any = { stat: item.stat, fullMark: item.fullMark };
    topPerformers.forEach(performer => {
      const statKey = item.stat.toLowerCase();
      entry[performer.name] = performer[statKey as keyof typeof performer] || 0;
    });
    return entry;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Worker Performance Ranking</h3>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page {currentPage + 1} / {totalPages}</span>
              <button onClick={goToPreviousPage} className="p-1 rounded-full hover:bg-primary/10 text-primary hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={goToNextPage} className="p-1 rounded-full hover:bg-primary/10 text-primary hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 110 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 12 }} tickMargin={15} />
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
            <Bar dataKey="views" fill="#0088FE" name="Views" />
            <Bar dataKey="calls" fill="#FFBB28" name="Calls" />
            <Bar dataKey="whatsapp" fill="#8884d8" name="WhatsApp" />
          </BarChart>
        </ResponsiveContainer>
        
        {sortedData.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center rounded-md shadow-sm">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    currentPage === i ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:text-primary hover:bg-primary/5'
                  } border border-gray-300`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="px-3 py-1 text-sm font-medium bg-white text-gray-700 border border-gray-300">...</span>}
            </div>
          </div>
        )}
      </div>

      {showRadar && topPerformers.length > 0 && (
        <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Top Performers Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" />
              <PolarRadiusAxis />
              {topPerformers.map((performer, index) => (
                <Radar
                  key={performer.name}
                  name={performer.fullName}
                  dataKey={performer.name}
                  stroke={['#0088FE', '#00C49F', '#FFBB28'][index]}
                  fill={['#0088FE', '#00C49F', '#FFBB28'][index]}
                  fillOpacity={0.6}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Top Performers</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase">Worker Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase">Interactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase">Engagement Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topPerformers.map((performer) => (
                    <tr key={performer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={performer.fullName}>
                          {performer.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{performer.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{performer.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {performer.views > 0 ? ((performer.total - performer.views) / performer.views * 100).toFixed(1) + '%' : '0.0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerPerformanceChart;

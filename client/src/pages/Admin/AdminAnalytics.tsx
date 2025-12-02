import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AnalyticsDashboard from '../../analyticComponents/AnalyticsDashboard';
import { BarChart3 } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <BarChart3 size={40} />
                  Worker Analytics
                </h1>
                <p className="text-white/90 text-sm sm:text-base">Track and analyze worker performance metrics</p>
              </div>
            </div>
          </div>

          <AnalyticsDashboard />
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;

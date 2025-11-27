import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS } from '../../config/api';
import { Image, Users, MessageSquare, Mail, TrendingUp, Loader2 } from 'lucide-react';

interface DashboardStats {
  galleryCount: number;
  clientLogosCount: number;
  contactsCount: number;
  unreadContactsCount: number;
  testimonialsCount: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    galleryCount: 0,
    clientLogosCount: 0,
    contactsCount: 0,
    unreadContactsCount: 0,
    testimonialsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [galleryRes, clientsRes, contactsRes, testimonialsRes] = await Promise.all([
          fetch(API_ENDPOINTS.GALLERY, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(API_ENDPOINTS.CLIENTS, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(API_ENDPOINTS.CONTACT, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(API_ENDPOINTS.TESTIMONIALS, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [galleryData, clientsData, contactsData, testimonialsData] = await Promise.all([
          galleryRes.json(),
          clientsRes.json(),
          contactsRes.json(),
          testimonialsRes.json(),
        ]);

        setStats({
          galleryCount: galleryData.length,
          clientLogosCount: clientsData.length,
          contactsCount: contactsData.length,
          unreadContactsCount: contactsData.filter((c: any) => !c.isRead).length,
          testimonialsCount: testimonialsData.length,
        });
      } catch (error) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  const statCards = [
    { title: 'Gallery Items', count: stats.galleryCount, link: '/admin/gallery', icon: Image, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { title: 'Client Logos', count: stats.clientLogosCount, link: '/admin/clients', icon: Users, gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/20' },
    { title: 'Testimonials', count: stats.testimonialsCount, link: '/admin/testimonials', icon: MessageSquare, gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
    { title: 'Contact Submissions', count: stats.contactsCount, link: '/admin/contacts', icon: Mail, gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20', badge: stats.unreadContactsCount },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-primary rounded-2xl p-6 shadow-lg">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/90 text-sm sm:text-base">Welcome back! Here's your overview</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 hover:border-transparent relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl ${card.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    {card.badge !== undefined && card.badge > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-neutral-gray text-sm font-semibold mb-2 uppercase tracking-wide">{card.title}</h3>
                  <p className="text-4xl font-bold text-neutral-black mb-1">{card.count}</p>
                  {card.badge !== undefined && card.badge > 0 && (
                    <p className="text-xs text-red-600 font-medium mt-2">{card.badge} unread</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary to-orange-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-black">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Link to="/admin/gallery" className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md">
                <h3 className="font-bold text-neutral-black mb-2 group-hover:text-primary transition-colors">Manage Gallery</h3>
                <p className="text-sm text-neutral-gray">Add or edit gallery items</p>
              </Link>
              <Link to="/admin/manpower" className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md">
                <h3 className="font-bold text-neutral-black mb-2 group-hover:text-primary transition-colors">Manage Manpower</h3>
                <p className="text-sm text-neutral-gray">Add or edit workers</p>
              </Link>
              <Link to="/admin/contacts" className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md">
                <h3 className="font-bold text-neutral-black mb-2 group-hover:text-primary transition-colors">View Contacts</h3>
                <p className="text-sm text-neutral-gray">Check new submissions</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

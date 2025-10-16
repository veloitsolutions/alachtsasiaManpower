import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS } from '../../config/api';

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

  // const navigate = useNavigate();

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch gallery count
        const galleryResponse = await fetch(API_ENDPOINTS.GALLERY, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const galleryData = await galleryResponse.json();

        // Fetch client logos count
        const clientsResponse = await fetch(API_ENDPOINTS.CLIENTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const clientsData = await clientsResponse.json();

        // Fetch contacts
        const contactsResponse = await fetch(API_ENDPOINTS.CONTACT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const contactsData = await contactsResponse.json();

        // Fetch testimonials
        const testimonialsResponse = await fetch(API_ENDPOINTS.TESTIMONIALS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const testimonialsData = await testimonialsResponse.json();

        // Calculate stats
        setStats({
          galleryCount: galleryData.length,
          clientLogosCount: clientsData.length,
          contactsCount: contactsData.length,
          unreadContactsCount: contactsData.filter((contact: any) => !contact.isRead).length,
          testimonialsCount: testimonialsData.length,
        });
      } catch (error) {
        setError('Failed to fetch dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  // const handleLogout = () => {
  //   localStorage.removeItem('userInfo');
  //   navigate('/admin/login');
  // };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>Dashboard</h1>
            {/* <button onClick={handleLogout} className="admin-logout-button admin_logout_button" style={{display: 'block', visibility: 'visible', opacity: 1}}>Logout</button> */}
          </div>
          <div className="admin-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          {/* <button onClick={handleLogout} className="admin-logout-button admin_logout_button" style={{display: 'block', visibility: 'visible', opacity: 1}}>Logout</button> */}
        </div>

        {error && <div className="admin-error-message">{error}</div>}

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Gallery Items</h3>
            <p className="admin-stat-number">{stats.galleryCount}</p>
            <Link to="/admin/gallery" className="admin-stat-link">Manage Gallery</Link>
          </div>

          <div className="admin-stat-card">
            <h3>Client Logos</h3>
            <p className="admin-stat-number">{stats.clientLogosCount}</p>
            <Link to="/admin/clients" className="admin-stat-link">Manage Logos</Link>
          </div>

          <div className="admin-stat-card">
            <h3>Testimonials</h3>
            <p className="admin-stat-number">{stats.testimonialsCount}</p>
            <Link to="/admin/testimonials" className="admin-stat-link">Manage Testimonials</Link>
          </div>

          <div className="admin-stat-card">
            <h3>Contact Submissions</h3>
            <p className="admin-stat-number">{stats.contactsCount}</p>
            <p className="admin-stat-subtitle">{stats.unreadContactsCount} unread</p>
            <Link to="/admin/contacts" className="admin-stat-link">View Contacts</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



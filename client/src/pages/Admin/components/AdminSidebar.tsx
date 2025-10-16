import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../AdminStyles.css';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Intralink Admin</h2>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <Link
              to="/admin"
              className={`admin-sidebar-link ${isActive('/admin') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/gallery"
              className={`admin-sidebar-link ${isActive('/admin/gallery') ? 'active' : ''}`}
            >
              Gallery Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/clients"
              className={`admin-sidebar-link ${isActive('/admin/clients') ? 'active' : ''}`}
            >
              Client Logos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/testimonials"
              className={`admin-sidebar-link ${isActive('/admin/testimonials') ? 'active' : ''}`}
            >
              Testimonials
            </Link>
          </li>
          <li>
            <Link
              to="/admin/contacts"
              className={`admin-sidebar-link ${isActive('/admin/contacts') ? 'active' : ''}`}
            >
              Contact Submissions
            </Link>
          </li>
          {/* <li>
            <Link
              to="/"
              className="admin-sidebar-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Website
            </Link>
          </li> */}
          <li>
            <button
              onClick={handleLogout}
              className="admin-sidebar-link admin-sidebar-logout"
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginTop: '20px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;




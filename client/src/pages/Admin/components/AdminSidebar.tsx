import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../AdminStyles.css';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Alikhtsasy Admin</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <ul>
          <li>
            <Link
              to="/admin"
              className={`admin-sidebar-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/gallery"
              className={`admin-sidebar-link ${isActive('/admin/gallery') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Gallery Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/clients"
              className={`admin-sidebar-link ${isActive('/admin/clients') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Client Logos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/testimonials"
              className={`admin-sidebar-link ${isActive('/admin/testimonials') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Testimonials
            </Link>
          </li>
          <li>
            <Link
              to="/admin/team-members"
              className={`admin-sidebar-link ${isActive('/admin/team-members') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Team Members
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manpower"
              className={`admin-sidebar-link ${isActive('/admin/manpower') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Manpower Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/contacts"
              className={`admin-sidebar-link ${isActive('/admin/contacts') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact Submissions
            </Link>
          </li>
          <li>
            <Link
              to="/admin/chat-numbers"
              className={`admin-sidebar-link ${isActive('/admin/chat-numbers') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Chat Conversations
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
    </>
  );
};

export default AdminSidebar;




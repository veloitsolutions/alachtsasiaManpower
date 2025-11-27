import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Image, Users, MessageSquare, Briefcase, Mail, MessageCircle, LogOut } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/gallery', label: 'Gallery Management', icon: Image },
    { path: '/admin/clients', label: 'Client Logos', icon: Users },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { path: '/admin/team-members', label: 'Team Members', icon: Users },
    { path: '/admin/manpower', label: 'Manpower Management', icon: Briefcase },
    { path: '/admin/contacts', label: 'Contact Submissions', icon: Mail },
    { path: '/admin/chat-numbers', label: 'Chat Conversations', icon: MessageCircle },
  ];

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-neutral-black to-neutral-dark-gray text-white z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto`}>
        <div className="p-6 border-b border-neutral-gray/30">
          <h2 className="text-xl font-bold text-primary">Alikhtsasy Admin</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(path)
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-neutral-light-gray hover:bg-neutral-dark-gray hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </li>
            ))}
            <li className="pt-4 mt-4 border-t border-neutral-gray/30">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-light-gray hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;

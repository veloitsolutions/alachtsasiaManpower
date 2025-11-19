import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  scrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${isHomePage && !scrolled ? 'with-top-bar' : ''}`}>
      <div className="container header-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={closeMenu}>
          <NavLink to="/home" className="logo-link">
            <div className="logo-container">
              <img className="logo-img" src="/logo.png" alt="Alikhtsasy for Manpower" />
              <div className="logo-text-container">
                <span className="logo-text">Alikhtsasy</span>
                <span className="logo-subtext">Manpower</span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/journey" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Journey
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manpower" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Manpower
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/gallery" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
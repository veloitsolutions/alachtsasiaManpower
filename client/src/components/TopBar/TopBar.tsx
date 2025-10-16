import React, { useState, useEffect } from 'react';
import { Mail, Clock, Facebook, Twitter, Instagram, Linkedin, Phone } from 'lucide-react';
import './TopBar.css';

// const TopBar: React.FC = () => {
//   const [visible, setVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
      
//       if (currentScrollY > lastScrollY && currentScrollY > 10) {
//         setVisible(false);
//       } else {
//         setVisible(true);
//       }
      
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

const TopBar: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY === 0) {
        setVisible(true); // Show only when scrolled to top
      } else if (scrollY > 10) {
        setVisible(false); // Hide once scrolled
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className={`top-bar ${visible ? "visible" : "hidden"}`}>
      <div className="container top-bar-container">
        <div className="top-bar-contact">
          <a href="mailto:intralinkqatar@hotmail.com" className="top-bar-item">
            <Mail size={16} />
            <span>intralinkqatar@hotmail.com</span>
          </a>
          <span className="top-bar-item-1">
            <Clock size={16} />
            <span>Sunday - Thursday: 9 AM to 6 PM | Friday: Closed</span> <br />
          </span>
          <span className="top-bar-item-2">
            <Phone size={16} /> 
            <a href="tel:+97470994833">+974 70994833</a>
          </span>
          <span className="top-bar-item-2">
            <Phone size={16} /> 
            <a href="tel:+97477866538">+974 77866538</a>
          </span>
          {/* <span className="top-bar-item-2">
            <Phone size={16} /> 
            <a href="tel:+97470994833">+974 70994833</a>
          </span> */}
        </div>
        <div className="top-bar-socials">
          <a href="#" className="social-icon" aria-label="Facebook">
            <Facebook size={16} />
          </a>
          <a href="#" className="social-icon" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="#" className="social-icon" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="#" className="social-icon" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          {/* <a href="#" className="social-icon" aria-label="YouTube">
            <Youtube size={16} />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
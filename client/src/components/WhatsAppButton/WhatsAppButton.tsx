// import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const WhatsAppButton: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(false);
// //   const [isHovered, setIsHovered] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrolled = window.scrollY > 100;
//       setIsVisible(scrolled);
//     };

//     window.addEventListener('scroll', handleScroll);
//     handleScroll(); // Check initial scroll position
    
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

  return (
    <div className="whatsapp-button visible">
      <a
        href="https://wa.me/97470994833"
        className="whatsapp-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        <div className="pulse"></div>
        <MessageCircle className="whatsapp-icon" size={24} />
        <span className="whatsapp-text">Let's Chat</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
import { Routes, Route, useLocation  } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import TopBar from './components/TopBar/TopBar';

// Pages
import AboutPage from './pages/About/AboutPage';
import JourneyPage from './pages/Journey/JourneyPage';
import ServiceDetails from './pages/Services/ServiceDetails';
import ServicesPage from './pages/Services/ServicesPage';

import NotFoundPage from './pages/NotFound/NotFoundPage';
import GalleryPage from './pages/Gallery/GalleryPage';
import HomePage from './pages/Home/HomePage';

// Admin Pages
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminClientLogos from './pages/Admin/AdminClientLogos';
import AdminContacts from './pages/Admin/AdminContacts';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminTestimonials from './pages/Admin/AdminTestimonials';

// Global Styles
import ContactPage from './pages/Contact/ContactPage';
import './App.css';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Check if current route is homepage
  const isHomePage = location.pathname === '/';
  
  // Check if current route starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {isHomePage && <TopBar />}
      <Header scrolled={scrolled} />
      <main className={`main-content ${isHomePage ? 'home-page' : ''}`}>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />


          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
          <Route path="/admin/clients" element={<AdminRoute><AdminClientLogos /></AdminRoute>} />
          <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
          <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
}

export default App;

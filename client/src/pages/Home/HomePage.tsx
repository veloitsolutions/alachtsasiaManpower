import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Award, Calendar } from 'lucide-react';
import Button from '../../components/Button/Button';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import './HomePage.css';
import ClientLogos from '../../components/ClientLogos/ClientLogos';
import Testimonials from '../../components/Testimonials/Testimonials';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    years: 0,
    placements: 0,
    countries: 0,
    satisfaction: 0
  });
  
  const targetCounts = {
    years: 15,
    placements: 5000,
    countries: 8,
    satisfaction: 95
  };
  
  const statsRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted.current) {
            animationStarted.current = true;
            startCountAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCountAnimation = () => {
    const duration = 5000; // 5 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      
      setCounts({
        years: Math.round(easeOutQuad(progress) * targetCounts.years),
        placements: Math.round(easeOutQuad(progress) * targetCounts.placements),
        countries: Math.round(easeOutQuad(progress) * targetCounts.countries),
        satisfaction: Math.round(easeOutQuad(progress) * targetCounts.satisfaction)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, interval);
  };

  // Easing function for smoother animation
  const easeOutQuad = (t: number): number => {
    return t * (2 - t);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-subtitle">الاختصاصي لجلب الأيدي العاملة</p>
            <h1 className="hero-title">
              Alachtsasi for Manpower
            </h1>
            <p className="hero-description">
              Your trusted partner in connecting exceptional talent with outstanding opportunities 
              across domestic staffing, skilled professionals, and comprehensive business services 
              with dedication and expertise.
            </p>
            <div className="hero-buttons">
              <Button 
                variant="primary" 
                size="large" 
                onClick={() => navigate('/services')}
              >
                Explore Our Services
              </Button>
              <Button 
                variant="secondary" 
                size="large" 
                onClick={() => navigate('/contact')}
              >
                Get Started Today
              </Button>
            </div>
          </div>
          
          <div className="hero-stats" ref={statsRef}>
            <div className="hero-stat">
              <div className="stat-value">{counts.years}+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">{counts.placements}+</div>
              <div className="stat-label">Successful Placements</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">{counts.countries}+</div>
              <div className="stat-label">Countries Served</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">{counts.satisfaction}%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section welcome-section">
        <div className="container">
          <h2 className="section-title">About Alachtsasi</h2>
          <div className="welcome-content">
            <div className="welcome-text">
              <p>
                Alachtsasi for Manpower is a specialized recruitment agency dedicated to connecting 
                exceptional talent with outstanding opportunities. We focus on providing reliable 
                domestic staffing, skilled professionals, and comprehensive business services.
              </p>
              <p>
                We are committed to professionalism, client satisfaction, and delivering quality 
                manpower solutions. Our expertise lies in understanding your needs and providing 
                the right candidates for your requirements.
              </p>
              <ul className="features-list">
                <li>
                  <span className="feature-icon">✓</span>
                  <span>Trained & Verified Workers</span>
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  <span>Custom Staffing Solutions</span>
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  <span>Visa & Documentation Support</span>
                </li>
              </ul>
              <Button 
                variant="primary" 
                onClick={() => navigate('/about')}
              >
                Learn More About Us
              </Button>
            </div>
            <div className="welcome-image-container">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Professional team at Alachtsasi" 
                className="welcome-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <ServiceCard
              title="Specialized Industry Solutions"
              description="We provide customized recruitment strategies tailored to meet the unique needs of various industries, ensuring top talent for specialized roles."
              icon={<Home size={36} />}
              link="/services"
            />
            <ServiceCard
              title="Domestic & Support Staff Recruitment"
              description="We connect households and businesses with reliable domestic helpers and support staff, carefully screened for trust and competence."
              icon={<Users size={36} />}
              link="/services"
            />
            <ServiceCard
              title="Skilled Worker Recruitment by Industry"
              description="Our recruitment services match skilled workers with roles across multiple industries, ensuring the right fit for technical and trade positions."
              icon={<Award size={36} />}
              link="/services"
            />
            <ServiceCard
              title="Additional Business Services"
              description="Beyond recruitment, we offer value-added business solutions such as documentation support, HR consulting, and process outsourcing."
              icon={<Calendar size={36} />}
              link="/services"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="section testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-text">
                "Alachtsasi helped us find the perfect staff for our hotel. Their attention to detail and understanding of our needs was impressive."
              </div>
              <div className="testimonial-author">
                <img 
                  src="https://images.pexels.com/photos/2531553/pexels-photo-2531553.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Client" 
                  className="testimonial-image"
                />
                <div className="testimonial-info">
                  <div className="testimonial-name">Sarah Johnson</div>
                  <div className="testimonial-role">Hotel Manager</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-text">
                "We've been working with Alachtsasi for over 5 years now. They consistently provide reliable staff and excellent service."
              </div>
              <div className="testimonial-author">
                <img 
                  src="https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Client" 
                  className="testimonial-image"
                />
                <div className="testimonial-info">
                  <div className="testimonial-name">Michael Cheng</div>
                  <div className="testimonial-role">Construction Manager</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-text">
                "Finding the right domestic help was made easy thanks to Alachtsasi. Their staff is professional, well-trained, and reliable."
              </div>
              <div className="testimonial-author">
                <img 
                  src="https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Client" 
                  className="testimonial-image"
                />
                <div className="testimonial-info">
                  <div className="testimonial-name">Emily Williams</div>
                  <div className="testimonial-role">Homeowner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

         {/* ClientLogos section */}
         <ClientLogos />
         
         {/* Testimonials section */}
         <Testimonials />

      {/* Call to Action */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find the Perfect Staff?</h2>
            <p className="cta-text">
              Whether you need domestic help or skilled professionals, we're here to assist you.
            </p>
            <Button 
              variant="primary" 
              size="large" 
              onClick={() => navigate('/contact')}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

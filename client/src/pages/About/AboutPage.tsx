import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import TeamMembers from '../../components/TeamMembers/TeamMembers';
import './AboutPage.css';
import { FlagCarousel } from '../../components/FlagCarousel/FlagCarousel';
import ClientLogos from '../../components/ClientLogos/ClientLogos';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <h1>About Alikhtsasy</h1>
            <p>Learn about our journey, values, and commitment to excellence</p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="section who-we-are-section">
        <div className="container">
          <div className="who-we-are-content">
            <div className="who-we-are-text">
              <h2 className="section-title">Who We Are</h2>
              <p>
                Alikhtsasy for Manpower is a specialized recruitment agency dedicated to connecting 
                exceptional talent with outstanding opportunities across various industries and regions.
              </p>
              <p>
                We specialize in recruiting domestic and skilled workers from countries including:
              </p>
              <ul className="country-list">
                <li>Philippines</li>
                <li>Uganda</li>
                <li>Ghana</li>
                <li>Kenya</li>
                <li>Indonesia</li>
                <li>Sri Lanka</li>
                <li>Ethiopia</li>
                <li>India</li>
                <li>Bangladesh</li>
                <li>Burundi</li>
              </ul>
              <p>
                With our expertise and dedication, we've built a reputation for excellence in matching 
                the right talent to the right opportunities, ensuring satisfaction for both employers and employees.
              </p>
            </div>
            <div className="who-we-are-image">
              <img 
              src="/img/2.webp" 
              alt="Alikhtsasy team meeting" 
              />
              </div>
          </div>
        </div>
              <FlagCarousel/>

         
      </section>
      

      {/* Our Promise Section */}
      <section className="section our-promise-section">
        <div className="container">
          <h2 className="section-title">Our Promise</h2>
          <div className="promise-cards">
            <div className="promise-card">
              <div className="promise-icon">
                <span>01</span>
              </div>
              <h3>Trusted Staffing Solutions</h3>
              <p>
                We provide tailored staffing solutions for households and businesses, ensuring the perfect match for your specific needs.
              </p>
            </div>
            
            <div className="promise-card">
              <div className="promise-icon">
                <span>02</span>
              </div>
              <h3>Understanding Client Needs</h3>
              <p>
                Our process begins with a deep understanding of your requirements, ensuring we deliver candidates who exceed expectations.
              </p>
            </div>
            
            <div className="promise-card">
              <div className="promise-icon">
                <span>03</span>
              </div>
              <h3>Legacy of Excellence</h3>
              <p>
                For nearly three decades, we've maintained a legacy of integrity, quality, and care in every placement we make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section our-approach-section">
        <div className="container">
          <div className="approach-content">
            <div className="approach-image">
              <img 
                src="https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Alikhtsasy recruitment process" 
              />
            </div>
            <div className="approach-text">
              <h2 className="section-title">Our Approach</h2>
              <div className="approach-steps">
                <div className="approach-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Understand</h3>
                    <p>We begin by understanding your specific requirements and the cultural fit you're looking for.</p>
                  </div>
                </div>
                
                <div className="approach-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Source</h3>
                    <p>Our extensive network allows us to source qualified candidates from around the world.</p>
                  </div>
                </div>
                
                <div className="approach-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Vet</h3>
                    <p>Rigorous screening ensures only the most qualified and trustworthy candidates are presented.</p>
                  </div>
                </div>
                
                <div className="approach-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Match</h3>
                    <p>We carefully match candidates to your needs, considering both skills and cultural alignment.</p>
                  </div>
                </div>
                
                <div className="approach-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Support</h3>
                    <p>Our support continues after placement, ensuring a smooth transition and long-term success.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* ClientLogos section */}
         <ClientLogos />

      {/* Team Section */}
      <TeamMembers />

       


      {/* Call to Action */}
      <section className="section about-cta-section">
        <div className="container">
          <div className="about-cta-content">
            <h2>Ready to experience the Alikhtsasy difference?</h2>
            <p>
              Let us help you find the perfect staff for your home or business.
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

export default AboutPage;
import React, { useEffect, useRef, useState } from 'react';
import TimelineItem from '../../components/TimelineItem/TimelineItem';
import './JourneyPage.css';
import styles from './JourneyPage.module.css';

const JourneyPage: React.FC = () => {
  const [counts, setCounts] = useState({
    years: 0,
    countries: 0,
    placements: 0,
    divisions: 0
  });
  
  const targetCounts = {
    years: 30,
    countries: 10,
    placements: 10000,
    divisions: 4
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
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      
      setCounts({
        years: Math.round(easeOutQuad(progress) * targetCounts.years),
        countries: Math.round(easeOutQuad(progress) * targetCounts.countries),
        placements: Math.round(easeOutQuad(progress) * targetCounts.placements),
        divisions: Math.round(easeOutQuad(progress) * targetCounts.divisions)
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
    <div className="journey-page">
      {/* Hero Section */}
      <section className="journey-hero-section">
        <div className="container">
          <div className="journey-hero-content">
            <h1>Our Journey</h1>
            <p>Explore the milestones that have shaped Intralink since 1994</p>
          </div>
        </div>
      </section>

      {/* Journey Introduction */}
      <section className="section journey-intro-section">
        <div className="container">
          <div className="journey-intro-content">
            <h2 className="section-title">Our Growth Story</h2>
            <p className="journey-intro-text">
              Since our founding in 1994, Intralink has evolved from a small recruitment agency into a 
              multi-service international company. Our growth journey reflects our commitment to excellence, 
              adaptability, and understanding of market needs across different regions.
            </p>
            <div className="journey-stats" ref={statsRef}>
              <div className="stat-item">
                <span className="stat-number">{counts.years}+</span>
                <span className={styles['stat-label']}>Years of Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counts.countries}+</span>
                <span className={styles['stat-label']}>Countries of Operation</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counts.placements}+</span>
                <span className={styles['stat-label']}>Successful Placements</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counts.divisions}</span>
                <span className={styles['stat-label']}>Business Divisions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section timeline-section">
        <div className="container">
          <h2 className="section-title">Key Milestones</h2>
          
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <TimelineItem 
              year="1994"
              title="Foundation"
              description="Intralink was established on September 19, 1994, focusing on domestic staff recruitment for local households."
              isLeft={true}
            />
            
            <TimelineItem 
              year="1997"
              title="International Expansion"
              description="Expanded recruitment services to source workers from the Philippines and other Asian countries."
              isLeft={false}
            />
            
            <TimelineItem 
              year="2000"
              title="Trading Division Launch"
              description="Established general trading operations, sourcing and supplying products for local and international markets."
              isLeft={true}
            />
            
            <TimelineItem 
              year="2002"
              title="Construction Services"
              description="Launched construction services division providing both manpower and project support."
              isLeft={false}
            />
            
            <TimelineItem 
              year="2010"
              title="Export & Import Division"
              description="Expanded into global trade of consumer goods, construction materials, and industrial equipment."
              isLeft={true}
            />
            
            <TimelineItem 
              year="2012"
              title="Cleaning & Hospitality Services"
              description="Introduced professional cleaning and hospitality services for homes, offices, hotels, and events."
              isLeft={false}
            />
            
            <TimelineItem 
              year="2014"
              title="Transport Services"
              description="Established transport services with reliable fleets and licensed professional drivers."
              isLeft={true}
            />
            
            <TimelineItem 
              year="2017"
              title="Digital Marketing Division"
              description="Launched comprehensive digital marketing services including SEO, PPC, social media, and content creation."
              isLeft={false}
            />
            
            <TimelineItem 
              year="2020"
              title="African Expansion"
              description="Strengthened recruitment networks in Uganda, Ghana, Kenya, and other African nations."
              isLeft={true}
            />
            
            <TimelineItem 
              year="Present"
              title="Continued Growth"
              description="Today, Intralink continues to expand its services and global reach, adapting to market demands and technological advancements."
              isLeft={false}
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section vision-mission-section">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-card">
              <h2>Our Vision</h2>
              <p>
                To be the leading global provider of integrated manpower and business solutions, 
                connecting talent with opportunity and delivering exceptional service across all our divisions.
              </p>
            </div>
            
            <div className="mission-card">
              <h2>Our Mission</h2>
              <p>
                To empower businesses and households through reliable, ethical, and professional staffing 
                and service solutions that exceed expectations and create lasting value for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="section future-plans-section">
        <div className="container">
          <h2 className="section-title">Looking Ahead</h2>
          <div className="future-content">
            <div className="future-image">
              <img 
                src="https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=800" 
                alt="Future planning at Intralink" 
              />
            </div>
            <div className="future-text">
              <p>
                As we look to the future, Intralink remains committed to innovation and excellence. 
                Our strategic plans include:
              </p>
              <ul className="future-list">
                <li>Expanding our digital services to include AI-powered recruitment solutions</li>
                <li>Strengthening our presence in emerging markets across Asia and Africa</li>
                <li>Developing sustainable and ethical recruitment practices</li>
                <li>Enhancing our training programs to provide even more skilled professionals</li>
                <li>Building stronger partnerships with international organizations and governments</li>
              </ul>
              <p>
                We're excited to continue our journey of growth and service excellence, adapting to new 
                challenges and opportunities in the global marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
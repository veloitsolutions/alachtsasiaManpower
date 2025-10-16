import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Button from '../../components/Button/Button';
import services from '../../data/services';
import styles from './ServiceDetails.module.css';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const service = services.find(s => s.id === id);

  if (!service) {
    navigate('/404');
    return null;
  }

  // const ServiceIcon = service.icon;

  return (
    <div className={styles.serviceDetailsPage}>
      <section 
        className={styles.serviceHero} 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${service.iconUrl || ''})` 
        }}
      >
        <div className={styles.serviceHeroContent}>
          {/* <div className={styles.serviceIcon}>
            <ServiceIcon  />
          </div> */}
          <h1 className={styles.serviceTitle}>{service.name}</h1>
          <p className={styles.serviceDescription}>{service.description}</p>
        </div>
      </section>

      <div className={styles.serviceContent}>
        <div className={styles.serviceSection}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.fullDescription}>{service.fullDescription}</p>
        </div>

        <div className={styles.serviceSection}>
          <h2 className={styles.sectionTitle}>Key Benefits</h2>
          <div className={styles.benefitsList}>
            {service.benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <div className={styles.itemIcon}>
                  <Check size={20} />
                </div>
                <div className={styles.itemContent}>
                  <p>{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.serviceSection}>
          <h2 className={styles.sectionTitle}>Our Process</h2>
          <div className={styles.processList}>
            {service.process.map((step, index) => (
              <div key={index} className={styles.processItem}>
                <div className={styles.itemIcon}>
                  <ArrowRight size={20} />
                </div>
                <div className={styles.itemContent}>
                  <h4>Step {index + 1}</h4>
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.servicesButton}> 
          <Button 
          variant="primary" 
          size="large" 
          onClick={() => navigate('/services')}
        >
          Return to Services
        </Button>
        </div>
       
      </div>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDescription}>
            Contact us today to discuss your requirements and discover how we can help you find the perfect solution.
          </p>
          <Button 
            variant="primary" 
            size="large" 
            onClick={() => navigate('/contact')}
          >
            Contact Us Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;

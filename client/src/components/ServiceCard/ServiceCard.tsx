import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import './ServiceCard.css';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon,
  link
}) => {
  const cardContent = (
    <>
      <div className="service-card-icon">{icon}</div>
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-description">{description}</p>
      {link && <div className="service-card-link">Learn More</div>}
    </>
  );

  if (link) {
    return (
      <Link to={link} className="service-card-wrapper">
        <Card className="service-card">{cardContent}</Card>
      </Link>
    );
  }

  return <Card className="service-card">{cardContent}</Card>;
};

export default ServiceCard;
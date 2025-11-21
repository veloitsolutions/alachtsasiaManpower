import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, BookOpen } from 'lucide-react';
import { ASSETS_CONFIG } from '../../config/api';
import './ManpowerCard.css';

const capitalizeFirst = (str: string | string[] | undefined) => {
  if (!str) return '';
  const text = Array.isArray(str) ? str[0] : str;
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
};

interface ManpowerCardProps {
  worker: {
    _id: string;
    name: string;
    photo?: string;
    nationality: string;
    jobTitle?: string | string[];
    age: number;
    gender: string;
    experience: string;
    salary: string;
    religion: string;
  };
  hideViewButton?: boolean;
}

const ManpowerCard: React.FC<ManpowerCardProps> = ({ worker, hideViewButton = false }) => {
  const navigate = useNavigate();
  const isAdminRoute = window.location.pathname.includes('/admin');

  const handleViewClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/manpower/${worker._id}${isAdminRoute ? '?from=admin' : ''}`);
  };

  return (
    <div className="manpower-card" onClick={hideViewButton ? undefined : handleViewClick} style={{ cursor: hideViewButton ? 'default' : 'pointer' }}>
      <div className="manpower-card-image-wrapper">
        <img
          src={`${ASSETS_CONFIG.BASE_URL}${worker.photo}`}
          alt={worker.name}
          className="manpower-card-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-avatar.png';
          }}
        />

      </div>

      <div className="manpower-card-content">
        <h3 className="manpower-card-name">{capitalizeFirst(worker.name)}</h3>
        
        <div className="manpower-card-details">
          <div className="detail-row">
            <Briefcase size={14} />
            <span className="detail-text">Job - {capitalizeFirst(worker.jobTitle)}</span>
          </div>
          
          <div className="detail-row">
            <MapPin size={14} />
            <span className="detail-text">Nationality - {capitalizeFirst(worker.nationality)}</span>
          </div>
          
          {worker.religion && (
            <div className="detail-row">
              <BookOpen size={14} />
              <span className="detail-text">Religion - {capitalizeFirst(worker.religion)}</span>
            </div>
          )}
          
          <div className="detail-row">
            <Calendar size={14} />
            <span className="detail-text">Experience - {worker.experience}</span>
          </div>
          
          <div className="detail-row salary-row">
            <DollarSign size={14} />
            <span className="detail-text salary-text">Salary - {worker.salary} QAR</span>
          </div>
        </div>

        {!hideViewButton && (
          <button className="manpower-card-view-btn" onClick={handleViewClick}>
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ManpowerCard;

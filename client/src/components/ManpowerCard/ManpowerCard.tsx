import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, BookOpen } from 'lucide-react';
import { ASSETS_CONFIG } from '../../config/api';
import './ManpowerCard.css';

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface ManpowerCardProps {
  worker: {
    _id: string;
    name: string;
    image?: string;
    photo?: string;
    nationality: string;
    occupation?: string;
    jobTitle?: string;
    age: number;
    gender: string;
    experience: string;
    salary: string;

    religion: string;
  };
}

const ManpowerCard: React.FC<ManpowerCardProps> = ({ worker }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/manpower/${worker._id}`);
  };

  return (
    <div className="manpower-card" onClick={handleViewClick}>
      <div className="manpower-card-image-wrapper">
        <img
          src={`${ASSETS_CONFIG.BASE_URL}${worker.photo || worker.image}`}
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
            <span className="detail-text">{capitalizeFirst(worker.jobTitle || worker.occupation)}</span>
          </div>
          
          <div className="detail-row">
            <MapPin size={14} />
            <span className="detail-text">{capitalizeFirst(worker.nationality)}</span>
          </div>
          
          {worker.religion && (
            <div className="detail-row">
              <BookOpen size={14} />
              <span className="detail-text">{capitalizeFirst(worker.religion)}</span>
            </div>
          )}
          
          <div className="detail-row">
            <Calendar size={14} />
            <span className="detail-text">{worker.experience}</span>
          </div>
          
          <div className="detail-row salary-row">
            <DollarSign size={14} />
            <span className="detail-text salary-text">{worker.salary}</span>
          </div>
        </div>

        <button className="manpower-card-view-btn" onClick={handleViewClick}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ManpowerCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Eye, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { ASSETS_CONFIG, API_ENDPOINTS } from '../../config/api';
import './ManpowerCard.css';

// Default contact number for all cards when no specific number is provided
const DEFAULT_CONTACT_NUMBER = '97450047060';
// Default WhatsApp number for all maid cards
const DEFAULT_WHATSAPP_NUMBER = '97450047060';

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
    agencyFee?: string;
    candidateContactNumber?: string;
    countryCode?: string;
    isContactNumberVisible?: boolean;
    whatsappNumber?: string;
    isVerified?: boolean;
  };
  hideViewButton?: boolean;
  onEdit?: (worker: ManpowerCardProps['worker']) => void;
  onDelete?: (id: string) => void;
}

const ManpowerCard: React.FC<ManpowerCardProps> = ({ worker, hideViewButton = false, onEdit, onDelete }) => {
  const isAdminMode = !!(onEdit || onDelete);
  const navigate = useNavigate();
  const isAdminRoute = window.location.pathname.includes('/admin');

  const handleViewClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/manpower/${worker._id}${isAdminRoute ? '?from=admin' : ''}`);
  };

  const sanitizePhone = (num?: string) => {
    if (!num) return '';
    return num.replace(/[^0-9]/g, '');
  };

  const getPhoneNumber = () => {
    const number = worker.candidateContactNumber || worker.whatsappNumber || DEFAULT_CONTACT_NUMBER;
    const code = sanitizePhone(worker.countryCode || '');
    const sanitized = sanitizePhone(number);
    if (code && sanitized.startsWith(code)) return sanitized;
    if (code) return `${code}${sanitized}`;
    return sanitized;
  };

  const trackAnalytics = (actionType: string) => {
    const payload = {
      userType: 'GUEST',
      workerId: worker._id,
      actionType: actionType
    };
    
    fetch(`${API_ENDPOINTS.ANALYTICS}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch((error) => console.error('Analytics tracking failed:', error));
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAnalytics('CALL');
    const phone = getPhoneNumber();
    if (!phone) return;
    window.open(`tel:${phone}`);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAnalytics('WHATSAPP');
    const workerUrl = `${window.location.origin}/manpower/${worker._id}`;
    const message = `Hi, I'm interested in this worker: ${worker.name}. Please check: ${workerUrl}`;
    // Always use the default WhatsApp number for all cards
    window.open(`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="manpower-card-new" role="article" aria-label={`Worker card for ${worker.name}`}>
      <div className="card-content-wrapper">
        {/* Left Section - Image */}
        <div className="card-image-section">
          <div className="image-container">
            <img
              src={`${ASSETS_CONFIG.BASE_URL}${worker.photo}`}
              alt={worker.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
              }}
            />
          </div>
          <div className="verified-badge">
            <CheckCircle size={14} />
            <span>Verified</span>
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="card-details-section">
          <h3 className="worker-title">
            {capitalizeFirst(worker.name)} - {worker.age} years
          </h3>
          
          <ul className="details-list">
            <li>
              <span className="detail-label">Job</span>
              <span className="detail-value">{capitalizeFirst(worker.jobTitle)}</span>
            </li>
            <li>
              <span className="detail-label">Country</span>
              <span className="detail-value">{capitalizeFirst(worker.nationality)}</span>
            </li>
            <li>
              <span className="detail-label">Religion</span>
              <span className="detail-value">{capitalizeFirst(worker.religion)}</span>
            </li>
            <li>
              <span className="detail-label">Experience</span>
              <span className="detail-value">{worker.experience}</span>
            </li>
            <li>
              <span className="detail-label">Salary</span>
              <span className="detail-value">{worker.salary} QAR</span>
            </li>
            {worker.agencyFee && (
              <li>
                <span className="detail-label">Agency Fee</span>
                <span className="detail-value">{worker.agencyFee} QAR</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions-row">
        {!isAdminMode && (
          <>
            <button
              className="action-btn call-btn"
              onClick={handleCallClick}
              aria-label={`Call ${worker.name}`}
              title={`Call ${worker.name}`}
            >
              <Phone size={14} />
              <span>Call</span>
            </button>
            
            <button
              className="action-btn whatsapp-btn"
              onClick={handleWhatsAppClick}
              aria-label={`Message ${worker.name} on WhatsApp`}
              title={`Message ${worker.name} on WhatsApp`}
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </button>
          </>
        )}
        
        {!hideViewButton && (
          <button
            className="action-btn view-btn"
            onClick={handleViewClick}
            aria-label={`View details of ${worker.name}`}
            title="View details"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
        )}

        {onEdit && (
          <button
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(worker);
            }}
            aria-label={`Edit ${worker.name}`}
            title="Edit"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
        )}

        {onDelete && (
          <button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(worker._id);
            }}
            aria-label={`Delete ${worker.name}`}
            title="Delete"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ManpowerCard;

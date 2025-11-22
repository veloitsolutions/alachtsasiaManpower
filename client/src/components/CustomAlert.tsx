import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import './CustomAlert.css';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  errors: Record<string, string>;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isOpen, onClose, title = 'Validation Error', errors }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div className="custom-alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-alert-header">
          <div className="custom-alert-icon">
            <AlertCircle size={20} />
            <h2>{title}</h2>
          </div>
          <button className="custom-alert-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="custom-alert-body">
          <p className="custom-alert-message">Please fix the following issues:</p>
          <ul className="custom-alert-list">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
        <div className="custom-alert-footer">
          <button className="custom-alert-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;

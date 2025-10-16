import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Button 
          variant="primary" 
          size="large" 
          onClick={() => navigate('/')}
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
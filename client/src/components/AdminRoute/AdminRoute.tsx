import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const userInfoString = localStorage.getItem('userInfo');
    
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        setIsAdmin(userInfo.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;

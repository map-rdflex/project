import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirect if not logged in or not an admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Render admin content if user is an admin
  return <>{children}</>;
};

export default AdminRoute;
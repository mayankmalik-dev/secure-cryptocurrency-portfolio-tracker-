import React from 'react';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute: React.FC = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

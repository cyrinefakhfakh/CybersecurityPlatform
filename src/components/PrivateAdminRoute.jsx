// src/components/PrivateAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assuming the role is stored in localStorage

  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateAdminRoute;
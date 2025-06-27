import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { role } = useContext(AuthContext);
  if (!role) return <Navigate to="/login" replace />;
  return allowedRoles.includes(role) ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

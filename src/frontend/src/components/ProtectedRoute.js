// This component is for the ProtectedRoute in App.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
    if (!isAllowed === null) {
        return <div>Loading...</div>;
    }
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};

export default ProtectedRoute;

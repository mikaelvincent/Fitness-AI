import React from "react";
import {Navigate, useLocation} from 'react-router-dom';
import {useUser} from '@/hooks/context/UserContext';


interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {user} = useUser();
    const location = useLocation();

    if (!user) {
        // If user is not authenticated, redirect to login
        return <Navigate to="/auth/login" state={{from: location}} replace/>;
    }

    // If user is authenticated, render the child component
    return children;
};

export default ProtectedRoute;

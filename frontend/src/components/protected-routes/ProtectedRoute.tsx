import {ReactNode} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import {useUser} from "@/hooks/context/UserContext";


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const location = useLocation();
    const {token} = useUser();

    if (!token) {
        // If user is not authenticated, redirect to log in
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    // If user is authenticated, render the child component
    return children;
};

export default ProtectedRoute;

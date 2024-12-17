import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/context/UserContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { token } = useUser();

  if (token) {
    // If user is authenticated, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, render the child component
  return children;
};

export default PublicRoute;

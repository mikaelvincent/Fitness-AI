import React from "react";
import { Outlet } from "react-router-dom";
import logo from "@/assets/images/logo_Light Mode.svg";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header for the authentication layout */}
      <header className="flex items-center justify-center p-6">
        <img src={logo} alt="Company Logo" className="h-24 w-auto" />
      </header>

      {/* Main content area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;

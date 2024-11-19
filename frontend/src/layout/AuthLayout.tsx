import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div>
      {/* Header for the authentication layout */}
      <header>
        <h1>Authentication Layout</h1>
      </header>
      {/* Renders the nested routes */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;

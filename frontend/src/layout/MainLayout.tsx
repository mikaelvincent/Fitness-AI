import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div>
      {/* Header for the main layout */}
      <header>
        <h1 className="font-poppins font-bold text-2xl text-orange">
          Main Layout
        </h1>
      </header>
      {/* Renders the nested routes */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

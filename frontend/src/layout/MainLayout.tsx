import React from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      {/* Header for the main layout */}
      <header>
        <h1 className="font-poppins font-bold text-2xl text-orange">
          Main Layout
        </h1>
        <Button>Click me</Button>
      </header>
      {/* Renders the nested routes */}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;

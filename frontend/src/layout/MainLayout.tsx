// frontend/src/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { ResponsiveNav } from "@/components/navbar/responsive-nav.tsx";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground md:px-4 lg:px-20 2xl:px-40">
      {/* Responsive Navigation */}
      <ResponsiveNav />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-hidden pb-20 lg:ml-64 lg:p-0">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

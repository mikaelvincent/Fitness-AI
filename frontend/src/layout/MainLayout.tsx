// frontend/src/layout/MainLayout.tsx
import {Outlet} from "react-router-dom";
import {ResponsiveNav} from "@/components/navbar/responsive-nav.tsx";

const MainLayout = () => {

    return (
        <div className="min-h-screen flex bg-background text-foreground md:px-4 lg:px-20 2xl:px-40">
            {/* Responsive Navigation */}
            <ResponsiveNav/>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 pb-20 lg:pb-4">
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;

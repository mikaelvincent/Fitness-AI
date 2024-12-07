// frontend/src/layout/MainLayout.tsx
import {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {useUser} from "@/hooks/context/UserContext";
import {ResponsiveNav} from "@/components/navbar/responsive-nav.tsx";

const MainLayout = () => {
    const {user} = useUser();

    useEffect(() => {
        if (user) {
            console.log("Authenticated User Details:", user);
        } else {
            console.log("No user is currently authenticated.");
        }
    }, [user]);

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

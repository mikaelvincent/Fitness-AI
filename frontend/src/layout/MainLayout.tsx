// frontend/src/layout/MainLayout.tsx
import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {useUser} from "@/hooks/context/UserContext"; // Import the useUser hook

const MainLayout = () => {
    const {user, logoutUser} = useUser(); // Destructure user and logoutUser from UserContext
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("Authenticated User Details:", user);
        } else {
            console.log("No user is currently authenticated.");
        }
    }, [user]); // This effect runs whenever the 'user' state changes

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Header for the main layout */}
            <header className="flex items-center justify-between p-4 bg-card shadow-md">
                <h1 className="font-poppins font-bold text-2xl text-orange">
                    Main Layout
                </h1>
                {user && (
                    <div className="flex items-center space-x-4">
            <span className="text-sm">
              Logged in as: <strong>{user.name}</strong>
            </span>
                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                )}
            </header>
            {/* Renders the nested routes */}
            <main className="flex-grow">
                <Outlet/>
            </main>
            {/* Optional Footer */}
            <footer className="p-4 bg-card text-center">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;

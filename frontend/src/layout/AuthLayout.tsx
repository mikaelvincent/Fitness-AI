import React from "react";
import {Outlet} from "react-router-dom";
import Logo from "@/components/ui/logo";
import {ModeToggle} from "@/components/theme/ModeToggle.tsx";
import {useTheme} from "@/components/theme/theme-provider.tsx";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";

const AuthLayout = () => {
    const {appliedTheme} = useTheme();
    const isSmallScreen = useIsSmallScreen(); // Defaults to 768px

    // Determine the theme to use for the Logo
    const logoTheme = isSmallScreen ? null : "dark";

    return (
        <div
            className={`min-h-screen flex text-foreground flex-col md:flex-row`}>
            {/* Header for the authentication layout */}
            <header
                className={`flex-none flex flex-col items-center justify-center py-6 w-full bg-background md:w-1/2 ${
                    appliedTheme === "light"
                        ? "md:bg-foreground"
                        : "md:bg-neutral-900 md:border-r-2 md:border-inherit"
                }`}
            >
                {isSmallScreen && (<div className="flex-none flex pr-2 w-full justify-end">
                    <ModeToggle/>
                </div>)}
                <Logo
                    className="w-28 md:w-60"
                    alt="Company Logo"
                    toUseTheme={logoTheme}
                    variant="withText"
                />
            </header>

            {/* Main content area */}
            <main className="flex-1 flex w-full items-start md:flex-col md:items-center md:justify-center">
                {/* This will render the child routes */}
                {!isSmallScreen && (<div className="flex-none flex pr-4 pt-4 w-full justify-end">
                    <ModeToggle/>
                </div>)}

                <div className="flex-1 flex items-center w-full justify-center">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;

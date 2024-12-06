import { Outlet } from "react-router-dom";
import Logo from "@/components/ui/logo";
import { ModeToggle } from "@/components/theme/ModeToggle.tsx";
import { useTheme } from "@/components/theme/theme-provider.tsx";
import useIsLargeScreen from "@/hooks/useIsLargeScreen.tsx";


const SetupLayout = () => {
    const { appliedTheme } = useTheme();
    const isLargeScreen = useIsLargeScreen(1024); // Adjusted breakpoint for consistency

    // Determine the theme to use for the Logo
    const logoTheme = isLargeScreen ? "dark" : appliedTheme;

    return (
        <div
            className={`min-h-screen flex text-foreground flex-col gap-10 md:gap-40 lg:gap-0`}>
            {/* Header for the authentication layout */}
            <header
                className={`flex-none flex justify-between p-6 w-full h-20 bg-background`}
            >
                <Logo
                    className="w-14 lg:w-20"
                    alt="Company Logo"
                    toUseTheme={logoTheme}
                    variant="withoutText"
                />
                <ModeToggle />
            </header>

            {/* Main content area */}
            <main className="flex-auto flex w-full items-start justify-center lg:items-start lg:flex-col ">
                <div className="flex-1 flex items-center w-full justify-center h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SetupLayout;

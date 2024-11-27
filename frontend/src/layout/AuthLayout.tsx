import {Outlet} from "react-router-dom";
import Logo from "@/components/ui/logo";
import {ModeToggle} from "@/components/theme/ModeToggle.tsx";
import {useTheme} from "@/components/theme/theme-provider.tsx";
import useIsLargeScreen from "@/hooks/useIsLargeScreen.tsx";


const AuthLayout = () => {
    const {appliedTheme} = useTheme();
    const isLargeScreen = useIsLargeScreen(1024); // Adjusted breakpoint for consistency

    // Determine the theme to use for the Logo
    const logoTheme = isLargeScreen ? "dark" : appliedTheme;

    return (
        <div
            className={`min-h-screen flex text-foreground flex-col lg:flex-row gap-10 md:gap-40`}>
            {/* Header for the authentication layout */}
            <header
                className={`flex-none flex flex-col items-center justify-center pt-6 w-full bg-background lg:w-1/2 ${
                    appliedTheme === "light"
                        ? "lg:bg-foreground"
                        : "lg:bg-neutral-900 lg:border-r-2 lg:border-inherit"
                }`}
            >
                {!isLargeScreen && (<div className="flex-none flex pr-2 w-full justify-end">
                    <ModeToggle/>
                </div>)}
                <Logo
                    className="w-28 lg:w-60"
                    alt="Company Logo"
                    toUseTheme={logoTheme}
                    variant="withText"
                />
            </header>

            {/* Main content area */}
            <main className="flex-auto flex w-full items-start justify-center lg:items-start lg:flex-col ">
                {/* This will render the child routes */}
                {isLargeScreen && (<div className="flex-none flex pr-4 pt-4 w-full justify-end">
                    <ModeToggle/>
                </div>)}

                <div className="flex-1 flex items-center w-full justify-center h-full">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;

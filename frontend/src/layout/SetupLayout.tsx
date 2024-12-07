import { Outlet } from "react-router-dom";
import Logo from "@/components/ui/logo";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { useTheme } from "@/components/theme/theme-provider";
import useIsLargeScreen from "@/hooks/useIsLargeScreen";

const SetupLayout = () => {
    const { appliedTheme } = useTheme();
    const isLargeScreen = useIsLargeScreen(1024);

    const logoTheme = isLargeScreen ? "dark" : appliedTheme;

    return (
        <div className="min-h-screen flex text-foreground flex-col gap-10 md:gap-40 lg:gap-0">
            <header className="flex-none flex justify-between p-6 w-full h-20 bg-background">
                <Logo
                    className="w-14 lg:w-20"
                    alt="Company Logo"
                    toUseTheme={logoTheme}
                    variant="withoutText"
                />
                <ModeToggle />
            </header>

            <main className="flex-auto flex w-full justify-center items-start pt-20 lg:flex-col">
                <div className="flex-1 flex items-start w-full justify-center h-full p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SetupLayout;

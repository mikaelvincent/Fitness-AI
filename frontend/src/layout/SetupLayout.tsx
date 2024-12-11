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
        <div className="min-h-screen flex text-foreground items-center gap-10 md:gap-40 lg:gap-0">
            <main className="flex-auto flex w-full items-start justify-center lg:items-start lg:flex-col">
                <div className="flex-1 items-start w-full justify-center h-full p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SetupLayout;

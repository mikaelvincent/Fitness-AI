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
            <header className="flex-none flex flex-col-reverse justify-center items-center lg:flex-row lg:justify-between pt-6 lg:p-6 w-full bg-background">

                <Logo
                    className={isLargeScreen ? "w-14 lg:w-20" : "w-60 lg:w-96"}
                    alt="Company Logo"
                    toUseTheme={logoTheme}
                    variant={isLargeScreen ? "withoutText" : "withText"}
                />
                <div className="flex-none flex pr-2 justify-end w-full lg:w-auto">
                    <ModeToggle />
                </div>
            </header>

            <main className="flex-auto flex w-full items-start justify-center lg:items-start lg:flex-col">
                <div className="flex-1 items-start w-full justify-center h-full p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SetupLayout;

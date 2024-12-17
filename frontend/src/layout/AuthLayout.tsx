import { Outlet } from "react-router-dom";
import Logo from "@/components/ui/logo";
import { useTheme } from "@/components/theme/theme-provider.tsx";
import useIsLargeScreen from "@/hooks/useIsLargeScreen.tsx";

const AuthLayout = () => {
  const { appliedTheme } = useTheme();
  const isLargeScreen = useIsLargeScreen(1024); // Adjusted breakpoint for consistency

  // Determine the theme to use for the Logo
  const logoTheme = isLargeScreen ? "dark" : appliedTheme;

  return (
    <div
      className={`flex min-h-screen flex-col justify-center gap-40 text-foreground lg:flex-row lg:gap-0`}
    >
      {/* Header for the authentication layout */}
      <header
        className={`flex w-full flex-none flex-col items-center justify-center bg-background pt-6 lg:w-1/2 ${
          appliedTheme === "light"
            ? "lg:bg-foreground"
            : "lg:border-r-2 lg:border-inherit lg:bg-neutral-900"
        }`}
      >
        <Logo
          className="w-60 lg:w-96"
          alt="Company Logo"
          toUseTheme={logoTheme}
          variant="withText"
        />
      </header>

      {/* Main content area */}
      <main className="flex w-full flex-auto items-start justify-center lg:flex-col lg:items-start">
        {/* This will render the child routes */}
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;

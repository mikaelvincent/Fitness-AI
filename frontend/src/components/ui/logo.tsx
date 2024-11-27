// frontend/src/components/ui/logo.tsx
import logoLightWithText from "@/assets/images/logo_Light Mode.svg";
import logoLightWithoutText from "@/assets/images/logo_Light Mode - No Text.svg";
import logoDarkWithText from "@/assets/images/logo_Dark Mode.svg";
import logoDarkWithoutText from "@/assets/images/logo_Dark Mode - No Text.svg";
import {useTheme} from "@/components/theme/theme-provider.tsx";

interface LogoProps {
    className?: string;
    alt?: string;
    toUseTheme: "light" | "dark" | null;
    variant?: "withText" | "withoutText";
}

const Logo = ({
                  className,
                  alt = "Company Logo",
                  toUseTheme = null,
                  variant = "withText",
              }: LogoProps) => {
    let logoSrc: string;

    const {appliedTheme} = useTheme();

    const theme = toUseTheme || appliedTheme;

    if (theme === "light" && variant === "withText") {
        logoSrc = logoLightWithText;
    } else if (theme === "light" && variant === "withoutText") {
        logoSrc = logoLightWithoutText;
    } else if (theme === "dark" && variant === "withText") {
        logoSrc = logoDarkWithText;
    } else if (theme === "dark" && variant === "withoutText") {
        logoSrc = logoDarkWithoutText;
    } else {
        // Fallback to light with text if no matching condition
        logoSrc = logoLightWithText;
    }

    return <img src={logoSrc} alt={alt} className={className}/>;
};

export default Logo;

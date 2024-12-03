// frontend/src/components/ui/logo.tsx
import logoNoText from "@/assets/images/no_text.svg";
import logoLight from "@/assets/images/light_mode.svg";
import logoDark from "@/assets/images/dark_mode.svg";
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
        logoSrc = logoLight;
    } else if ((theme === "light" || theme === "dark") && variant === "withoutText") {
        logoSrc = logoNoText;
    } else if (theme === "dark" && variant === "withText") {
        logoSrc = logoDark;
    } else {
        // Fallback to light with text if no matching condition
        logoSrc = logoNoText;
    }

    return <img src={logoSrc} alt={alt} className={className}/>;
};

export default Logo;

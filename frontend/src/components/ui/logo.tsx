// frontend/src/components/ui/logo.tsx

import React from "react";
import logoLightWithText from "@/assets/images/logo_Light Mode.svg";
import logoLightWithoutText from "@/assets/images/logo_Light Mode - No Text.svg";
import logoDarkWithText from "@/assets/images/logo_Dark Mode.svg";
import logoDarkWithoutText from "@/assets/images/logo_Dark Mode - No Text.svg";

interface LogoProps {
  className?: string;
  alt?: string;
  theme?: "light" | "dark";
  variant?: "withText" | "withoutText";
}

const Logo = ({
  className,
  alt = "Company Logo",
  theme = "light",
  variant = "withText",
}: LogoProps) => {
  let logoSrc: string;

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

  return <img src={logoSrc} alt={alt} className={className} />;
};

export default Logo;

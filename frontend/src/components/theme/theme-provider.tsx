import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  selectedTheme: Theme;
  appliedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  selectedTheme: "dark",
  appliedTheme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [appliedTheme, setAppliedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    const applyTheme = (theme: "light" | "dark") => {
      root.classList.add(theme);
      setAppliedTheme(theme);
    };

    if (selectedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const systemTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(systemTheme);

      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? "dark" : "light";
        applyTheme(newSystemTheme);
      };

      // Listen for changes in system theme
      mediaQuery.addEventListener("change", handleChange);

      // Cleanup listener on unmount or when selectedTheme changes
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(selectedTheme);
    }
  }, [selectedTheme]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setSelectedTheme(theme);
  };

  const value: ThemeProviderState = {
    selectedTheme,
    appliedTheme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

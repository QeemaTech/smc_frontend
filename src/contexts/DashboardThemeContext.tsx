import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

export type DashboardTheme = "light" | "dark";

const STORAGE_KEY = "dashboardTheme";
const THEME_EVENT = "dashboard-theme-change";

function readStoredTheme(): DashboardTheme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyDocumentTheme(theme: DashboardTheme, active: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", active && theme === "dark");
}

interface DashboardThemeContextValue {
  theme: DashboardTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: DashboardTheme) => void;
  chart: {
    grid: string;
    axis: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
    primary: string;
  };
}

const DashboardThemeContext = createContext<DashboardThemeContextValue | undefined>(
  undefined,
);

export const DashboardThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [theme, setThemeState] = useState<DashboardTheme>(() => readStoredTheme());

  useLayoutEffect(() => {
    applyDocumentTheme(theme, isDashboard);
  }, [theme, isDashboard]);

  const setTheme = useCallback(
    (next: DashboardTheme) => {
      setThemeState(next);
      localStorage.setItem(STORAGE_KEY, next);
      if (isDashboard) {
        applyDocumentTheme(next, true);
      }
      window.dispatchEvent(new Event(THEME_EVENT));
    },
    [isDashboard],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const chart = useMemo(
    () =>
      theme === "dark"
        ? {
            grid: "hsla(222, 10%, 30%, 0.35)",
            axis: "hsla(215, 12%, 68%, 0.9)",
            tooltipBg: "hsl(222, 13%, 15%)",
            tooltipBorder: "hsl(222, 10%, 22%)",
            tooltipText: "hsl(210, 20%, 96%)",
            primary: "hsl(214, 70%, 52%)",
          }
        : {
            grid: "rgba(0,0,0,0.08)",
            axis: "rgba(0,0,0,0.55)",
            tooltipBg: "hsl(0, 0%, 100%)",
            tooltipBorder: "hsl(220, 13%, 90%)",
            tooltipText: "hsl(220, 15%, 15%)",
            primary: "hsl(214, 82%, 40%)",
          },
    [theme],
  );

  const value = useMemo(
    () => ({
      theme,
      isDarkMode: theme === "dark",
      toggleTheme,
      setTheme,
      chart,
    }),
    [theme, toggleTheme, setTheme, chart],
  );

  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return context;
};

export { STORAGE_KEY as DASHBOARD_THEME_STORAGE_KEY, THEME_EVENT as DASHBOARD_THEME_EVENT };

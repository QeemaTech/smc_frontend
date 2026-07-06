import { useEffect, useState } from "react";
import { Toaster as Sonner, toast } from "sonner";
import {
  DASHBOARD_THEME_EVENT,
  DASHBOARD_THEME_STORAGE_KEY,
  DashboardTheme,
} from "@/contexts/DashboardThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function readDashboardTheme(): DashboardTheme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) === "dark"
    ? "dark"
    : "light";
}

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<DashboardTheme>(() => readDashboardTheme());

  useEffect(() => {
    const syncTheme = () => setTheme(readDashboardTheme());
    syncTheme();
    window.addEventListener(DASHBOARD_THEME_EVENT, syncTheme);
    return () => window.removeEventListener(DASHBOARD_THEME_EVENT, syncTheme);
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { clearAdminSession } from "@/lib/adminAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDashboardTheme } from "@/contexts/DashboardThemeContext";
import { useContacts } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/MaterialIcon";

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
}

const DashboardSidebar = () => {
  const { t } = useLanguage();
  const { isDarkMode, toggleTheme } = useDashboardTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: contacts = [] } = useContacts();
  const unreadContacts = contacts.filter((contact) => contact.status === "new").length;

  const handleLogout = () => {
    clearAdminSession();
    navigate("/login");
  };

  const menuItems: SidebarItem[] = [
    { icon: "dashboard", label: t("dashboard") || "Dashboard", path: "/dashboard/home" },
    { icon: "bar_chart", label: t("statistics") || "Statistics", path: "/dashboard/statistics" },
    { icon: "payments", label: t("financial") || "Financial", path: "/dashboard/financial" },
    { icon: "inventory_2", label: t("products") || "Products", path: "/dashboard/products" },
    {
      icon: "account_tree",
      label: t("productCategories"),
      path: "/dashboard/categories",
    },
    { icon: "newspaper", label: t("news") || "News", path: "/dashboard/news" },
    { icon: "article", label: t("pageContent") || "Page Content", path: "/dashboard/pages" },
    { icon: "image", label: t("heroBanners") || "Hero Banners", path: "/dashboard/banners" },
    { icon: "photo_library", label: t("mediaLibrary") || "Media Library", path: "/dashboard/media" },
    {
      icon: "mail",
      label: t("contacts") || "Contacts",
      path: "/dashboard/contacts",
      badge: unreadContacts > 0 ? unreadContacts : undefined,
    },
    { icon: "feedback", label: t("complaints") || "Complaints", path: "/dashboard/complaints" },
    { icon: "assignment", label: t("tenders") || "Tenders", path: "/dashboard/tenders" },
    {
      icon: "groups",
      label: t("members"),
      path: "/dashboard/members",
    },
    {
      icon: "business",
      label: t("clients"),
      path: "/dashboard/clients",
    },
    { icon: "travel_explore", label: t("seoSettings") || "SEO Settings", path: "/dashboard/seo" },
    { icon: "manage_accounts", label: t("users") || "Users", path: "/dashboard/users" },
    { icon: "settings", label: t("settings") || "Settings", path: "/dashboard/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border p-6">
        <h2 className="text-xl font-medium text-sidebar-foreground">{t('smcAdmin')}</h2>
        <p className="mt-1 text-xs text-sidebar-foreground/60">{t('controlPanel')}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard/tenders" &&
              location.pathname.startsWith("/dashboard/tenders/"));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elevation-1"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <MaterialIcon name={item.icon} size={22} filled={isActive} />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={toggleTheme}
        >
          <MaterialIcon name={isDarkMode ? "light_mode" : "dark_mode"} size={20} />
          {isDarkMode
            ? t("lightMode") || "Light Mode"
            : t("darkMode") || "Dark Mode"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <MaterialIcon name="logout" size={20} />
          {t("logout") || "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed left-4 top-4 z-[60] lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background elevation-2"
        >
          <MaterialIcon name={isMobileOpen ? "close" : "menu"} size={22} />
        </Button>
      </div>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          style={{ zIndex: 40 }}
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;

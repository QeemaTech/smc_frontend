import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/usePageContent";
import { getLocalizedLink } from "@/hooks/useLocalizedNavigate";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PublicShell } from "@/components/public/PublicShell";
import smcLogo from "@/assets/manganese/logo.png";

interface NavigationItem {
  name: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: Array<{ name: string; href: string }>;
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const settings = useSettings();

  const aboutSubmenu = [
    { name: t("companyIntroduction"), href: getLocalizedLink("/about", language) },
    { name: t("companyVision"), href: getLocalizedLink("/about#vision", language) },
    { name: t("members"), href: getLocalizedLink("/members", language) },
  ];

  /** Primary nav — ordered by visitor priority (RTL: right → left) */
  const navigation: NavigationItem[] = [
    { name: t("home"), href: getLocalizedLink("/", language) },
    { name: t("about"), href: getLocalizedLink("/about", language), hasSubmenu: true, submenu: aboutSubmenu },
    { name: t("products"), href: getLocalizedLink("/products", language) },
    { name: t("privatePort"), href: getLocalizedLink("/private-port", language) },
    { name: t("tenders"), href: getLocalizedLink("/tenders", language) },
    { name: t("news"), href: getLocalizedLink("/news", language) },
    { name: t("financial"), href: getLocalizedLink("/financial", language) },
    { name: t("contact"), href: getLocalizedLink("/contact", language) },
  ];

  const complaintsHref = getLocalizedLink("/complaints", language);

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");

  const navLinkClass = (active: boolean) =>
    cn(
      "header-nav-link relative inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap",
      "rounded-full px-2.5 py-2 text-[13px] font-medium leading-none tracking-normal",
      "transition-all duration-200 hover:bg-muted/80 hover:text-foreground",
      "xl:px-3 xl:text-sm",
      active
        ? "bg-primary/12 text-primary shadow-sm"
        : "text-muted-foreground",
    );

  const isAboutActive =
    location.pathname.startsWith(`/${language}/about`) ||
    location.pathname.startsWith(`/${language}/members`);

  const isComplaintsActive =
    location.pathname === complaintsHref ||
    location.pathname.startsWith(`${complaintsHref}/`);

  const renderNavItem = (item: NavigationItem) => {
    if (item.hasSubmenu && item.submenu) {
      const active = location.pathname === item.href || isAboutActive;
      return (
        <DropdownMenu key={item.name}>
          <DropdownMenuTrigger className={cn(navLinkClass(active), "outline-none")}>
            <span className="whitespace-nowrap">{item.name}</span>
            <MaterialIcon name="expand_more" size={16} className="shrink-0 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={8}
            dir={isRTL ? "rtl" : "ltr"}
            className="nav-dropdown min-w-[200px] rounded-2xl border border-border/80 p-2 elevation-2"
          >
            {item.submenu.map((subItem) => {
              const pathWithoutHash = subItem.href.split("#")[0];
              const hash = subItem.href.includes("#")
                ? `#${subItem.href.split("#")[1]}`
                : "";
              const subActive =
                location.pathname === pathWithoutHash &&
                (hash ? location.hash === hash : !location.hash);
              return (
                <DropdownMenuItem key={subItem.name} asChild className="rounded-xl p-0">
                  <Link
                    to={subItem.href}
                    className={cn(
                      "flex w-full cursor-pointer items-center whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors",
                      subActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {subItem.name}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    const active =
      location.pathname === item.href ||
      location.pathname.startsWith(`${item.href}/`);

    return (
      <Link key={item.name} to={item.href} className={navLinkClass(active)}>
        {item.name}
      </Link>
    );
  };

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-lg elevation-1"
    >
      <PublicShell as="nav" className="flex h-[72px] items-center justify-between gap-3">
        {/* Logo + primary navigation */}
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-5 xl:gap-6">
          <Link
            to={getLocalizedLink("/", language)}
            className="flex shrink-0 items-center gap-2.5 rounded-xl py-1 transition-opacity hover:opacity-90 sm:gap-3"
          >
            <img
              src={smcLogo}
              alt={settings.siteName}
              className="h-10 w-10 object-contain sm:h-11 sm:w-11 md:h-12 md:w-12"
            />
            <div className="hidden min-w-0 text-start sm:block">
              <div className="whitespace-nowrap text-sm font-semibold leading-tight text-foreground md:text-[15px]">
                {settings.siteName}
              </div>
              <div className="mt-0.5 whitespace-nowrap text-[11px] text-muted-foreground">
                {t("since1957")}
              </div>
            </div>
          </Link>

          <div
            className={cn(
              "hidden min-w-0 flex-1 items-center lg:flex",
              "flex-nowrap gap-0.5 overflow-x-auto xl:gap-1",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {navigation.map(renderNavItem)}
          </div>
        </div>

        {/* Complaints CTA + language — visually separated from main nav */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={complaintsHref}
            className={cn(
              "header-complaints-cta hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 sm:inline-flex",
              "text-[13px] font-medium leading-none transition-all duration-200 xl:text-sm",
              isComplaintsActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-primary/90 text-primary-foreground hover:bg-primary",
            )}
          >
            <MaterialIcon name="support_agent" size={18} />
            <span>{t("complaints")}</span>
          </Link>

          <div
            className="hidden h-6 w-px shrink-0 bg-border/80 lg:block"
            aria-hidden="true"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="lang-switch-btn hidden h-9 shrink-0 gap-2 whitespace-nowrap rounded-full border-border/80 px-3 text-[13px] sm:inline-flex xl:h-10 xl:px-4 xl:text-sm"
          >
            <span
              aria-hidden="true"
              className={cn(
                "lang-flag",
                language === "en" ? "lang-flag--eg" : "lang-flag--us",
              )}
            />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="lang-switch-btn h-9 w-9 shrink-0 rounded-full sm:hidden"
            aria-label="Toggle language"
          >
            <span
              aria-hidden="true"
              className={cn(
                "lang-flag",
                language === "en" ? "lang-flag--eg" : "lang-flag--us",
              )}
            />
          </Button>

          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <MaterialIcon name={mobileMenuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </PublicShell>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/80 bg-background transition-all duration-300 ease-out lg:hidden",
          mobileMenuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <PublicShell className="space-y-1 py-4">
          {navigation.map((item) => {
            if (item.hasSubmenu && item.submenu) {
              return (
                <div key={item.name} className="space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.name}
                  </p>
                  <div className="space-y-0.5 ps-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            const active =
              location.pathname === item.href ||
              location.pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-primary/12 font-medium text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="mt-3 border-t border-border/80 pt-3">
            <Link
              to={complaintsHref}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium transition-colors",
                isComplaintsActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary",
              )}
            >
              <MaterialIcon name="support_agent" size={20} />
              {t("complaints")}
            </Link>
          </div>
        </PublicShell>
      </div>
    </header>
  );
};

export default Header;

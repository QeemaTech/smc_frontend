import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedLink } from "@/hooks/useLocalizedNavigate";
import { PublicPageHeader, PublicShell } from "@/components/public/PublicShell";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { language, t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="search_off"
        eyebrow="404"
        title={t('pageNotFound')}
        centered
      />
      <PublicShell className="flex flex-col items-center py-8 text-center">
        <Button asChild>
          <Link to={getLocalizedLink('/', language)}>{t('returnToHome')}</Link>
        </Button>
      </PublicShell>
    </div>
  );
};

export default NotFound;

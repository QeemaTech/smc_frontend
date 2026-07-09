import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { useSettings, usePageContent } from '@/hooks/usePageContent';
import { MaterialIcon } from '@/components/MaterialIcon';
import { PublicShell } from '@/components/public/PublicShell';
import smcLogo from '@/assets/manganese/logo.png';
import PhoneNumbers, { PhoneNumber } from '@/components/PhoneNumbers';

const columnTitle =
  'mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/75';

const footerLink = cn(
  'group inline-flex items-center gap-2 rounded-lg py-1.5 text-sm text-primary-foreground/75',
  'transition-colors duration-200 hover:text-primary-foreground',
);

const Footer = () => {
  const { t, isRTL, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const settings = useSettings();
  const footerDescription = usePageContent('footer', 'description', t('footerDescription'));
  const quickLinks = usePageContent('footer', 'quickLinks', t('quickLinks'));
  const followUs = usePageContent('footer', 'followUs', t('followUs'));
  const salesNumbersTitle = usePageContent('footer', 'salesNumbersTitle', t('salesNumbers'));
  const administrationNumbersTitle = usePageContent('footer', 'administrationNumbersTitle', t('administrationNumbers'));

  const salesPhones: PhoneNumber[] = settings.phoneNumbersSales || [];
  const salesFax: PhoneNumber[] = settings.faxNumbersSales || [];
  const adminPhones: PhoneNumber[] = settings.phoneNumbersAdmin || [];
  const adminFax: PhoneNumber[] = settings.faxNumbersAdmin || [];

  const footerNavigation = [
    { name: t('home'), href: getLocalizedLink('/', language), icon: 'home' as const },
    { name: t('about'), href: getLocalizedLink('/about', language), icon: 'info' as const },
    { name: t('products'), href: getLocalizedLink('/products', language), icon: 'inventory_2' as const },
    { name: t('news'), href: getLocalizedLink('/news', language), icon: 'newspaper' as const },
    { name: t('contact'), href: getLocalizedLink('/contact', language), icon: 'mail' as const },
    { name: t('complaints'), href: getLocalizedLink('/complaints', language), icon: 'support_agent' as const },
  ];

  const socialLinks = [
    settings.facebook && { href: settings.facebook, label: t('facebook'), icon: 'groups' as const },
    settings.whatsapp && { href: settings.whatsapp, label: t('whatsapp'), icon: 'chat' as const },
    settings.linkedin && { href: settings.linkedin, label: t('linkedin'), icon: 'business_center' as const },
  ].filter(Boolean) as { href: string; label: string; icon: string }[];

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="bg-primary text-primary-foreground">
      <PublicShell className="py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Col 1 — Brand (rightmost in RTL) */}
          <div className="space-y-4 text-start">
            <div className="flex items-center gap-3">
              <img
                src={smcLogo}
                alt={settings.siteName}
                className="h-12 w-12 shrink-0 rounded-full object-contain"
              />
              <div>
                <p className="text-base font-semibold leading-snug">{settings.siteName}</p>
                <p className="text-xs text-primary-foreground/60">{t('since1957')}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              {footerDescription}
            </p>
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className={cn(footerLink, 'text-primary-foreground/70')}
              >
                <MaterialIcon name="mail" size={18} className="opacity-80" />
                <span>{settings.email}</span>
              </a>
            )}
          </div>

          {/* Col 2 — Sales */}
          <div className="text-start">
            <h3 className={columnTitle}>{salesNumbersTitle}</h3>
            <div className="space-y-2">
              {salesPhones.length > 0 && <PhoneNumbers phones={salesPhones} />}
              {salesFax.length > 0 && (
                <PhoneNumbers phones={salesFax} showLabels />
              )}
              {salesPhones.length === 0 && salesFax.length === 0 && (
                <p className="text-sm text-primary-foreground/50">—</p>
              )}
            </div>
          </div>

          {/* Col 3 — Administration */}
          <div className="text-start">
            <h3 className={columnTitle}>{administrationNumbersTitle}</h3>
            <div className="space-y-2">
              {adminPhones.length > 0 && <PhoneNumbers phones={adminPhones} />}
              {adminFax.length > 0 && (
                <PhoneNumbers phones={adminFax} showLabels />
              )}
              {adminPhones.length === 0 && adminFax.length === 0 && (
                <p className="text-sm text-primary-foreground/50">—</p>
              )}
            </div>
          </div>

          {/* Col 4 — Links + Social */}
          <div className="space-y-6 text-start">
            <div>
              <h3 className={columnTitle}>{quickLinks}</h3>
              <nav className="flex flex-col gap-0.5" aria-label={quickLinks}>
                {footerNavigation.map((item) => (
                  <Link key={item.name} to={item.href} className={footerLink}>
                    <MaterialIcon name={item.icon} size={18} className="opacity-80" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className={columnTitle}>{followUs}</h3>
              <div className="flex flex-col gap-0.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLink}
                  >
                    <MaterialIcon name={item.icon} size={18} className="opacity-80" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/15 pt-6 text-center keep-center">
          <p className="text-xs leading-5 text-primary-foreground/60">
            © {currentYear} {settings.siteName} {t('allRightsReserved')} · {t('designedBy')}{' '}
            <a
              href="https://qeematech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-primary-foreground/30 underline-offset-2 transition-colors hover:text-primary-foreground"
            >
              QeemaTech
            </a>
          </p>
        </div>
      </PublicShell>
    </footer>
  );
};

export default Footer;

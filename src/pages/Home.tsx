import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MaterialIcon } from '@/components/MaterialIcon';
import { ImageSlideshow } from '@/components/public/ImageSlideshow';
import { ProductCard } from '@/components/public/cards';
import { getProductIconName } from '@/lib/productIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PublicShell } from '@/components/public/PublicShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { pickLocalized, pickLocalizedBannerField } from '@/lib/localize';
import { cn, resolveImageSrc } from '@/lib/utils';
import { useProducts, useProductCategories, useClients, useCreateContact, useBanners } from '@/hooks/useApi';
import { usePageContent, usePageContentJson, useSettings } from '@/hooks/usePageContent';
import { formatAllPhoneNumbers } from '@/lib/contactDisplay';
import { toast } from 'sonner';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import heroSlideTwo from '@/assets/manganese/two.jpg';
import heroSlideThree from '@/assets/manganese/three.jpg';
import mnHome from '@/assets/manganese/home3-image3.jpg';
import mnPortfolio14 from '@/assets/manganese/portfolio14.jpg';
import mnPortfolio16 from '@/assets/manganese/portfolio16.jpg';
import image1 from '@/assets/manganese/image 1.jpg';
import image2 from '@/assets/manganese/image 2.jpg';
import image3 from '@/assets/manganese/image 3.jpg';
import image4 from '@/assets/manganese/image 4.jpg';
import image5 from '@/assets/manganese/image 5.jpg';
import image6 from '@/assets/manganese/image 6.jpg';
import image7 from '@/assets/manganese/image 7.jpg';
import image8 from '@/assets/manganese/image 8.jpg';
import image9 from '@/assets/manganese/image 9.jpg';

const defaultGalleryImages = [image1, image2, image3, image4, image5, image6, image7, image8, image9];

const heroSlides = [
  { src: heroSlideOne, alt: 'Manganese smelting hall with liquid metal pouring' },
  { src: heroSlideTwo, alt: 'Industrial ladle moving molten manganese alloy' },
  { src: heroSlideThree, alt: 'Conveyor line handling crushed manganese ore' },
];

const productFallbackImages = [heroSlideOne, heroSlideTwo, heroSlideThree, mnHome, mnPortfolio14, mnPortfolio16];

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.4 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, countRef };
}

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  index: number;
}

function StatCard({ value, suffix, label, description, index }: StatCardProps) {
  const { count, countRef } = useCountUp(value);

  return (
    <div
      className="home-stat-card animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div ref={countRef} className="home-stat-card__value ltr-nums">
        {count}
        {suffix}
      </div>
      <p className="mt-3 text-base font-semibold">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

const Home = () => {
  const { t, isRTL, language } = useLanguage();
  const settings = useSettings();
  const [activeSlide, setActiveSlide] = useState(0);
  const createContact = useCreateContact();
  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstName = contactFormData.firstName.trim();
    const lastName = contactFormData.lastName.trim();
    const email = contactFormData.email.trim();
    const phone = contactFormData.phone.trim();
    const message = contactFormData.message.trim();
    const name = [firstName, lastName].filter(Boolean).join(' ');

    if (!name || !email || !message) {
      toast.error(
        isRTL
          ? 'يرجى تعبئة الاسم والبريد الإلكتروني والرسالة'
          : 'Please fill in your name, email, and message',
      );
      return;
    }

    try {
      await createContact.mutateAsync({ name, email, phone, message });
      toast.success(t('contactMessageSuccess'));
      setContactFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (error: unknown) {
      const apiMessage =
        (error instanceof Error ? error.message : String(error)).replace(/^API Error:\s*/i, '') || '';
      toast.error(
        isRTL
          ? `فشل في إرسال الرسالة${apiMessage ? `: ${apiMessage}` : ''}`
          : `Failed to send message${apiMessage ? `: ${apiMessage}` : ''}`,
      );
    }
  };

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const { data: banners = [] } = useBanners();
  const { data: clients = [] } = useClients();
  const [settingsClientLogos, setSettingsClientLogos] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadClientLogos = () => {
      try {
        const saved = localStorage.getItem('siteSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.clientLogos && Array.isArray(parsed.clientLogos)) {
            setSettingsClientLogos(parsed.clientLogos);
          }
        }
      } catch {
        /* ignore */
      }
    };

    loadClientLogos();
    window.addEventListener('storage', loadClientLogos);
    window.addEventListener('settingsUpdated', loadClientLogos);
    return () => {
      window.removeEventListener('storage', loadClientLogos);
      window.removeEventListener('settingsUpdated', loadClientLogos);
    };
  }, []);

  const clientLogos = (() => {
    const apiLogos = clients
      .filter((client) => client.status === 'active' && client.logo)
      .sort((a, b) => a.order - b.order)
      .map((client) => resolveImageSrc(client.logo))
      .filter(Boolean);

    if (apiLogos.length > 0) return apiLogos;
    return settingsClientLogos.map((logo) => resolveImageSrc(logo)).filter(Boolean);
  })();

  const gallerySectionTitle = usePageContent('home', 'gallerySectionTitle', t('productSilicomanganese'));
  const gallerySectionDescription = usePageContent(
    'home',
    'gallerySectionDescription',
    t('productSilicomanganeseDesc'),
  );
  const cmsGalleryImages = usePageContentJson<string[]>('home', 'galleryImages', []);
  const silicomanganeseImages = useMemo(() => {
    if (Array.isArray(cmsGalleryImages) && cmsGalleryImages.length > 0) {
      const resolved = cmsGalleryImages.map((img) => resolveImageSrc(img)).filter(Boolean);
      if (resolved.length > 0) return resolved;
    }
    return defaultGalleryImages;
  }, [cmsGalleryImages]);

  const industrialCategory = categories.find(
    (cat) => (cat.slug === 'industrial' || cat.name.toLowerCase().includes('industrial')) && !cat.parent_id,
  );
  const miningCategory = categories.find(
    (cat) => (cat.slug === 'mining' || cat.name.toLowerCase().includes('mining')) && !cat.parent_id,
  );

  const industrialProductsList = products
    .filter((p) => {
      if (p.status !== 'active') return false;
      const productCategoryId = p.category_id ?? p.categoryId;
      return productCategoryId === industrialCategory?.id || (p.category === 'Industrial' && !productCategoryId);
    })
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  const miningProductsList = products
    .filter((p) => {
      if (p.status !== 'active') return false;
      const productCategoryId = p.category_id ?? p.categoryId;
      return productCategoryId === miningCategory?.id || (p.category === 'Mining' && !productCategoryId);
    })
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  const heroTitle = usePageContent('home', 'heroTitle', t('heroTitle'));
  const heroSubtitle = usePageContent('home', 'heroSubtitle', t('heroSubtitle'));
  const heroDescription = usePageContent('home', 'heroDescription', t('heroDescription'));
  const industrialProducts = usePageContent('home', 'industrialProducts', t('industrialProducts'));
  const productsSectionTitle = usePageContent('home', 'productsSectionTitle', t('productsSectionTitle'));
  const productsSectionSubtitle = usePageContent(
    'home',
    'productsSectionSubtitle',
    t('productsSectionSubtitle'),
  );
  const industrialProductsDescription = usePageContent(
    'home',
    'industrialProductsDescription',
    t('industrialProductsDescription'),
  );
  const miningProducts = usePageContent('home', 'miningProducts', t('miningProducts'));
  const miningProductsDescription = usePageContent(
    'home',
    'miningProductsDescription',
    t('miningProductsDescription'),
  );

  const activeBanners =
    banners.length > 0
      ? banners.filter((b) => b.active).sort((a, b) => a.order - b.order)
      : heroSlides.map((slide, idx) => ({
          image: slide.src,
          title: '',
          subtitle: '',
          description: '',
          id: idx,
        }));

  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length]);

  const stats = [
    { value: 30, suffix: '+', label: t('statExperienceLabel'), description: t('statExperienceDescription') },
    { value: 500, suffix: '+', label: t('statWorkersLabel'), description: t('statWorkersDescription') },
    { value: 36000, suffix: ' TON', label: t('statProductionLabel'), description: t('statProductionDescription') },
  ];

  const uses = [
    { iconName: 'factory', title: t('usesSteelTitle'), description: t('usesSteelDescription') },
    { iconName: 'science', title: t('usesChemicalTitle'), description: t('usesChemicalDescription') },
    { iconName: 'auto_awesome', title: t('usesWeldingTitle'), description: t('usesWeldingDescription') },
  ];

  const contactChannels = [
    {
      iconName: 'location_on',
      label: t('contactHeadOfficeLabel'),
      value: settings.address || t('contactHeadOfficeValue'),
    },
    {
      iconName: 'location_city',
      label: t('contactCairoOfficeLabel'),
      value: settings.cairoAddress || t('contactCairoOfficeValue'),
    },
    {
      iconName: 'phone',
      label: t('contactPhoneLabel'),
      value: formatAllPhoneNumbers(settings) || t('contactPhoneValue'),
    },
    {
      iconName: 'mail',
      label: t('contactEmailLabel'),
      value: settings.email || t('contactEmailValue'),
    },
  ];

  const renderProductGrid = (list: typeof industrialProductsList) => {
    if (productsLoading) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          {isRTL ? 'جاري تحميل المنتجات...' : 'Loading products...'}
        </div>
      );
    }

    return (
      <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((product, index) => {
          const imageSrc = resolveImageSrc(product.image, {
            cacheKey: product.updated_at || product.updatedAt,
            fallback: productFallbackImages[product.id % productFallbackImages.length],
          });

          return (
            <ProductCard
              key={product.id}
              to={getLocalizedLink(`/product/${product.id}`, language)}
              imageSrc={imageSrc}
              imageAlt={pickLocalized(product as any, 'name', language)}
              title={pickLocalized(product as any, 'name', language)}
              description={pickLocalized(product as any, 'description', language)}
              iconName={getProductIconName(product.name)}
              index={index}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="home-page bg-background text-foreground">
      {/* Hero */}
      <section className="home-hero">
        <div className="absolute inset-0">
          {activeBanners.map((banner, index) => (
            <img
              key={banner.id || index}
              src={resolveImageSrc(banner.image, {
                cacheKey: (banner as any).updatedAt,
                fallback: heroSlides[index]?.src,
              })}
              alt={banner.title || heroSlides[index]?.alt || t('heroBanners')}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all duration-700',
                index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
              )}
            />
          ))}
          <div className="home-hero__overlay" />
          <div className="home-hero__side-gradient" />
        </div>

        <PublicShell className="relative z-10 w-full">
          <div className="home-hero__content animate-fade-in-up">
            <p className="home-hero__eyebrow">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'subtitle', language, heroSubtitle)}
            </p>
            <h1 className="home-hero__title">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'title', language, heroTitle)}
            </h1>
            <p className="home-hero__description">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'description', language, heroDescription)}
            </p>

            <div className="home-hero__actions">
              <Button asChild size="lg" className="home-hero__btn-primary">
                <Link to={getLocalizedLink('/products', language)}>
                  {t('heroPrimaryCta')}
                  <ArrowRight className={cn('ms-2 h-5 w-5', isRTL && 'rotate-180')} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="home-hero__btn-secondary">
                <Link to={getLocalizedLink('/about', language)}>{t('heroSecondaryCta')}</Link>
              </Button>
            </div>

            <div className="home-hero__info-grid">
              <div className="home-hero__info-card">
                <div className="home-hero__info-icon">
                  <MaterialIcon name="schedule" size={22} />
                </div>
                <div className="text-start">
                  <p className="home-hero__info-title">{t('heroInfoFoundedTitle')}</p>
                  <p className="home-hero__info-desc">{t('heroInfoFoundedDesc')}</p>
                </div>
              </div>
              <div className="home-hero__info-card">
                <div className="home-hero__info-icon">
                  <MaterialIcon name="factory" size={22} />
                </div>
                <div className="text-start">
                  <p className="home-hero__info-title">{t('heroInfoFacilitiesTitle')}</p>
                  <p className="home-hero__info-desc">{t('heroInfoFacilitiesDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </PublicShell>
      </section>

      {/* Silicomanganese showcase */}
      <ImageSlideshow
        images={silicomanganeseImages}
        title={gallerySectionTitle}
        description={gallerySectionDescription}
        ctaHref={getLocalizedLink('/contact', language)}
      />

      {/* Features / uses */}
      <section className="home-features">
        <PublicShell>
          <div className="section-heading keep-center mb-12">
            <p className="section-heading__eyebrow">{t('usesTitle')}</p>
            <h2 className="section-heading__title">{t('usesSubtitle')}</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {uses.map((item, index) => (
              <article
                key={item.iconName}
                className="home-feature-card animate-fade-in-up"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="home-feature-card__icon">
                  <MaterialIcon name={item.iconName} size={24} className="text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-start">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-start">{item.description}</p>
              </article>
            ))}
          </div>
        </PublicShell>
      </section>

      {/* Stats */}
      <section className="home-stats">
        <PublicShell>
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </PublicShell>
      </section>

      {/* Products */}
      <section className="home-products">
        <PublicShell className="space-y-16">
          <div className="section-heading keep-center">
            <h2 className="section-heading__title">{productsSectionTitle}</h2>
            <p className="section-heading__description">{productsSectionSubtitle}</p>
          </div>

          <div>
            <div className="home-products__category-header">
              <h3 className="text-2xl font-bold">{industrialProducts}</h3>
              <p className="mt-2 text-muted-foreground">{industrialProductsDescription}</p>
            </div>
            {renderProductGrid(industrialProductsList)}
            {industrialProductsList.length > 0 && (
              <Button asChild variant="ghost" className="home-products__view-all">
                <Link to={getLocalizedLink('/products', language)}>
                  {t('viewAllProducts')} — {industrialProducts}
                  <ArrowRight className={cn('ms-2 h-4 w-4', isRTL && 'rotate-180')} />
                </Link>
              </Button>
            )}
          </div>

          <div>
            <div className="home-products__category-header">
              <h3 className="text-2xl font-bold">{miningProducts}</h3>
              <p className="mt-2 text-muted-foreground">{miningProductsDescription}</p>
            </div>
            {renderProductGrid(miningProductsList)}
            {miningProductsList.length > 0 && (
              <Button asChild variant="ghost" className="home-products__view-all">
                <Link to={getLocalizedLink('/products', language)}>
                  {t('viewAllProducts')} — {miningProducts}
                  <ArrowRight className={cn('ms-2 h-4 w-4', isRTL && 'rotate-180')} />
                </Link>
              </Button>
            )}
          </div>
        </PublicShell>
      </section>

      {/* Partners */}
      <section className="home-partners">
        <PublicShell>
          <div className="section-heading keep-center mb-12">
            <p className="section-heading__eyebrow">
              {usePageContent('home', 'clientsSectionLabel', t('clientsSectionLabel'))}
            </p>
            <h2 className="section-heading__title">
              {usePageContent('home', 'clientsSectionTitle', t('clientsSectionTitle'))}
            </h2>
          </div>

          {clientLogos.length > 0 ? (
            <div className="relative overflow-hidden">
              <div className="flex gap-6 animate-scroll" style={{ width: 'max-content' }}>
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div key={`logo-${index}`} className="home-partner-card">
                    <img
                      src={logo}
                      alt={`${t('clients')} ${index + 1}`}
                      className="max-h-full max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">{t('noClientLogosAvailable')}</div>
          )}
        </PublicShell>
      </section>

      {/* Contact */}
      <section className="home-contact">
        <PublicShell className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-start">
              <p className="home-contact__info-title">{t('contactSectionTitle')}</p>
              <h2 className="home-contact__info-heading">{t('contactSectionSubtitle')}</h2>
            </div>
            <div className="space-y-3">
              {contactChannels.map((channel, index) => (
                <div key={index} className="home-contact__channel">
                  <MaterialIcon name={channel.iconName} size={24} className="shrink-0 text-primary" />
                  <div className="text-start">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-base font-medium">{channel.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-contact__form animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="firstName"
                  placeholder={t('contactFormFirstName')}
                  value={contactFormData.firstName}
                  onChange={handleContactChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder={t('contactFormLastName')}
                  value={contactFormData.lastName}
                  onChange={handleContactChange}
                />
              </div>
              <Input
                name="email"
                type="email"
                placeholder={t('contactFormEmail')}
                value={contactFormData.email}
                onChange={handleContactChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder={t('contactFormPhone')}
                value={contactFormData.phone}
                onChange={handleContactChange}
              />
              <Textarea
                name="message"
                placeholder={t('contactFormMessage')}
                className="min-h-32"
                value={contactFormData.message}
                onChange={handleContactChange}
                required
              />
              <Button type="submit" className="h-12 w-full rounded-full" disabled={createContact.isPending}>
                {t('contactFormSubmit')}
              </Button>
            </form>
          </div>
        </PublicShell>
      </section>
    </div>
  );
};

export default Home;

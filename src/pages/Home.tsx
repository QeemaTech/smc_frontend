import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Factory,
  Flame,
  Leaf,
  Sun,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MaterialIcon } from '@/components/MaterialIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { pickLocalized, pickLocalizedBannerField } from '@/lib/localize';
import { cn, resolveImageSrc } from '@/lib/utils';
import { useProducts, useProductCategories, useClients, useCreateContact } from '@/hooks/useApi';
import { useBanners } from '@/hooks/useApi';
import { useNews } from '@/hooks/useApi';
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
  {
    src: heroSlideOne,
    alt: 'Manganese smelting hall with liquid metal pouring',
  },
  {
    src: heroSlideTwo,
    alt: 'Industrial ladle moving molten manganese alloy',
  },
  {
    src: heroSlideThree,
    alt: 'Conveyor line handling crushed manganese ore',
  },
];

const Home = () => {
  const { t, isRTL, language } = useLanguage();
  const settings = useSettings();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const createContact = useCreateContact();
  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      setContactFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error: unknown) {
      console.error('Home contact form submission failed:', error);
      const apiMessage =
        (error instanceof Error ? error.message : String(error)).replace(
          /^API Error:\s*/i,
          '',
        ) || '';
      toast.error(
        isRTL
          ? `فشل في إرسال الرسالة${apiMessage ? `: ${apiMessage}` : ''}`
          : `Failed to send message${apiMessage ? `: ${apiMessage}` : ''}`,
      );
    }
  };

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  // Fetch data from API
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const { data: news = [], isLoading: newsLoading } = useNews();
  const { data: clients = [] } = useClients();
  const [settingsClientLogos, setSettingsClientLogos] = useState<string[]>([]);

  useEffect(() => {
    // Check if we're in browser environment
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
      } catch (error) {
        console.error('Error loading client logos:', error);
      }
    };

    loadClientLogos();
    // Listen for storage changes
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

    if (apiLogos.length > 0) {
      return apiLogos;
    }

    return settingsClientLogos
      .map((logo) => resolveImageSrc(logo))
      .filter(Boolean);
  })();

  // Silicomanganese gallery images (CMS-managed, with static fallback)
  const [selectedSilicomanganeseIndex, setSelectedSilicomanganeseIndex] = useState<number>(0);
  const gallerySectionTitle = usePageContent('home', 'gallerySectionTitle', t('productSilicomanganese'));
  const gallerySectionDescription = usePageContent('home', 'gallerySectionDescription', t('productSilicomanganeseDesc'));
  const cmsGalleryImages = usePageContentJson<string[]>('home', 'galleryImages', []);
  const silicomanganeseImages = useMemo(() => {
    if (Array.isArray(cmsGalleryImages) && cmsGalleryImages.length > 0) {
      const resolved = cmsGalleryImages
        .map((img) => resolveImageSrc(img))
        .filter(Boolean);
      if (resolved.length > 0) {
        return resolved;
      }
    }
    return defaultGalleryImages;
  }, [cmsGalleryImages]);

  useEffect(() => {
    if (selectedSilicomanganeseIndex >= silicomanganeseImages.length) {
      setSelectedSilicomanganeseIndex(0);
    }
  }, [selectedSilicomanganeseIndex, silicomanganeseImages.length]);

  // Carousel API for tracking current slide
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Find main categories
  const industrialCategory = categories.find(cat =>
    (cat.slug === 'industrial' || cat.name.toLowerCase().includes('industrial')) && !cat.parent_id
  );
  const miningCategory = categories.find(cat =>
    (cat.slug === 'mining' || cat.name.toLowerCase().includes('mining')) && !cat.parent_id
  );

  // Filter and sort products - get last 3 products from industrial category
  const industrialProductsList = products
    .filter(p => {
      if (p.status !== 'active') return false;
      // Check if product belongs to industrial main category
      const productCategoryId = p.category_id ?? p.categoryId;
      return productCategoryId === industrialCategory?.id ||
        (p.category === 'Industrial' && !productCategoryId);
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 3);

  // Filter and sort products - get last 3 products from mining category
  const miningProductsList = products
    .filter(p => {
      if (p.status !== 'active') return false;
      // Check if product belongs to mining main category
      const productCategoryId = p.category_id ?? p.categoryId;
      return productCategoryId === miningCategory?.id ||
        (p.category === 'Mining' && !productCategoryId);
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 3);

  // Get editable content
  const heroTitle = usePageContent('home', 'heroTitle', t('heroTitle'));
  const heroSubtitle = usePageContent('home', 'heroSubtitle', t('heroSubtitle'));
  const heroDescription = usePageContent('home', 'heroDescription', t('heroDescription'));
  const productsSectionLabel = usePageContent('home', 'productsSectionLabel', t('productsSectionLabel'));
  const productsSectionTitle = usePageContent('home', 'productsSectionTitle', t('productsSectionTitle'));
  const productsSectionSubtitle = usePageContent('home', 'productsSectionSubtitle', t('productsSectionSubtitle'));
  const industrialProducts = usePageContent('home', 'industrialProducts', t('industrialProducts'));
  const industrialProductsDescription = usePageContent('home', 'industrialProductsDescription', t('industrialProductsDescription'));
  const miningProducts = usePageContent('home', 'miningProducts', t('miningProducts'));
  const miningProductsDescription = usePageContent('home', 'miningProductsDescription', t('miningProductsDescription'));

  // Use banners from API if available, otherwise use default slides
  const activeBanners = banners.length > 0
    ? banners.filter(b => b.active).sort((a, b) => a.order - b.order)
    : heroSlides.map((slide, idx) => ({
      image: slide.src,
      title: '',
      subtitle: '',
      description: '',
      id: idx
    }));

  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length]);

  const useCountUp = (end: number, duration: number = 2000) => {
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
            return () => clearInterval(timer);
          }
        },
        { threshold: 0.4 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return { count, countRef };
  };

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

  const energySolutions = [
    {
      icon: BatteryCharging,
      title: t('energyChargeTitle'),
      description: t('energyChargeDescription'),
      image: mnHome,
    },
    {
      icon: Flame,
      title: t('energyHeatingTitle'),
      description: t('energyHeatingDescription'),
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      icon: Sun,
      title: t('energyRoofTitle'),
      description: t('energyRoofDescription'),
      image: mnPortfolio16,
    },
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

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          {activeBanners.map((banner, index) => (
            <img
              key={banner.id || index}
              src={resolveImageSrc(banner.image, {
                cacheKey: banner.updatedAt,
                fallback: heroSlides[index]?.src,
              })}
              alt={banner.title || heroSlides[index]?.alt || t('heroBanners')}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all ease-out scale-105',
                index === activeSlide ? 'opacity-90 scale-100' : 'opacity-0'
              )}
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
          {/* Additional gradient overlay for text area */}
          <div
            className={cn(
              'absolute inset-0',
              isRTL
                ? 'bg-gradient-to-l from-black/80 via-black/60 to-transparent'
                : 'bg-gradient-to-r from-black/80 via-black/60 to-transparent'
            )}
          />
        </div>
        <div className="relative container mx-auto flex flex-col gap-10 px-4 py-32 lg:flex-row lg:items-center z-10">
          <div className="max-w-2xl space-y-6 py-10 text-start">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-lg">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'subtitle', language, heroSubtitle)}
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl text-white drop-shadow-lg">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'title', language, heroTitle)}
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md">
              {pickLocalizedBannerField(activeBanners[activeSlide], 'description', language, heroDescription)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-[#204393] px-6 text-white shadow-[var(--md-elevation-2)] hover:bg-[#1b356f]">
                <Link to={getLocalizedLink('/contact', language)}>
                  {t('heroPrimaryCta')}
                  <ArrowRight className={cn('ms-2 h-5 w-5', isRTL && 'rotate-180')} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[#204393] text-[#204393] hover:bg-[#204393]/10"
              >
                <Link to={getLocalizedLink('/about', language)}>{t('heroSecondaryCta')}</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[24px] border border-primary/20 bg-white/95 shadow-[var(--md-elevation-2)] backdrop-blur-sm">
                <CardContent className="space-y-3 p-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <MaterialIcon name="workspace_premium" size={20} className="text-primary" />
                    {t('awardTitle')}
                  </span>
                  <p className="text-sm text-foreground font-medium">{t('awardDescription')}</p>
                </CardContent>
              </Card>
              <Card className="rounded-[24px] border border-border bg-white/95 shadow-[var(--md-elevation-2)] backdrop-blur-sm">
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('contactHeadOfficeLabel')}</p>
                  <p className="text-base text-foreground font-medium">{t('contactHeadOfficeValue')}</p>
                  <p className="text-base text-foreground font-medium">{t('contactCairoOfficeValue')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Silicomanganese Alloy Gallery - First section after Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">{gallerySectionTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {gallerySectionDescription}
            </p>
          </div>

          {/* Large Main Image */}
          <div className="mb-6">
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl border border-border shadow-2xl bg-muted/30">
              {silicomanganeseImages[selectedSilicomanganeseIndex] && (
                <img
                  src={silicomanganeseImages[selectedSilicomanganeseIndex]}
                  alt={`${gallerySectionTitle} ${selectedSilicomanganeseIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="overflow-x-auto">
            <div className="flex gap-3 justify-center pb-2">
              {silicomanganeseImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSilicomanganeseIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 overflow-hidden rounded-lg border-2 transition-all",
                    selectedSilicomanganeseIndex === index
                      ? "border-primary shadow-lg scale-105 ring-2 ring-primary/50"
                      : "border-border hover:border-primary/50 hover:shadow-md opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`${gallerySectionTitle} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedSilicomanganeseIndex === index && (
                    <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uses Section - Separate Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">{t('usesTitle')}</p>
            <h2 className="text-4xl font-bold mb-4">{t('usesSubtitle')}</h2>
            <p className="text-lg text-muted-foreground">{t('usesSectionDescription')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {uses.map((item, index) => (
              <Card key={index} className="rounded-[24px] border border-border/60 bg-white shadow-[var(--md-elevation-2)] transition-all hover:-translate-y-1 hover:shadow-[var(--md-elevation-3)]">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 rounded-2xl bg-primary/10 p-4">
                      <MaterialIcon name={item.iconName} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1 text-start">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, index) => {
              const { count, countRef } = useCountUp(stat.value);
              return (
                <Card key={index} className="border border-border bg-white text-center shadow-md">
                  <CardContent className="space-y-3 p-6">
                    <div ref={countRef} className="text-4xl font-bold text-primary">
                      {count}
                      {stat.suffix}
                    </div>
                    <p className="text-base font-semibold">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Removed: Energy Solutions */}
      {/*<section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl text-start">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{t('energyTitle')}</p>
            <h2 className="mt-4 text-4xl font-bold">{t('energySubtitle')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {energySolutions.map((solution, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-border/70 bg-black shadow-xl transition hover:-translate-y-1"
              >
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/30 bg-white/10 p-3">
                      <solution.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                      {t('energyTitle')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{solution.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{solution.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Removed: Extended About, Family, Cases, Product & Sustainability sections */}

      {/* Products Section */}
      <section className="bg-gradient-to-b from-background to-accent py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">{productsSectionLabel}</p>
            <h2 className="text-4xl font-bold mb-4">{productsSectionTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{productsSectionSubtitle}</p>
          </div>

          {/* Industrial Products */}
          <div className="mb-16">
            <div className="mb-8 text-start">
              <h3 className="text-2xl font-semibold mb-2">{industrialProducts}</h3>
              <p className="text-muted-foreground">{industrialProductsDescription}</p>
            </div>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {industrialProductsList.map((product) => {
                  const iconMap: Record<string, string> = {
                    'Silicomanganese': 'all_inbox',
                    'Calcined Gypsum': 'science',
                    'Kaolin': 'terrain',
                    'Silica Sand': 'deployed_code',
                    'Raw Gypsum': 'science',
                    'Iron Oxide': 'auto_mode',
                    'Fine Manganese': 'all_inbox',
                  };
                  const productIconName = iconMap[product.name] || 'inventory_2';
                  const defaultImages = [heroSlideOne, heroSlideTwo, heroSlideThree, mnHome, mnPortfolio14, mnPortfolio16];
                  const imageSrc = resolveImageSrc(product.image, {
                    cacheKey: product.updated_at || product.updatedAt,
                    fallback: defaultImages[product.id % defaultImages.length],
                  });

                  return (
                    <Link key={product.id} to={getLocalizedLink(`/product/${product.id}`, language)} className="block h-full">
                      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border border-border shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
                        <div className="relative h-64 shrink-0 overflow-hidden bg-muted">
                          <img
                            src={imageSrc}
                            alt={pickLocalized(product, 'name', language)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            key={`${product.id}-${product.updated_at || Date.now()}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                          <div className="absolute top-4 right-4 rounded-full bg-primary/90 p-3 backdrop-blur">
                            <MaterialIcon name={productIconName} size={24} className="text-white" />
                          </div>
                        </div>
                        <CardContent className="flex flex-1 flex-col p-6">
                          <h4 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-semibold">
                            {pickLocalized(product, 'name', language)}
                          </h4>
                          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {pickLocalized(product, 'description', language)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
            {industrialProductsList.length > 0 && (
              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link to={getLocalizedLink('/products', language)}>
                    {t('viewAllProducts')} - {industrialProducts}
                    <ArrowRight className={cn('ms-2 h-4 w-4', isRTL && 'rotate-180')} />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mining Products */}
          <div>
            <div className="mb-8 text-start">
              <h3 className="text-2xl font-semibold mb-2">{miningProducts}</h3>
              <p className="text-muted-foreground">{miningProductsDescription}</p>
            </div>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {miningProductsList.map((product) => {
                  const iconMap: Record<string, string> = {
                    'Silicomanganese': 'all_inbox',
                    'Calcined Gypsum': 'science',
                    'Kaolin': 'terrain',
                    'Silica Sand': 'deployed_code',
                    'Raw Gypsum': 'science',
                    'Iron Oxide': 'auto_mode',
                    'Fine Manganese': 'all_inbox',
                  };
                  const productIconName = iconMap[product.name] || 'inventory_2';
                  const defaultImages = [heroSlideOne, heroSlideTwo, heroSlideThree, mnHome, mnPortfolio14, mnPortfolio16];
                  const imageSrc = resolveImageSrc(product.image, {
                    cacheKey: product.updated_at || product.updatedAt,
                    fallback: defaultImages[product.id % defaultImages.length],
                  });

                  return (
                    <Link key={product.id} to={getLocalizedLink(`/product/${product.id}`, language)} className="block h-full">
                      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border border-border shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
                        <div className="relative h-56 shrink-0 overflow-hidden bg-muted">
                          <img
                            src={imageSrc}
                            alt={pickLocalized(product, 'name', language)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            key={`${product.id}-${product.updated_at || Date.now()}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                          <div className="absolute top-4 right-4 rounded-full bg-primary/90 p-3 backdrop-blur">
                            <MaterialIcon name={productIconName} size={24} className="text-white" />
                          </div>
                        </div>
                        <CardContent className="flex flex-1 flex-col p-5">
                          <h4 className="mb-2 line-clamp-2 min-h-[3rem] text-lg font-semibold">
                            {pickLocalized(product, 'name', language)}
                          </h4>
                          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {pickLocalized(product, 'description', language)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
            {miningProductsList.length > 0 && (
              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link to={getLocalizedLink('/products', language)}>
                    {t('viewAllProducts')} - {miningProducts}
                    <ArrowRight className={cn('ms-2 h-4 w-4', isRTL && 'rotate-180')} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
              {usePageContent('home', 'clientsSectionLabel', t('clientsSectionLabel'))}
            </p>
            <h2 className="text-4xl font-bold mb-4">
              {usePageContent('home', 'clientsSectionTitle', t('clientsSectionTitle'))}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {usePageContent('home', 'clientsSectionDescription', t('clientsSectionDescription'))}
            </p>
          </div>

          {/* Clients Carousel */}
          {clientLogos.length > 0 ? (
            <div className="relative overflow-hidden">
              <div className="flex gap-8 animate-scroll" style={{ width: 'max-content' }}>
                {/* Duplicate items for seamless loop */}
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div
                    key={`logo-${index}`}
                    className="flex-shrink-0 w-48 h-32 bg-white rounded-2xl border border-border/70 shadow-lg p-6 flex items-center justify-center hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={logo}
                      alt={`${t('clients')} ${index + 1}`}
                      className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('noClientLogosAvailable')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Removed: Modules CTA section */}

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_400px]">
          <Card className="border border-border">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">{t('contactSectionTitle')}</p>
                <h3 className="text-3xl font-semibold">{t('contactSectionSubtitle')}</h3>
              </div>
              <div className="space-y-4">
                {contactChannels.map((channel, index) => (
                  <div key={index} className="flex gap-4 rounded-2xl border border-border/70 p-4">
                    <MaterialIcon name={channel.iconName} size={24} className="text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{channel.label}</p>
                      <p className="text-base font-semibold">{channel.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-lg">
            <CardContent className="space-y-4 p-8">
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
                  className="h-32"
                  value={contactFormData.message}
                  onChange={handleContactChange}
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createContact.isPending}
                >
                  {t('contactFormSubmit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;

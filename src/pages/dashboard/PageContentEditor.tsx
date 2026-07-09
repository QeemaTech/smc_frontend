import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Globe, Plus, X, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveImageSrc } from '@/lib/utils';
import {
  SECTIONS_KEY,
  createEmptySection,
  normalizeSectionsForSave,
  parsePageSections,
  serializePageSections,
  type PageSection,
} from '@/lib/pageSections';
import { toast } from 'sonner';
import ContactDataEditor from '@/components/dashboard/ContactDataEditor';

interface PageContent {
  [key: string]: {
    en: { [key: string]: string };
    ar: { [key: string]: string };
  };
}

interface PageContentEditorProps {
  /** Optional: lock editor to a single page (kept for compatibility). */
  fixedPage?: string;
}

const PageContentEditor = ({ fixedPage }: PageContentEditorProps) => {
  const { t, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialPage = fixedPage || searchParams.get('page') || 'home';
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [content, setContent] = useState<PageContent>({
    home: {
      en: {
        heroTitle: 'Sinai Manganese Co.',
        heroSubtitle: 'First and Largest Producer of Manganese Ore in Egypt',
        heroDescription: 'Sinai Manganese Co. SMC was founded on May 18th, 1957, to exploit the manganese deposits in Sinai Peninsula, Egypt.',
        productsSectionLabel: 'Our Products',
        productsSectionTitle: 'Industrial & Mining Products',
        productsSectionSubtitle: 'High-quality products for various industries',
        industrialProducts: 'Industrial Products',
        industrialProductsDescription: 'Products for industrial applications',
        miningProducts: 'Mining Products',
        miningProductsDescription: 'Raw materials and minerals',
        clientsSectionLabel: 'Our Clients',
        clientsSectionTitle: 'Our Success Partners',
        clientsSectionDescription: 'We are proud of our partnerships with industry-leading companies',
        gallerySectionTitle: 'Silicomanganese',
        gallerySectionDescription: 'High-quality ferroalloy used in steel production as a deoxidizer and alloying agent. Produced in our 36,000 MTPA electric furnace.',
        galleryImages: '[]',
      },
      ar: {
        heroTitle: 'شركة سيناء للمنجنيز',
        heroSubtitle: 'أول وأكبر منتج لخام المنجنيز في مصر',
        heroDescription: 'تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر.',
        productsSectionLabel: 'منتجاتنا',
        productsSectionTitle: 'المنتجات الصناعية والتعدينية',
        productsSectionSubtitle: 'منتجات عالية الجودة لمختلف الصناعات',
        industrialProducts: 'المنتجات الصناعية',
        industrialProductsDescription: 'منتجات للتطبيقات الصناعية',
        miningProducts: 'منتجات التعدين',
        miningProductsDescription: 'المواد الخام والمعادن',
        clientsSectionLabel: 'عملاؤنا',
        clientsSectionTitle: 'شركاؤنا في النجاح',
        clientsSectionDescription: 'نفتخر بشراكاتنا مع الشركات الرائدة في الصناعة',
        gallerySectionTitle: 'سيليكون منجنيز',
        gallerySectionDescription: 'سبيكة حديدية عالية الجودة تستخدم في إنتاج الصلب كعامل إزالة الأكسدة وعامل صناعة السبائك. يتم إنتاجها في فرننا الكهربائي بطاقة 36,000 طن سنوياً.',
        galleryImages: '[]',
      },
    },
    about: {
      en: {
        heroTitle: 'About Us',
        heroDescription: 'SMC produces both high and low grades of manganese ore and operates an electrical furnace at Abu-Zinima, Sinai. We are the only Middle Eastern producer of Silicomanganese with our own 21 MW gas turbine power station.',
        title: 'About Us',
        description: 'SMC produces both high and low grades of manganese ore and operates an electrical furnace at Abu-Zinima, Sinai.',
        mission: 'Our Mission',
        missionText: 'To be the leading producer of manganese products in Egypt and the region.',
        vision: 'Our Vision',
        visionText: 'To expand our operations and serve more industries globally.',
        values: 'Our Values',
        valuesText: 'Quality, Innovation, Sustainability, and Excellence.',
      },
      ar: {
        heroTitle: 'من نحن',
        heroDescription: 'تنتج شركة سيناء للمنجنيز درجات عالية ومنخفضة من خام المنجنيز وتدير فرناً كهربائياً في أبو زنيمة، سيناء. نحن المنتج الوحيد لسيليكون المنجنيز في الشرق الأوسط مع محطة طاقة غازية خاصة بقدرة 21 ميجاوات.',
        title: 'من نحن',
        description: 'تنتج شركة سيناء للمنجنيز درجات عالية ومنخفضة من خام المنجنيز وتدير فرناً كهربائياً في أبو زنيمة، سيناء.',
        mission: 'مهمتنا',
        missionText: 'أن نكون المنتج الرائد لمنتجات المنجنيز في مصر والمنطقة.',
        vision: 'رؤيتنا',
        visionText: 'توسيع عملياتنا وخدمة المزيد من الصناعات عالمياً.',
        values: 'قيمنا',
        valuesText: 'الجودة، الابتكار، الاستدامة، والتميز.',
      },
    },
    contact: {
      en: {
        heroBadge: 'Get in touch',
        heroTitle: 'Contact Us',
        heroDescription: 'Share your industrial ambitions and our partnerships team will respond within one business day to plan a tailored working session.',
        title: 'Contact Us',
        subtitle: 'Get in touch with us',
        formTitle: 'Send us a message',
        formSubtitle: 'We will get back to you as soon as possible',
        nameLabel: 'Name',
        emailLabel: 'Email',
        messageLabel: 'Message',
        submitButton: 'Send Message',
      },
      ar: {
        heroBadge: 'تواصل معنا',
        heroTitle: 'اتصل بنا',
        heroDescription: 'شاركنا أهدافك الصناعية وسيتواصل معك فريق الشراكات خلال يوم عمل واحد لترتيب جلسة عمل مخصصة.',
        title: 'اتصل بنا',
        subtitle: 'تواصل معنا',
        formTitle: 'أرسل لنا رسالة',
        formSubtitle: 'سنتواصل معك في أقرب وقت ممكن',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        messageLabel: 'الرسالة',
        submitButton: 'إرسال الرسالة',
      },
    },
    footer: {
      en: {
        description: 'Sinai Manganese Co. is Egypt\'s first and largest manganese ore producer.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        contactTitle: 'Contact Information',
        salesNumbersTitle: 'Sales Numbers',
        administrationNumbersTitle: 'Administration Numbers',
        followUs: 'Follow Us',
        copyright: '© 2024 Sinai Manganese Co. All rights reserved.',
      },
      ar: {
        description: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        contactTitle: 'معلومات الاتصال',
        salesNumbersTitle: 'أرقام المبيعات',
        administrationNumbersTitle: 'أرقام الإدارة',
        followUs: 'تابعنا',
        copyright: '© 2024 شركة سيناء للمنجنيز. جميع الحقوق محفوظة.',
      },
    },
    news: {
      en: {
        heroTitle: 'News',
        heroDescription: 'Stay updated with the latest news and developments from Sinai Manganese Company',
      },
      ar: {
        heroTitle: 'الأخبار',
        heroDescription: 'ابق على اطلاع بآخر الأخبار والتطورات من شركة سيناء للمنجنيز',
      },
    },
    products: {
      en: {
        heroBadge: 'Products',
        heroTitle: 'Our Products',
        heroDescription: 'Explore our products through a single tabbed view with a quick category filter.',
      },
      ar: {
        heroBadge: 'المنتجات',
        heroTitle: 'منتجاتنا',
        heroDescription: 'استكشف منتجاتنا من خلال تبويب واحد مع فلتر فئات سريع.',
      },
    },
    tenders: {
      en: {
        heroTitle: 'ADS & Tender',
        heroDescription: 'Current tenders and procurement opportunities',
      },
      ar: {
        heroTitle: 'الإعلانات والمناقصات',
        heroDescription: 'المناقصات الحالية وفرص المشتريات',
      },
    },
    privatePort: {
      en: {
        heroTitle: 'Private Port',
        heroDescription: 'Our private port facility ensures efficient and reliable export of our products to customers worldwide',
        feature1Title: 'Modern Facilities',
        feature1Desc: 'State-of-the-art port facilities equipped for efficient loading and shipping operations',
        feature2Title: 'High Capacity',
        feature2Desc: 'Capable of handling large volumes of manganese ore and silicomanganese shipments',
        feature3Title: 'Strategic Location',
        feature3Desc: 'Located at Abu-Zinima for optimal access to international shipping routes',
        feature4Title: 'Safety Standards',
        feature4Desc: 'Strict adherence to international safety and environmental regulations',
        capabilitiesTitle: 'Port Capabilities',
        loadingSectionTitle: 'Loading & Shipping',
        loadingItem1: 'Direct loading to vessels with minimal handling',
        loadingItem2: 'Multiple loading points for efficient operations',
        loadingItem3: '24/7 operational capability',
        loadingItem4: 'Advanced weighing and quality control systems',
        storageSectionTitle: 'Storage & Handling',
        storageItem1: 'Covered storage facilities to protect products',
        storageItem2: 'Segregated storage areas for different grades',
        storageItem3: 'Modern material handling equipment',
        storageItem4: 'Dust suppression systems',
      },
      ar: {
        heroTitle: 'الميناء الخاص',
        heroDescription: 'تضمن منشأة الميناء الخاص لدينا تصديراً فعالاً وموثوقاً لمنتجاتنا للعملاء في جميع أنحاء العالم',
        feature1Title: 'مرافق حديثة',
        feature1Desc: 'مرافق ميناء حديثة مجهزة لعمليات التحميل والشحن الفعالة',
        feature2Title: 'قدرة عالية',
        feature2Desc: 'قادرة على التعامل مع أحجام كبيرة من شحنات خام المنجنيز وسيليكون المنجنيز',
        feature3Title: 'موقع استراتيجي',
        feature3Desc: 'يقع في أبو زنيمة للوصول الأمثل إلى طرق الشحن الدولية',
        feature4Title: 'معايير السلامة',
        feature4Desc: 'الالتزام الصارم بمعايير السلامة والبيئة الدولية',
        capabilitiesTitle: 'قدرات الميناء',
        loadingSectionTitle: 'التحميل والشحن',
        loadingItem1: 'تحميل مباشر على السفن مع أقل قدر من المناولة',
        loadingItem2: 'نقاط تحميل متعددة للعمليات الفعالة',
        loadingItem3: 'قدرة تشغيلية على مدار الساعة',
        loadingItem4: 'أنظمة وزن ومراقبة جودة متقدمة',
        storageSectionTitle: 'التخزين والمعالجة',
        storageItem1: 'منشآت تخزين مغطاة لحماية المنتجات',
        storageItem2: 'مناطق تخزين منفصلة للدرجات المختلفة',
        storageItem3: 'معدات معالجة مواد حديثة',
        storageItem4: 'أنظمة قمع الغبار',
      },
    },
    members: {
      en: {
        heroTitle: 'Board Members',
        heroDescription: 'We are proud of our distinguished leadership of experts and professionals who lead Sinai Manganese Company towards excellence and success',
      },
      ar: {
        heroTitle: 'أعضاء مجلس الإدارة',
        heroDescription: 'نفتخر بقيادة متميزة من الخبراء والمحترفين الذين يقودون شركة سيناء للمنجنيز نحو التميز والنجاح',
      },
    },
    financial: {
      en: {
        heroTitle: 'Financial',
        heroDescription: 'Maintaining strong financial performance through operational excellence and strategic growth',
      },
      ar: {
        heroTitle: 'المالية',
        heroDescription: 'الحفاظ على أداء مالي قوي من خلال التميز التشغيلي والنمو الاستراتيجي',
      },
    },
    complaints: {
      en: {
        heroBadge: 'Complaints desk',
        heroTitle: 'Customer Complaints Center',
        heroDescription: 'Listening is part of our manufacturing excellence. Share your concern and a service specialist will reach out within one business day.',
      },
      ar: {
        heroBadge: 'مركز الشكاوى',
        heroTitle: 'منصة شكاوى العملاء',
        heroDescription: 'نؤمن بأن الاستماع إلى عملائنا جزء من نجاحنا التشغيلي. شاركنا أي ملاحظة أو مشكلة وسيتواصل معك فريق خدمة العملاء خلال يوم عمل واحد.',
      },
    },
  });

  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const GALLERY_IMAGES_KEY = 'galleryImages';
  const HIDDEN_KEYS = new Set([GALLERY_IMAGES_KEY, SECTIONS_KEY]);
  const PAGES_WITHOUT_SECTIONS = new Set(['footer']);

  const parseGalleryImages = (raw?: string): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((img) => typeof img === 'string' && img.trim()) : [];
    } catch {
      return [];
    }
  };

  const getGalleryImages = (): string[] =>
    parseGalleryImages(content.home?.en?.[GALLERY_IMAGES_KEY]);

  const setGalleryImages = (images: string[]) => {
    const serialized = JSON.stringify(images);
    setContent({
      ...content,
      home: {
        ...content.home,
        en: {
          ...content.home.en,
          [GALLERY_IMAGES_KEY]: serialized,
        },
        ar: {
          ...content.home.ar,
          [GALLERY_IMAGES_KEY]: serialized,
        },
      },
    });
  };

  const uploadGalleryImage = async (file: File): Promise<string | null> => {
    const { mediaAPI } = await import('@/services/api');
    const uploaded = await mediaAPI.upload(file, 'home');
    return uploaded?.url || null;
  };

  const uploadBase64GalleryImage = async (dataUrl: string): Promise<string | null> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const extension = blob.type.split('/')[1] || 'jpg';
    const file = new File([blob], `gallery-${Date.now()}.${extension}`, { type: blob.type || 'image/jpeg' });
    return uploadGalleryImage(file);
  };

  const normalizeGalleryImagesForSave = async (images: string[]): Promise<string[]> => {
    const normalized: string[] = [];

    for (const image of images) {
      if (!image?.trim()) continue;

      if (image.startsWith('data:')) {
        const uploadedUrl = await uploadBase64GalleryImage(image);
        if (uploadedUrl) {
          normalized.push(uploadedUrl);
        }
        continue;
      }

      normalized.push(image);
    }

    return normalized;
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      toast.error(isRTL ? 'الملفات المحددة ليست صوراً' : 'Selected files are not images');
      return;
    }

    const uploadedUrls: string[] = [];

    try {
      for (const file of validFiles) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(isRTL ? 'حجم الصورة يجب أن يكون أقل من 10MB' : 'Image size must be less than 10MB');
          continue;
        }

        const url = await uploadGalleryImage(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        setGalleryImages([...getGalleryImages(), ...uploadedUrls]);
        toast.success(
          isRTL
            ? `تمت إضافة ${uploadedUrls.length} صورة للمعرض`
            : `${uploadedUrls.length} image(s) added to gallery`,
        );
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast.error(isRTL ? 'فشل في رفع الصورة' : 'Failed to upload image');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(getGalleryImages().filter((_, i) => i !== index));
    toast.success(isRTL ? 'تم حذف الصورة' : 'Image removed');
  };

  useEffect(() => {
    if (fixedPage) {
      setSelectedPage(fixedPage);
      return;
    }

    const pageFromQuery = searchParams.get('page');
    if (pageFromQuery) {
      setSelectedPage(pageFromQuery);
    }
  }, [fixedPage, searchParams]);

  useEffect(() => {
    // Load content from backend
    const loadContent = async () => {
      try {
        const { pageContentAPI } = await import('@/services/api');
        const allContent = await pageContentAPI.getAll();
        
        // Convert array to object structure
        const contentObj: PageContent = {};
        allContent.forEach((item) => {
          if (!contentObj[item.page]) {
            contentObj[item.page] = { en: {}, ar: {} };
          }
          if (item.valueEn !== null) {
            contentObj[item.page].en[item.key] = item.valueEn;
          }
          if (item.valueAr !== null) {
            contentObj[item.page].ar[item.key] = item.valueAr;
          }
        });
        
        // Deep-merge API values over defaults (preserve keys missing from API)
        setContent((prev) => {
          const merged: PageContent = { ...prev };
          Object.entries(contentObj).forEach(([page, pageData]) => {
            merged[page] = {
              en: { ...(prev[page]?.en || {}), ...(pageData.en || {}) },
              ar: { ...(prev[page]?.ar || {}), ...(pageData.ar || {}) },
            };
          });
          return merged;
        });
        
        // Also save to localStorage for offline access
        localStorage.setItem('pageContent', JSON.stringify(contentObj));
      } catch (error) {
        console.error('Error loading page content from backend:', error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem('pageContent');
          if (saved) {
            setContent(JSON.parse(saved));
          }
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      loadContent();
    }
  }, []);

  const pages = [
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'products', label: 'Products Page' },
    { value: 'news', label: 'News Page' },
    { value: 'tenders', label: 'Tenders Page' },
    { value: 'privatePort', label: 'Private Port Page' },
    { value: 'members', label: 'Members Page' },
    { value: 'financial', label: 'Financial Page' },
    { value: 'complaints', label: 'Complaints Page' },
    { value: 'footer', label: 'Footer' },
  ];

  const handleSave = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const { pageContentAPI } = await import('@/services/api');

      let contentToSave: PageContent = { ...content };

      // Normalize sections for every page/lang before save
      Object.keys(contentToSave).forEach((page) => {
        (['en', 'ar'] as const).forEach((lang) => {
          const raw = contentToSave[page]?.[lang]?.[SECTIONS_KEY];
          if (raw === undefined) return;
          const normalized = normalizeSectionsForSave(parsePageSections(raw));
          contentToSave = {
            ...contentToSave,
            [page]: {
              ...contentToSave[page],
              [lang]: {
                ...contentToSave[page][lang],
                [SECTIONS_KEY]: serializePageSections(normalized),
              },
            },
          };
        });
      });

      const currentGalleryImages = parseGalleryImages(
        contentToSave.home?.en?.[GALLERY_IMAGES_KEY],
      );

      if (currentGalleryImages.some((image) => image.startsWith('data:'))) {
        const normalizedGalleryImages = await normalizeGalleryImagesForSave(currentGalleryImages);
        const serializedGallery = JSON.stringify(normalizedGalleryImages);
        contentToSave = {
          ...contentToSave,
          home: {
            ...contentToSave.home,
            en: {
              ...contentToSave.home.en,
              [GALLERY_IMAGES_KEY]: serializedGallery,
            },
            ar: {
              ...contentToSave.home.ar,
              [GALLERY_IMAGES_KEY]: serializedGallery,
            },
          },
        };
      }

      setContent(contentToSave);
      
      // Convert content object to array format for bulk update
      const contentArray: Array<{ page: string; key: string; valueEn: string | null; valueAr: string | null }> = [];
      
      Object.entries(contentToSave).forEach(([page, pageData]) => {
        Object.entries(pageData.en || {}).forEach(([key, value]) => {
          if (page === 'home' && key === GALLERY_IMAGES_KEY) {
            contentArray.push({
              page,
              key,
              valueEn: value || null,
              valueAr: value || null,
            });
            return;
          }
          if (key === SECTIONS_KEY) {
            contentArray.push({
              page,
              key,
              valueEn: value || '[]',
              valueAr: pageData.ar?.[key] || '[]',
            });
            return;
          }
          contentArray.push({
            page,
            key,
            valueEn: value || null,
            valueAr: pageData.ar?.[key] || null,
          });
        });
        // Also include Arabic-only keys
        Object.entries(pageData.ar || {}).forEach(([key, value]) => {
          if (page === 'home' && key === GALLERY_IMAGES_KEY) {
            return;
          }
          if (key === SECTIONS_KEY) {
            return;
          }
          if (!pageData.en?.[key]) {
            contentArray.push({
              page,
              key,
              valueEn: null,
              valueAr: value || null,
            });
          }
        });
      });
      
      await pageContentAPI.bulkUpdate(contentArray);
      
      // Also save to localStorage for offline access
      localStorage.setItem('pageContent', JSON.stringify(contentToSave));
      
      // Trigger storage event to update all components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('pageContentUpdated'));
      
      toast.success(isRTL ? 'تم حفظ المحتوى بنجاح' : 'Content saved successfully');
    } catch (error: any) {
      console.error('Error saving page content:', error);
      const message = error?.message?.replace(/^API Error:\s*/i, '') || '';
      toast.error(
        isRTL
          ? `فشل في حفظ المحتوى${message ? `: ${message}` : ''}`
          : `Failed to save content${message ? `: ${message}` : ''}`,
      );
    }
  };

  const getSections = (lang: 'en' | 'ar'): PageSection[] =>
    parsePageSections(content[selectedPage]?.[lang]?.[SECTIONS_KEY], { keepEmpty: true });

  const setSections = (lang: 'en' | 'ar', sections: PageSection[]) => {
    setContent((prev) => ({
      ...prev,
      [selectedPage]: {
        ...(prev[selectedPage] || { en: {}, ar: {} }),
        [lang]: {
          ...(prev[selectedPage]?.[lang] || {}),
          [SECTIONS_KEY]: serializePageSections(sections, { keepEmpty: true }),
        },
      },
    }));
  };

  const handleAddSection = (lang: 'en' | 'ar') => {
    setSections(lang, [...getSections(lang), createEmptySection()]);
  };

  const handleUpdateSection = (
    lang: 'en' | 'ar',
    index: number,
    field: keyof PageSection,
    value: string,
  ) => {
    const sections = [...getSections(lang)];
    sections[index] = { ...sections[index], [field]: value };
    setSections(lang, sections);
  };

  const handleDeleteSection = (lang: 'en' | 'ar', index: number) => {
    setSections(
      lang,
      getSections(lang).filter((_, i) => i !== index),
    );
  };

  const handleMoveSection = (lang: 'en' | 'ar', index: number, direction: -1 | 1) => {
    const sections = [...getSections(lang)];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setSections(lang, sections);
  };

  const handleDeleteField = (page: string, lang: string, key: string) => {
    if (key === SECTIONS_KEY || key === GALLERY_IMAGES_KEY) return;
    const newContent = { ...content };
    delete newContent[page][lang][key];
    setContent(newContent);
    toast.success(isRTL ? 'تم حذف الحقل' : 'Field deleted');
  };

  const currentContent = content[selectedPage] || { en: {}, ar: {} };
  const showSections = !PAGES_WITHOUT_SECTIONS.has(selectedPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('pageContent') || 'Page Content'}</h2>
          <p className="text-muted-foreground mt-1">{t('editPageContent') || 'Edit content for all pages'}</p>
        </div>
        <Button onClick={handleSave} >
          <Save className="h-4 w-4 mr-2" />
          {t('saveAll') || 'Save All'}
        </Button>
      </div>

      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardHeader>
          {!fixedPage ? (
            <div className="flex items-center gap-4">
              <Label>{t('selectPage') || 'Select Page'}</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-64 bg-muted/50 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {pages.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {(selectedPage === 'footer' || selectedPage === 'contact') && (
            <ContactDataEditor context={selectedPage} />
          )}

          {selectedPage === 'home' && (
            <Card className="mb-6 backdrop-blur-xl bg-muted/40 border-border">
              <CardHeader>
                <CardTitle>
                  {isRTL ? 'معرض الصور - الصفحة الرئيسية' : 'Homepage Gallery'}
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  {isRTL
                    ? 'أدر صور معرض السيليكون منجنيز المعروضة في الصفحة الرئيسية'
                    : 'Manage the silicomanganese gallery images shown on the homepage'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                  />
                  <Button type="button" onClick={() => galleryFileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isRTL ? 'إضافة صور' : 'Add Images'}
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    {isRTL
                      ? `${getGalleryImages().length} صورة مضافة`
                      : `${getGalleryImages().length} images added`}
                  </span>
                </div>

                {getGalleryImages().length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getGalleryImages().map((img, index) => (
                      <div
                        key={`${img.slice(0, 24)}-${index}`}
                        className="relative group bg-muted/50 rounded-lg p-2 border border-border"
                      >
                        <img
                          src={resolveImageSrc(img)}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">
                      {isRTL
                        ? 'لا توجد صور في المعرض. سيتم استخدام الصور الافتراضية حتى تضيف صوراً.'
                        : 'No gallery images yet. Default images are shown until you add some.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(selectedPage === 'footer' || selectedPage === 'contact') && (
            <p className="mb-4 text-sm text-muted-foreground">
              {isRTL
                ? 'القسم أدناه لتعديل عناوين النصوص فقط (اختياري). بيانات الأرقام والإيميلات في الأعلى.'
                : 'The section below is for text labels only (optional). Phone numbers and emails are edited above.'}
            </p>
          )}

          <Tabs defaultValue="en" className="space-y-4">
            <TabsList className="backdrop-blur-xl bg-card/90 border-border">
              <TabsTrigger value="en" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Globe className="h-4 w-4 mr-2" />
                English
              </TabsTrigger>
              <TabsTrigger value="ar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Globe className="h-4 w-4 mr-2" />
                العربية
              </TabsTrigger>
            </TabsList>

            {(['en', 'ar'] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(currentContent[lang] || {})
                    .filter(([key]) => !HIDDEN_KEYS.has(key))
                    .map(([key, value]) => (
                    <div key={key} className="space-y-2 p-4 backdrop-blur-xl bg-muted/40 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground font-medium">{key}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(selectedPage, lang, key)}
                          className="text-red-400 hover:bg-red-500/20 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={value}
                        onChange={(e) => {
                          setContent({
                            ...content,
                            [selectedPage]: {
                              ...content[selectedPage],
                              [lang]: {
                                ...currentContent[lang],
                                [key]: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={3}
                        className="bg-muted/50 border-border text-foreground"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  ))}

                  {showSections ? (
                    <Card className="backdrop-blur-xl bg-muted/40 border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <CardTitle className="text-lg">
                              {isRTL ? 'الأقسام' : 'Sections'}
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {isRTL
                                ? 'أضف أقسام محتوى تظهر بعد المحتوى الثابت في الصفحة'
                                : 'Add content sections shown after the static page content'}
                            </p>
                          </div>
                          <Button type="button" onClick={() => handleAddSection(lang)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {isRTL ? 'إضافة قسم' : 'Add Section'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getSections(lang).length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                            {isRTL
                              ? 'لا توجد أقسام بعد. اضغط "إضافة قسم" للبدء.'
                              : 'No sections yet. Click "Add Section" to start.'}
                          </div>
                        ) : (
                          getSections(lang).map((section, index) => (
                            <div
                              key={`${lang}-section-${index}`}
                              className="space-y-3 rounded-lg border border-border bg-background/60 p-4"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <Label className="font-medium text-foreground">
                                  {isRTL ? `قسم ${index + 1}` : `Section ${index + 1}`}
                                </Label>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleMoveSection(lang, index, -1)}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleMoveSection(lang, index, 1)}
                                    disabled={index === getSections(lang).length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/20"
                                    onClick={() => handleDeleteSection(lang, index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                  {isRTL ? 'العنوان' : 'Title'}
                                </Label>
                                <Input
                                  value={section.title}
                                  onChange={(e) =>
                                    handleUpdateSection(lang, index, 'title', e.target.value)
                                  }
                                  placeholder={isRTL ? 'عنوان القسم' : 'Section title'}
                                  className="bg-muted/50 border-border text-foreground"
                                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                  {isRTL ? 'المحتوى' : 'Body'}
                                </Label>
                                <Textarea
                                  value={section.body}
                                  onChange={(e) =>
                                    handleUpdateSection(lang, index, 'body', e.target.value)
                                  }
                                  placeholder={isRTL ? 'محتوى القسم' : 'Section content'}
                                  rows={4}
                                  className="bg-muted/50 border-border text-foreground"
                                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContentEditor;

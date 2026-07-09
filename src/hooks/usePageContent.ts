import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageContent {
  [key: string]: {
    en: { [key: string]: string };
    ar: { [key: string]: string };
  };
}

const defaultContent: PageContent = {
  home: {
    en: {
      heroTitle: "Sinai Manganese Co.",
      heroSubtitle: "First and Largest Producer of Manganese Ore in Egypt",
      heroDescription:
        "Sinai Manganese Co. SMC was founded on May 18th, 1957, to exploit the manganese deposits in Sinai Peninsula, Egypt.",
      productsSectionLabel: "Our Products",
      productsSectionTitle: "Industrial & Mining Products",
      productsSectionSubtitle: "High-quality products for various industries",
      industrialProducts: "Industrial Products",
      industrialProductsDescription: "Products for industrial applications",
      miningProducts: "Mining Products",
      miningProductsDescription: "Raw materials and minerals",
      clientsSectionLabel: "Our Clients",
      clientsSectionTitle: "Our Success Partners",
      clientsSectionDescription: "We are proud of our partnerships with industry-leading companies",
      gallerySectionTitle: "Silicomanganese",
      gallerySectionDescription:
        "High-quality ferroalloy used in steel production as a deoxidizer and alloying agent. Produced in our 36,000 MTPA electric furnace.",
      galleryImages: "[]",
    },
    ar: {
      heroTitle: "شركة سيناء للمنجنيز",
      heroSubtitle: "أول وأكبر منتج لخام المنجنيز في مصر",
      heroDescription:
        "تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر.",
      productsSectionLabel: "منتجاتنا",
      productsSectionTitle: "المنتجات الصناعية والتعدينية",
      productsSectionSubtitle: "منتجات عالية الجودة لمختلف الصناعات",
      industrialProducts: "المنتجات الصناعية",
      industrialProductsDescription: "منتجات للتطبيقات الصناعية",
      miningProducts: "منتجات التعدين",
      miningProductsDescription: "المواد الخام والمعادن",
      clientsSectionLabel: "عملاؤنا",
      clientsSectionTitle: "شركاؤنا في النجاح",
      clientsSectionDescription: "نفتخر بشراكاتنا مع الشركات الرائدة في الصناعة",
      gallerySectionTitle: "سيليكون منجنيز",
      gallerySectionDescription:
        "سبيكة حديدية عالية الجودة تستخدم في إنتاج الصلب كعامل إزالة الأكسدة وعامل صناعة السبائك. يتم إنتاجها في فرننا الكهربائي بطاقة 36,000 طن سنوياً.",
      galleryImages: "[]",
    },
  },
  footer: {
    en: {
      description:
        "Sinai Manganese Co. is Egypt's first and largest manganese ore producer.",
      quickLinks: "Quick Links",
      contactInfo: "Contact Information",
      followUs: "Follow Us",
      salesNumbersTitle: "Sales Numbers",
      administrationNumbersTitle: "Administration Numbers",
      copyright: "© 2024 Sinai Manganese Co. All rights reserved.",
    },
    ar: {
      description:
        "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
      quickLinks: "روابط سريعة",
      contactInfo: "معلومات الاتصال",
      followUs: "تابعنا",
      salesNumbersTitle: "أرقام المبيعات",
      administrationNumbersTitle: "أرقام الإدارة",
      copyright: "© 2024 شركة سيناء للمنجنيز. جميع الحقوق محفوظة.",
    },
  },
  about: {
    en: {
      heroTitle: "About Us",
      heroDescription:
        "SMC produces both high and low grades of manganese ore and operates an electrical furnace at Abu-Zinima, Sinai. We are the only Middle Eastern producer of Silicomanganese with our own 21 MW gas turbine power station.",
      title: "About Us",
      description:
        "SMC produces both high and low grades of manganese ore and operates an electrical furnace at Abu-Zinima, Sinai.",
      mission: "Our Mission",
      missionText: "To be the leading producer of manganese products in Egypt and the region.",
      vision: "Our Vision",
      visionText: "To expand our operations and serve more industries globally.",
      values: "Our Values",
      valuesText: "Quality, Innovation, Sustainability, and Excellence.",
    },
    ar: {
      heroTitle: "من نحن",
      heroDescription:
        "تنتج شركة سيناء للمنجنيز درجات عالية ومنخفضة من خام المنجنيز وتدير فرناً كهربائياً في أبو زنيمة، سيناء. نحن المنتج الوحيد لسيليكون المنجنيز في الشرق الأوسط مع محطة طاقة غازية خاصة بقدرة 21 ميجاوات.",
      title: "من نحن",
      description:
        "تنتج شركة سيناء للمنجنيز درجات عالية ومنخفضة من خام المنجنيز وتدير فرناً كهربائياً في أبو زنيمة، سيناء.",
      mission: "مهمتنا",
      missionText: "أن نكون المنتج الرائد لمنتجات المنجنيز في مصر والمنطقة.",
      vision: "رؤيتنا",
      visionText: "توسيع عملياتنا وخدمة المزيد من الصناعات عالمياً.",
      values: "قيمنا",
      valuesText: "الجودة، الابتكار، الاستدامة، والتميز.",
    },
  },
  contact: {
    en: {
      heroBadge: "Get in touch",
      heroTitle: "Contact Us",
      heroDescription:
        "Share your industrial ambitions and our partnerships team will respond within one business day to plan a tailored working session.",
      title: "Contact Us",
      subtitle: "Get in touch with us",
      formTitle: "Send us a message",
      formSubtitle: "We will get back to you as soon as possible",
    },
    ar: {
      heroBadge: "تواصل معنا",
      heroTitle: "اتصل بنا",
      heroDescription:
        "شاركنا أهدافك الصناعية وسيتواصل معك فريق الشراكات خلال يوم عمل واحد لترتيب جلسة عمل مخصصة.",
      title: "اتصل بنا",
      subtitle: "تواصل معنا",
      formTitle: "أرسل لنا رسالة",
      formSubtitle: "سنتواصل معك في أقرب وقت ممكن",
    },
  },
  news: {
    en: {
      heroTitle: "News",
      heroDescription:
        "Stay updated with the latest news and developments from Sinai Manganese Company",
    },
    ar: {
      heroTitle: "الأخبار",
      heroDescription: "ابق على اطلاع بآخر الأخبار والتطورات من شركة سيناء للمنجنيز",
    },
  },
  products: {
    en: {
      heroBadge: "Products",
      heroTitle: "Our Products",
      heroDescription: "Explore our products through a single tabbed view with a quick category filter.",
    },
    ar: {
      heroBadge: "المنتجات",
      heroTitle: "منتجاتنا",
      heroDescription: "استكشف منتجاتنا من خلال تبويب واحد مع فلتر فئات سريع.",
    },
  },
  tenders: {
    en: {
      heroTitle: "ADS & Tender",
      heroDescription: "Current tenders and procurement opportunities",
    },
    ar: {
      heroTitle: "الإعلانات والمناقصات",
      heroDescription: "المناقصات الحالية وفرص المشتريات",
    },
  },
  privatePort: {
    en: {
      heroTitle: "Private Port",
      heroDescription:
        "Our private port facility ensures efficient and reliable export of our products to customers worldwide",
      feature1Title: "Modern Facilities",
      feature1Desc:
        "State-of-the-art port facilities equipped for efficient loading and shipping operations",
      feature2Title: "High Capacity",
      feature2Desc:
        "Capable of handling large volumes of manganese ore and silicomanganese shipments",
      feature3Title: "Strategic Location",
      feature3Desc: "Located at Abu-Zinima for optimal access to international shipping routes",
      feature4Title: "Safety Standards",
      feature4Desc: "Strict adherence to international safety and environmental regulations",
      capabilitiesTitle: "Port Capabilities",
      loadingSectionTitle: "Loading & Shipping",
      loadingItem1: "Direct loading to vessels with minimal handling",
      loadingItem2: "Multiple loading points for efficient operations",
      loadingItem3: "24/7 operational capability",
      loadingItem4: "Advanced weighing and quality control systems",
      storageSectionTitle: "Storage & Handling",
      storageItem1: "Covered storage facilities to protect products",
      storageItem2: "Segregated storage areas for different grades",
      storageItem3: "Modern material handling equipment",
      storageItem4: "Dust suppression systems",
    },
    ar: {
      heroTitle: "الميناء الخاص",
      heroDescription:
        "تضمن منشأة الميناء الخاص لدينا تصديراً فعالاً وموثوقاً لمنتجاتنا للعملاء في جميع أنحاء العالم",
      feature1Title: "مرافق حديثة",
      feature1Desc: "مرافق ميناء حديثة مجهزة لعمليات التحميل والشحن الفعالة",
      feature2Title: "قدرة عالية",
      feature2Desc: "قادرة على التعامل مع أحجام كبيرة من شحنات خام المنجنيز وسيليكون المنجنيز",
      feature3Title: "موقع استراتيجي",
      feature3Desc: "يقع في أبو زنيمة للوصول الأمثل إلى طرق الشحن الدولية",
      feature4Title: "معايير السلامة",
      feature4Desc: "الالتزام الصارم بمعايير السلامة والبيئة الدولية",
      capabilitiesTitle: "قدرات الميناء",
      loadingSectionTitle: "التحميل والشحن",
      loadingItem1: "تحميل مباشر على السفن مع أقل قدر من المناولة",
      loadingItem2: "نقاط تحميل متعددة للعمليات الفعالة",
      loadingItem3: "قدرة تشغيلية على مدار الساعة",
      loadingItem4: "أنظمة وزن ومراقبة جودة متقدمة",
      storageSectionTitle: "التخزين والمعالجة",
      storageItem1: "منشآت تخزين مغطاة لحماية المنتجات",
      storageItem2: "مناطق تخزين منفصلة للدرجات المختلفة",
      storageItem3: "معدات معالجة مواد حديثة",
      storageItem4: "أنظمة قمع الغبار",
    },
  },
  members: {
    en: {
      heroTitle: "Board Members",
      heroDescription:
        "We are proud of our distinguished leadership of experts and professionals who lead Sinai Manganese Company towards excellence and success",
    },
    ar: {
      heroTitle: "أعضاء مجلس الإدارة",
      heroDescription:
        "نفتخر بقيادة متميزة من الخبراء والمحترفين الذين يقودون شركة سيناء للمنجنيز نحو التميز والنجاح",
    },
  },
  financial: {
    en: {
      heroTitle: "Financial",
      heroDescription:
        "Maintaining strong financial performance through operational excellence and strategic growth",
    },
    ar: {
      heroTitle: "المالية",
      heroDescription: "الحفاظ على أداء مالي قوي من خلال التميز التشغيلي والنمو الاستراتيجي",
    },
  },
  complaints: {
    en: {
      heroBadge: "Complaints desk",
      heroTitle: "Customer Complaints Center",
      heroDescription:
        "Listening is part of our manufacturing excellence. Share your concern and a service specialist will reach out within one business day.",
    },
    ar: {
      heroBadge: "مركز الشكاوى",
      heroTitle: "منصة شكاوى العملاء",
      heroDescription:
        "نؤمن بأن الاستماع إلى عملائنا جزء من نجاحنا التشغيلي. شاركنا أي ملاحظة أو مشكلة وسيتواصل معك فريق خدمة العملاء خلال يوم عمل واحد.",
    },
  },
};

export const usePageContent = (
  page: string,
  key: string,
  fallback?: string,
): string => {
  const { language } = useLanguage();
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Load content from backend
    const loadContent = async () => {
      try {
        const { pageContentAPI } = await import("@/services/api");
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
        const merged: PageContent = { ...defaultContent };
        Object.entries(contentObj).forEach(([page, pageData]) => {
          merged[page] = {
            en: { ...(defaultContent[page]?.en || {}), ...(pageData.en || {}) },
            ar: { ...(defaultContent[page]?.ar || {}), ...(pageData.ar || {}) },
          };
        });
        setContent(merged);

        // Also save to localStorage for offline access
        localStorage.setItem("pageContent", JSON.stringify(contentObj));
      } catch (error) {
        console.error("Error loading page content from backend:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("pageContent");
          if (saved) {
            const parsed = JSON.parse(saved);
            setContent({ ...defaultContent, ...parsed });
          }
        } catch (e) {
          console.error("Error parsing pageContent:", e);
          setContent(defaultContent);
        }
      }
    };

    loadContent();
  }, []);

  // Listen for changes in localStorage and custom events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("pageContent");
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent({ ...defaultContent, ...parsed });
        }
      } catch (error) {
        console.error("Error parsing pageContent:", error);
      }
    };

    const handlePageContentUpdate = async () => {
      // Refetch from backend when content is updated
      try {
        const { pageContentAPI } = await import("@/services/api");
        const allContent = await pageContentAPI.getAll();

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

        const merged: PageContent = { ...defaultContent };
        Object.entries(contentObj).forEach(([page, pageData]) => {
          merged[page] = {
            en: { ...(defaultContent[page]?.en || {}), ...(pageData.en || {}) },
            ar: { ...(defaultContent[page]?.ar || {}), ...(pageData.ar || {}) },
          };
        });
        setContent(merged);
        localStorage.setItem("pageContent", JSON.stringify(contentObj));
      } catch (error) {
        console.error("Error refetching page content:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("pageContentUpdated", handlePageContentUpdate);

    // Check periodically for changes (in case of same-tab updates)
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("pageContent");
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent((prevContent) => {
            const newContent = { ...defaultContent, ...parsed };
            const currentStr = JSON.stringify(prevContent);
            const newStr = JSON.stringify(newContent);
            if (currentStr !== newStr) {
              return newContent;
            }
            return prevContent;
          });
        }
      } catch (error) {
        console.error("Error parsing pageContent:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pageContentUpdated", handlePageContentUpdate);
      clearInterval(interval);
    };
  }, []);

  const pageContent = content[page];
  if (!pageContent) return fallback || key;

  const langContent = pageContent[language] || pageContent.en;
  return langContent[key] || fallback || key;
};

interface PageHeroFallbacks {
  badge?: string;
  title: string;
  description: string;
}

/** CMS-driven hero badge, title, and description with i18n fallbacks. */
export const usePageHero = (page: string, fallbacks: PageHeroFallbacks) => {
  const rawBadge = usePageContent(page, "heroBadge", fallbacks.badge ?? "");
  const title = usePageContent(page, "heroTitle", fallbacks.title);
  const description = usePageContent(page, "heroDescription", fallbacks.description);

  const badge = rawBadge === "heroBadge" ? (fallbacks.badge ?? "") : rawBadge;

  return { badge, title, description };
};

export const usePageContentJson = <T>(
  page: string,
  key: string,
  fallback: T,
): T => {
  const raw = usePageContent(page, key, "");

  if (!raw || raw === key) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const defaultSettings = {
  siteName: "Sinai Manganese Co.",
  siteNameAr: "شركة سيناء للمنجنيز",
  email: "info@smc-eg.com",
  phone: "25740005 / 25740217",
  address: "Abu Zenima – South Sinai, Egypt",
  addressAr: "أبو زنيمة – جنوب سيناء، مصر",
  cairoAddress: "1 Kasr El-Nile St., Cairo – Egypt",
  cairoAddressAr: "1 شارع قصر النيل، القاهرة – مصر",
  workingHours: "Sun - Thu · 8:00 AM - 5:00 PM",
  workingHoursAr: "الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً",
  description:
    "Sinai Manganese Co. is Egypt's first and largest manganese ore producer.",
  descriptionAr: "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
  facebook: "https://www.facebook.com/share/p/1QWB8WE7ZS/",
  twitter: "",
  linkedin: "",
  whatsapp: "https://wa.me/201282055059",
};

export const useSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<any>(defaultSettings);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Try to fetch from backend first
    const fetchSettings = async () => {
      try {
        const { settingsAPI } = await import("@/services/api");
        const allSettings = await settingsAPI.getAll();

        // Convert settings array to object
        const settingsObj: any = {};
        allSettings.forEach((setting: any) => {
          settingsObj[setting.key] = setting;
        });

        // Parse phone numbers
        const parsePhoneNumbers = (key: string): any[] => {
          const setting = settingsObj[key];
          if (!setting) return [];

          let value = setting.valueEn || setting.valueAr;
          if (!value) return [];

          try {
            let parsed = typeof value === "string" ? JSON.parse(value) : value;

            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed);
            }

            return Array.isArray(parsed)
              ? parsed
              : [{ number: value, label: "" }];
          } catch (e) {
            console.error("Parsing error for key:", key, e);
            return [{ number: value, label: "" }];
          }
        };

        const newSettings = {
          siteName:
            settingsObj.company_name?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.siteName,
          siteNameAr:
            settingsObj.company_name?.valueAr || defaultSettings.siteNameAr,
          email:
            settingsObj.company_email?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.email,
          phone:
            settingsObj.company_phone?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.phone,
          address:
            settingsObj.company_address?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.address,
          addressAr:
            settingsObj.company_address?.valueAr || defaultSettings.addressAr,
          cairoAddress:
            settingsObj.company_address_cairo?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.cairoAddress,
          cairoAddressAr:
            settingsObj.company_address_cairo?.valueAr ||
            defaultSettings.cairoAddressAr,
          description:
            settingsObj.company_description?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.description,
          descriptionAr:
            settingsObj.company_description?.valueAr ||
            defaultSettings.descriptionAr,
          facebook:
            settingsObj.facebook_url?.valueEn || defaultSettings.facebook,
          twitter: settingsObj.twitter_url?.valueEn || defaultSettings.twitter,
          linkedin:
            settingsObj.linkedin_url?.valueEn || defaultSettings.linkedin,
          workingHours:
            settingsObj.working_hours?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.workingHours,
          workingHoursAr:
            settingsObj.working_hours?.valueAr || defaultSettings.workingHoursAr,
          whatsapp:
            settingsObj.whatsapp_url?.valueEn || defaultSettings.whatsapp,
          phoneNumbersSales: parsePhoneNumbers("phone_numbers_sales"),
          faxNumbersSales: parsePhoneNumbers("fax_numbers_sales"),
          phoneNumbersAdmin: parsePhoneNumbers("phone_numbers_admin"),
          faxNumbersAdmin: parsePhoneNumbers("fax_numbers_admin"),
          complaintsEmail:
            settingsObj.complaints_email?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || "",
        };

        setSettings(newSettings);
        // Also save to localStorage for offline access
        localStorage.setItem("siteSettings", JSON.stringify(newSettings));
      } catch (error) {
        console.error("Error fetching settings from backend:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("siteSettings");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSettings({ ...defaultSettings, ...parsed });
          }
        } catch (e) {
          console.error("Error parsing siteSettings:", e);
          setSettings(defaultSettings);
        }
      }
    };

    fetchSettings();
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error("Error parsing siteSettings:", error);
      }
    };

    const handleSettingsUpdate = () => {
      // Refetch from backend when settings are updated
      const fetchSettings = async () => {
        try {
          const { settingsAPI } = await import("@/services/api");
          const allSettings = await settingsAPI.getAll();
          const settingsObj: any = {};
          allSettings.forEach((setting: any) => {
            settingsObj[setting.key] = setting;
          });

          const parsePhoneNumbers = (key: string): any[] => {
            const setting = settingsObj[key];
            if (!setting) return [];
            const value = language === "ar" ? setting.valueAr : setting.valueEn;
            if (!value) return [];
            try {
              return JSON.parse(value);
            } catch {
              return [];
            }
          };

          const newSettings = {
            siteName:
              settingsObj.company_name?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.siteName,
            siteNameAr:
              settingsObj.company_name?.valueAr || defaultSettings.siteNameAr,
            email:
              settingsObj.company_email?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.email,
            phone:
              settingsObj.company_phone?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.phone,
            address:
              settingsObj.company_address?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.address,
            addressAr:
              settingsObj.company_address?.valueAr || defaultSettings.addressAr,
            cairoAddress:
              settingsObj.company_address_cairo?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.cairoAddress,
            cairoAddressAr:
              settingsObj.company_address_cairo?.valueAr ||
              defaultSettings.cairoAddressAr,
            description:
              settingsObj.company_description?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.description,
            descriptionAr:
              settingsObj.company_description?.valueAr ||
              defaultSettings.descriptionAr,
            facebook:
              settingsObj.facebook_url?.valueEn || defaultSettings.facebook,
            twitter:
              settingsObj.twitter_url?.valueEn || defaultSettings.twitter,
            linkedin:
              settingsObj.linkedin_url?.valueEn || defaultSettings.linkedin,
            workingHours:
              settingsObj.working_hours?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.workingHours,
            workingHoursAr:
              settingsObj.working_hours?.valueAr || defaultSettings.workingHoursAr,
            whatsapp:
              settingsObj.whatsapp_url?.valueEn || defaultSettings.whatsapp,
            phoneNumbersSales: parsePhoneNumbers("phone_numbers_sales"),
            faxNumbersSales: parsePhoneNumbers("fax_numbers_sales"),
            phoneNumbersAdmin: parsePhoneNumbers("phone_numbers_admin"),
            faxNumbersAdmin: parsePhoneNumbers("fax_numbers_admin"),
            complaintsEmail:
              settingsObj.complaints_email?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || "",
          };

          setSettings(newSettings);
          localStorage.setItem("siteSettings", JSON.stringify(newSettings));
        } catch (error) {
          console.error("Error refetching settings:", error);
        }
      };
      fetchSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings((prevSettings) => {
            const newSettings = { ...defaultSettings, ...parsed };
            const currentStr = JSON.stringify(prevSettings);
            const newStr = JSON.stringify(newSettings);
            if (currentStr !== newStr) {
              return newSettings;
            }
            return prevSettings;
          });
        }
      } catch (error) {
        console.error("Error parsing siteSettings:", error);
      }
    }, 5000); // Check every 5 seconds instead of 1

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
      clearInterval(interval);
    };
  }, [language]);

  // Ensure settings is always defined
  const safeSettings = settings || defaultSettings;

  return {
    siteName:
      language === "ar"
        ? safeSettings.siteNameAr || defaultSettings.siteNameAr
        : safeSettings.siteName || defaultSettings.siteName,
    email: safeSettings.email || defaultSettings.email,
    phone: safeSettings.phone || defaultSettings.phone,
    address:
      language === "ar"
        ? safeSettings.addressAr || defaultSettings.addressAr
        : safeSettings.address || defaultSettings.address,
    cairoAddress:
      language === "ar"
        ? safeSettings.cairoAddressAr || defaultSettings.cairoAddressAr
        : safeSettings.cairoAddress || defaultSettings.cairoAddress,
    description:
      language === "ar"
        ? safeSettings.descriptionAr || defaultSettings.descriptionAr
        : safeSettings.description || defaultSettings.description,
    facebook: safeSettings.facebook || defaultSettings.facebook,
    twitter: safeSettings.twitter || defaultSettings.twitter,
    linkedin: safeSettings.linkedin || defaultSettings.linkedin,
    whatsapp: safeSettings.whatsapp || defaultSettings.whatsapp,
    workingHours:
      language === "ar"
        ? safeSettings.workingHoursAr || defaultSettings.workingHoursAr
        : safeSettings.workingHours || defaultSettings.workingHours,
    phoneNumbersSales: safeSettings.phoneNumbersSales || [],
    faxNumbersSales: safeSettings.faxNumbersSales || [],
    phoneNumbersAdmin: safeSettings.phoneNumbersAdmin || [],
    faxNumbersAdmin: safeSettings.faxNumbersAdmin || [],
    complaintsEmail: safeSettings.complaintsEmail || "",
  };
};

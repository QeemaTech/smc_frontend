import { useState, useEffect, useRef } from "react";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  Printer,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
const getInitialSettings = () => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("siteSettings");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};
const Settings = () => {
  const { t, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    siteName: "Sinai Manganese Co.",
    siteNameAr: "شركة سيناء للمنجنيز",
    email: "info@smc-eg.com",
    phone: "25740005 / 25740217",
    address: "Abu Zenima – South Sinai, Egypt",
    addressAr: "أبو زنيمة – جنوب سيناء، مصر",
    cairoAddress: "1 Kasr El-Nile St., Cairo – Egypt",
    cairoAddressAr: "1 شارع قصر النيل، القاهرة – مصر",
    description:
      "Sinai Manganese Co. is the first and largest manganese ore producer in Egypt.",
    descriptionAr:
      "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
    facebook: "https://www.facebook.com/share/p/1QWB8WE7ZS/",
    twitter: "",
    linkedin: "",
    clientLogos: [] as string[], // Array of base64 images
    phoneNumbersSales: [] as Array<{
      number: string;
      type: "phone" | "fax";
      label?: string;
    }>,
    faxNumbersSales: [] as Array<{
      number: string;
      type: "phone" | "fax";
      label?: string;
    }>,
    phoneNumbersAdmin: [] as Array<{
      number: string;
      type: "phone" | "fax";
      label?: string;
    }>,
    faxNumbersAdmin: [] as Array<{
      number: string;
      type: "phone" | "fax";
      label?: string;
    }>,
    complaintsEmail: "info1@smc-eg.com",
    workingHours: "Sun - Thu · 8:00 AM - 5:00 PM",
    workingHoursAr: "الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً",
    whatsapp: "https://wa.me/201282055059",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Load settings from backend
    const loadSettings = async () => {
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
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error(`Error parsing key: ${key}`, e);
            return [];
          }
        };

        const loadedSettings = {
          siteName: settingsObj.company_name?.valueEn || "Sinai Manganese Co.",
          siteNameAr:
            settingsObj.company_name?.valueAr || "شركة سيناء للمنجنيز",
          email: settingsObj.company_email?.valueEn || "info@smc-eg.com",
          phone: settingsObj.company_phone?.valueEn || "25740005 / 25740217",
          address:
            settingsObj.company_address?.valueEn ||
            "Abu Zenima – South Sinai, Egypt",
          addressAr:
            settingsObj.company_address?.valueAr ||
            "أبو زنيمة – جنوب سيناء، مصر",
          cairoAddress:
            settingsObj.company_address_cairo?.valueEn ||
            "1 Kasr El-Nile St., Cairo – Egypt",
          cairoAddressAr:
            settingsObj.company_address_cairo?.valueAr ||
            "1 شارع قصر النيل، القاهرة – مصر",
          description:
            settingsObj.company_description?.valueEn ||
            "Sinai Manganese Co. is the first and largest manganese ore producer in Egypt.",
          descriptionAr:
            settingsObj.company_description?.valueAr ||
            "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
          facebook:
            settingsObj.facebook_url?.valueEn ||
            "https://www.facebook.com/share/p/1QWB8WE7ZS/",
          twitter: settingsObj.twitter_url?.valueEn || "",
          linkedin: settingsObj.linkedin_url?.valueEn || "",
          phoneNumbersSales: parsePhoneNumbers("phone_numbers_sales"),
          faxNumbersSales: parsePhoneNumbers("fax_numbers_sales"),
          phoneNumbersAdmin: parsePhoneNumbers("phone_numbers_admin"),
          faxNumbersAdmin: parsePhoneNumbers("fax_numbers_admin"),
          complaintsEmail:
            settingsObj.complaints_email?.valueEn || "info1@smc-eg.com",
          workingHours:
            settingsObj.working_hours?.valueEn ||
            "Sun - Thu · 8:00 AM - 5:00 PM",
          workingHoursAr:
            settingsObj.working_hours?.valueAr ||
            "الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً",
          whatsapp:
            settingsObj.whatsapp_url?.valueEn || "https://wa.me/201282055059",
          clientLogos: [] as string[],
        };

        setSettings((prev) => ({ ...prev, ...loadedSettings }));
        localStorage.setItem("siteSettings", JSON.stringify(loadedSettings));
      } catch (error) {
        console.error("Error loading settings from backend:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("siteSettings");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSettings((prev) => ({
              ...prev,
              ...parsed,
              clientLogos: parsed.clientLogos || [],
            }));
          }
        } catch (e) {
          console.error("Error loading settings from localStorage:", e);
        }
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (typeof window === "undefined") return;

    try {
      // Save to backend
      const { settingsAPI } = await import("@/services/api");

      // Save all settings
      const settingsToSave = [
        {
          key: "company_name",
          valueEn: settings.siteName,
          valueAr: settings.siteNameAr,
        },
        {
          key: "company_description",
          valueEn: settings.description,
          valueAr: settings.descriptionAr,
        },
        {
          key: "company_email",
          valueEn: settings.email,
          valueAr: settings.email,
        },
        {
          key: "company_phone",
          valueEn: settings.phone,
          valueAr: settings.phone,
        },
        {
          key: "company_address",
          valueEn: settings.address,
          valueAr: settings.addressAr,
        },
        {
          key: "company_address_cairo",
          valueEn: settings.cairoAddress,
          valueAr: settings.cairoAddressAr,
        },
        {
          key: "facebook_url",
          valueEn: settings.facebook,
          valueAr: settings.facebook,
        },
        {
          key: "twitter_url",
          valueEn: settings.twitter,
          valueAr: settings.twitter,
        },
        {
          key: "linkedin_url",
          valueEn: settings.linkedin,
          valueAr: settings.linkedin,
        },
        {
          key: "phone_numbers_sales",
          valueEn: JSON.stringify(settings.phoneNumbersSales),
          valueAr: JSON.stringify(settings.phoneNumbersSales),
        },
        {
          key: "fax_numbers_sales",
          valueEn: JSON.stringify(settings.faxNumbersSales),
          valueAr: JSON.stringify(settings.faxNumbersSales),
        },
        {
          key: "phone_numbers_admin",
          valueEn: JSON.stringify(settings.phoneNumbersAdmin),
          valueAr: JSON.stringify(settings.phoneNumbersAdmin),
        },
        {
          key: "fax_numbers_admin",
          valueEn: JSON.stringify(settings.faxNumbersAdmin),
          valueAr: JSON.stringify(settings.faxNumbersAdmin),
        },
        {
          key: "complaints_email",
          valueEn: settings.complaintsEmail,
          valueAr: settings.complaintsEmail,
        },
        {
          key: "working_hours",
          valueEn: settings.workingHours,
          valueAr: settings.workingHoursAr,
        },
        {
          key: "whatsapp_url",
          valueEn: settings.whatsapp,
          valueAr: settings.whatsapp,
        },
      ];

      // Save each setting
      for (const setting of settingsToSave) {
        try {
          await settingsAPI.createOrUpdate({
            key: setting.key,
            valueEn: setting.valueEn,
            valueAr: setting.valueAr,
          });
        } catch (err) {
          console.error(`Failed to save ${setting.key}`, err);
        }
      }

      // Also save to localStorage for offline access
      localStorage.setItem("siteSettings", JSON.stringify(settings));

      // Trigger storage event to update all components
      window.dispatchEvent(new Event("storage"));
      // Trigger custom event for settings update
      window.dispatchEvent(new CustomEvent("settingsUpdated"));

      toast.success(
        isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully",
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(isRTL ? "فشل في حفظ الإعدادات" : "Failed to save settings");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        isRTL ? "الملف المحدد ليس صورة" : "Selected file is not an image",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettings((prev) => ({
        ...prev,
        clientLogos: [...(prev.clientLogos || []), base64],
      }));
      toast.success(
        isRTL ? "تم إضافة الصورة بنجاح" : "Image added successfully",
      );
    };
    reader.onerror = () => {
      toast.error(isRTL ? "فشل في قراءة الصورة" : "Failed to read image");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      clientLogos: prev.clientLogos.filter((_, i) => i !== index),
    }));
    toast.success(isRTL ? "تم حذف الصورة" : "Image removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {t("settings") || "Settings"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("manageSiteSettings") || "Manage website settings"}
          </p>
        </div>
        <Button
          onClick={handleSave}
          
        >
          <Save className="h-4 w-4 mr-2" />
          {t("save") || "Save"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="backdrop-blur-xl bg-card/90 border-border">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("general") || "General"}
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("contact") || "Contact"}
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("socialMedia") || "Social Media"}
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {isRTL ? "معرض صور العملاء" : "Client Logos Gallery"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>
                {t("generalSettings") || "General Settings"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("siteName") || "Site Name"} (EN)
                  </Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("siteName") || "Site Name"} (AR)
                  </Label>
                  <Input
                    value={settings.siteNameAr}
                    onChange={(e) =>
                      setSettings({ ...settings, siteNameAr: e.target.value })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("description") || "Description"} (EN)
                  </Label>
                  <Textarea
                    value={settings.description}
                    onChange={(e) =>
                      setSettings({ ...settings, description: e.target.value })
                    }
                    rows={3}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("description") || "Description"} (AR)
                  </Label>
                  <Textarea
                    value={settings.descriptionAr}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        descriptionAr: e.target.value,
                      })
                    }
                    rows={3}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>
                {t("contactInformation") || "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  <Mail className="h-4 w-4 inline mr-2" />
                  {t("email") || "Email"}
                </Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Phone className="h-4 w-4 inline mr-2" />
                  {t("phone") || "Phone"} (
                  {isRTL ? "عرض عام" : "General Display"})
                </Label>
                <Input
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="bg-muted/50 border-border text-foreground"
                  placeholder={
                    isRTL ? "25740005 / 25740217" : "25740005 / 25740217"
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {isRTL
                    ? "يستخدم للعرض العام فقط"
                    : "Used for general display only"}
                </p>
              </div>

              {/* Sales Phone Numbers */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {isRTL ? "أرقام المبيعات" : "Sales Phone Numbers"}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        phoneNumbersSales: [
                          ...settings.phoneNumbersSales,
                          { number: "", type: "phone" },
                        ],
                      })
                    }
                    
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? "إضافة" : "Add"}
                  </Button>
                </div>
                {settings.phoneNumbersSales.map((phone, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={phone.number}
                      onChange={(e) => {
                        const updated = [...settings.phoneNumbersSales];
                        updated[index] = {
                          ...updated[index],
                          number: e.target.value,
                        };
                        setSettings({
                          ...settings,
                          phoneNumbersSales: updated,
                        });
                      }}
                      placeholder={isRTL ? "رقم الهاتف" : "Phone number"}
                      className="bg-muted/50 border-border text-foreground flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          phoneNumbersSales: settings.phoneNumbersSales.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Administration Phone Numbers */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {isRTL ? "أرقام الإدارة" : "Administration Phone Numbers"}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        phoneNumbersAdmin: [
                          ...settings.phoneNumbersAdmin,
                          { number: "", type: "phone" },
                        ],
                      })
                    }
                    
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? "إضافة" : "Add"}
                  </Button>
                </div>
                {settings.phoneNumbersAdmin.map((phone, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={phone.number}
                      onChange={(e) => {
                        const updated = [...settings.phoneNumbersAdmin];
                        updated[index] = {
                          ...updated[index],
                          number: e.target.value,
                        };
                        setSettings({
                          ...settings,
                          phoneNumbersAdmin: updated,
                        });
                      }}
                      placeholder={isRTL ? "رقم الهاتف" : "Phone number"}
                      className="bg-muted/50 border-border text-foreground flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          phoneNumbersAdmin: settings.phoneNumbersAdmin.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Sales Fax Numbers */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    <Printer className="h-4 w-4 inline mr-2" />
                    {isRTL ? "أرقام فاكس المبيعات" : "Sales Fax Numbers"}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        faxNumbersSales: [
                          ...settings.faxNumbersSales,
                          { number: "", type: "fax", label: "Sales Fax" },
                        ],
                      })
                    }
                    
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? "إضافة" : "Add"}
                  </Button>
                </div>
                {settings.faxNumbersSales.map((fax, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={fax.number}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersSales];
                        updated[index] = {
                          ...updated[index],
                          number: e.target.value,
                        };
                        setSettings({ ...settings, faxNumbersSales: updated });
                      }}
                      placeholder={isRTL ? "رقم الفاكس" : "Fax number"}
                      className="bg-muted/50 border-border text-foreground flex-1"
                    />
                    <Input
                      value={fax.label || ""}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersSales];
                        updated[index] = {
                          ...updated[index],
                          label: e.target.value,
                        };
                        setSettings({ ...settings, faxNumbersSales: updated });
                      }}
                      placeholder={
                        isRTL ? "التسمية (اختياري)" : "Label (optional)"
                      }
                      className="bg-muted/50 border-border text-foreground w-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          faxNumbersSales: settings.faxNumbersSales.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Administration Fax Numbers */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    <Printer className="h-4 w-4 inline mr-2" />
                    {isRTL
                      ? "أرقام فاكس الإدارة"
                      : "Administration Fax Numbers"}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        faxNumbersAdmin: [
                          ...settings.faxNumbersAdmin,
                          { number: "", type: "fax", label: "Admin Fax" },
                        ],
                      })
                    }
                    
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? "إضافة" : "Add"}
                  </Button>
                </div>
                {settings.faxNumbersAdmin.map((fax, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={fax.number}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersAdmin];
                        updated[index] = {
                          ...updated[index],
                          number: e.target.value,
                        };
                        setSettings({ ...settings, faxNumbersAdmin: updated });
                      }}
                      placeholder={isRTL ? "رقم الفاكس" : "Fax number"}
                      className="bg-muted/50 border-border text-foreground flex-1"
                    />
                    <Input
                      value={fax.label || ""}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersAdmin];
                        updated[index] = {
                          ...updated[index],
                          label: e.target.value,
                        };
                        setSettings({ ...settings, faxNumbersAdmin: updated });
                      }}
                      placeholder={
                        isRTL ? "التسمية (اختياري)" : "Label (optional)"
                      }
                      className="bg-muted/50 border-border text-foreground w-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          faxNumbersAdmin: settings.faxNumbersAdmin.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Complaints Email */}
              <div className="space-y-2 pt-4 border-t border-border">
                <Label>
                  <Mail className="h-4 w-4 inline mr-2" />
                  {isRTL ? "البريد الإلكتروني للشكاوى" : "Complaints Email"}
                </Label>
                <Input
                  type="email"
                  value={settings.complaintsEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      complaintsEmail: e.target.value,
                    })
                  }
                  placeholder={isRTL ? "info1@smc-eg.com" : "info1@smc-eg.com"}
                  className="bg-muted/50 border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  {isRTL
                    ? "البريد الإلكتروني المخصص لاستقبال الشكاوى"
                    : "Email address specifically for receiving complaints"}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label>
                    <Clock className="h-4 w-4 inline mr-2" />
                    {isRTL ? "ساعات العمل" : "Working Hours"} (EN)
                  </Label>
                  <Input
                    value={settings.workingHours}
                    onChange={(e) =>
                      setSettings({ ...settings, workingHours: e.target.value })
                    }
                    placeholder="Sun - Thu · 8:00 AM - 5:00 PM"
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Clock className="h-4 w-4 inline mr-2" />
                    {isRTL ? "ساعات العمل" : "Working Hours"} (AR)
                  </Label>
                  <Input
                    value={settings.workingHoursAr}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workingHoursAr: e.target.value,
                      })
                    }
                    placeholder="الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً"
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {t("headOffice") || "Head Office"} (EN)
                  </Label>
                  <Input
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {t("headOffice") || "Head Office"} (AR)
                  </Label>
                  <Input
                    value={settings.addressAr}
                    onChange={(e) =>
                      setSettings({ ...settings, addressAr: e.target.value })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("cairoOffice") || "Cairo Office"} (EN)
                  </Label>
                  <Input
                    value={settings.cairoAddress}
                    onChange={(e) =>
                      setSettings({ ...settings, cairoAddress: e.target.value })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("cairoOffice") || "Cairo Office"} (AR)
                  </Label>
                  <Input
                    value={settings.cairoAddressAr}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cairoAddressAr: e.target.value,
                      })
                    }
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>
                {t("socialMedia") || "Social Media"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={settings.facebook}
                  onChange={(e) =>
                    setSettings({ ...settings, facebook: e.target.value })
                  }
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter URL</Label>
                <Input
                  value={settings.twitter}
                  onChange={(e) =>
                    setSettings({ ...settings, twitter: e.target.value })
                  }
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={settings.linkedin}
                  onChange={(e) =>
                    setSettings({ ...settings, linkedin: e.target.value })
                  }
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp URL</Label>
                <Input
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  placeholder="https://wa.me/201282055059"
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>
                {isRTL ? "معرض صور العملاء" : "Client Logos Gallery"}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                {isRTL
                  ? "أضف صور لوجوهات العملاء التي ستظهر في قسم العملاء في الصفحة الرئيسية"
                  : "Add client logo images that will be displayed in the clients section on the homepage"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isRTL ? "إضافة صورة" : "Add Image"}
                </Button>
                <span className="text-muted-foreground text-sm">
                  {isRTL
                    ? `${settings.clientLogos?.length || 0} صورة مضافة`
                    : `${settings.clientLogos?.length || 0} images added`}
                </span>
              </div>

              {settings.clientLogos && settings.clientLogos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {settings.clientLogos.map((logo, index) => (
                    <div
                      key={index}
                      className="relative group bg-muted/50 rounded-lg p-4 border border-border"
                    >
                      <img
                        src={logo}
                        alt={`Client logo ${index + 1}`}
                        className="w-full h-24 object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {(!settings.clientLogos || settings.clientLogos.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isRTL ? "لا توجد صور مضافة بعد" : "No images added yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

import { useEffect, useState } from "react";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Clock,
  Plus,
  X,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

type PhoneEntry = { number: string; type: "phone" | "fax"; label?: string };

type ContactData = {
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  cairoAddress: string;
  cairoAddressAr: string;
  workingHours: string;
  workingHoursAr: string;
  complaintsEmail: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  phoneNumbersSales: PhoneEntry[];
  faxNumbersSales: PhoneEntry[];
  phoneNumbersAdmin: PhoneEntry[];
  faxNumbersAdmin: PhoneEntry[];
};

const defaultContactData: ContactData = {
  email: "info@smc-eg.com",
  phone: "25740005 / 25740217",
  address: "Abu Zenima – South Sinai, Egypt",
  addressAr: "أبو زنيمة – جنوب سيناء، مصر",
  cairoAddress: "1 Kasr El-Nile St., Cairo – Egypt",
  cairoAddressAr: "1 شارع قصر النيل، القاهرة – مصر",
  workingHours: "Sun - Thu · 8:00 AM - 5:00 PM",
  workingHoursAr: "الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً",
  complaintsEmail: "info1@smc-eg.com",
  facebook: "",
  linkedin: "",
  whatsapp: "https://wa.me/201282055059",
  phoneNumbersSales: [],
  faxNumbersSales: [],
  phoneNumbersAdmin: [],
  faxNumbersAdmin: [],
};

const parsePhoneNumbers = (settingsObj: Record<string, any>, key: string): PhoneEntry[] => {
  const setting = settingsObj[key];
  if (!setting) return [];

  const value = setting.valueEn || setting.valueAr;
  if (!value) return [];

  try {
    let parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface ContactDataEditorProps {
  context?: "footer" | "contact";
}

const ContactDataEditor = ({ context = "footer" }: ContactDataEditorProps) => {
  const { isRTL } = useLanguage();
  const [data, setData] = useState<ContactData>(defaultContactData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { settingsAPI } = await import("@/services/api");
        const allSettings = await settingsAPI.getAll();
        const settingsObj: Record<string, any> = {};
        allSettings.forEach((setting: any) => {
          settingsObj[setting.key] = setting;
        });

        setData({
          email: settingsObj.company_email?.valueEn || defaultContactData.email,
          phone: settingsObj.company_phone?.valueEn || defaultContactData.phone,
          address: settingsObj.company_address?.valueEn || defaultContactData.address,
          addressAr: settingsObj.company_address?.valueAr || defaultContactData.addressAr,
          cairoAddress:
            settingsObj.company_address_cairo?.valueEn || defaultContactData.cairoAddress,
          cairoAddressAr:
            settingsObj.company_address_cairo?.valueAr || defaultContactData.cairoAddressAr,
          workingHours:
            settingsObj.working_hours?.valueEn || defaultContactData.workingHours,
          workingHoursAr:
            settingsObj.working_hours?.valueAr || defaultContactData.workingHoursAr,
          complaintsEmail:
            settingsObj.complaints_email?.valueEn || defaultContactData.complaintsEmail,
          facebook: settingsObj.facebook_url?.valueEn || "",
          linkedin: settingsObj.linkedin_url?.valueEn || "",
          whatsapp: settingsObj.whatsapp_url?.valueEn || defaultContactData.whatsapp,
          phoneNumbersSales: parsePhoneNumbers(settingsObj, "phone_numbers_sales"),
          faxNumbersSales: parsePhoneNumbers(settingsObj, "fax_numbers_sales"),
          phoneNumbersAdmin: parsePhoneNumbers(settingsObj, "phone_numbers_admin"),
          faxNumbersAdmin: parsePhoneNumbers(settingsObj, "fax_numbers_admin"),
        });
      } catch (error) {
        console.error("Failed to load contact data:", error);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { settingsAPI } = await import("@/services/api");
      const settingsToSave = [
        { key: "company_email", valueEn: data.email, valueAr: data.email },
        { key: "company_phone", valueEn: data.phone, valueAr: data.phone },
        { key: "company_address", valueEn: data.address, valueAr: data.addressAr },
        {
          key: "company_address_cairo",
          valueEn: data.cairoAddress,
          valueAr: data.cairoAddressAr,
        },
        { key: "working_hours", valueEn: data.workingHours, valueAr: data.workingHoursAr },
        {
          key: "complaints_email",
          valueEn: data.complaintsEmail,
          valueAr: data.complaintsEmail,
        },
        { key: "facebook_url", valueEn: data.facebook, valueAr: data.facebook },
        { key: "linkedin_url", valueEn: data.linkedin, valueAr: data.linkedin },
        { key: "whatsapp_url", valueEn: data.whatsapp, valueAr: data.whatsapp },
        {
          key: "phone_numbers_sales",
          valueEn: JSON.stringify(data.phoneNumbersSales),
          valueAr: JSON.stringify(data.phoneNumbersSales),
        },
        {
          key: "fax_numbers_sales",
          valueEn: JSON.stringify(data.faxNumbersSales),
          valueAr: JSON.stringify(data.faxNumbersSales),
        },
        {
          key: "phone_numbers_admin",
          valueEn: JSON.stringify(data.phoneNumbersAdmin),
          valueAr: JSON.stringify(data.phoneNumbersAdmin),
        },
        {
          key: "fax_numbers_admin",
          valueEn: JSON.stringify(data.faxNumbersAdmin),
          valueAr: JSON.stringify(data.faxNumbersAdmin),
        },
      ];

      for (const setting of settingsToSave) {
        await settingsAPI.createOrUpdate(setting);
      }

      localStorage.setItem(
        "siteSettings",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("siteSettings") || "{}"),
          ...data,
        }),
      );
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("settingsUpdated"));

      toast.success(
        isRTL ? "تم حفظ بيانات الاتصال بنجاح" : "Contact data saved successfully",
      );
    } catch (error) {
      console.error("Failed to save contact data:", error);
      toast.error(isRTL ? "فشل في حفظ بيانات الاتصال" : "Failed to save contact data");
    } finally {
      setSaving(false);
    }
  };

  const renderPhoneList = (
    label: string,
    field: keyof Pick<
      ContactData,
      "phoneNumbersSales" | "phoneNumbersAdmin" | "faxNumbersSales" | "faxNumbersAdmin"
    >,
    type: "phone" | "fax",
    defaultLabel?: string,
  ) => (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          {type === "phone" ? (
            <Phone className="h-4 w-4 inline mr-2" />
          ) : (
            <Printer className="h-4 w-4 inline mr-2" />
          )}
          {label}
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            setData({
              ...data,
              [field]: [
                ...data[field],
                { number: "", type, label: defaultLabel },
              ],
            })
          }
        >
          <Plus className="h-4 w-4 mr-1" />
          {isRTL ? "إضافة" : "Add"}
        </Button>
      </div>
      {data[field].map((entry, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            value={entry.number}
            onChange={(e) => {
              const updated = [...data[field]];
              updated[index] = { ...updated[index], number: e.target.value };
              setData({ ...data, [field]: updated });
            }}
            placeholder={isRTL ? "الرقم" : "Number"}
            className="bg-muted/50 border-border text-foreground flex-1"
          />
          {type === "fax" && (
            <Input
              value={entry.label || ""}
              onChange={(e) => {
                const updated = [...data[field]];
                updated[index] = { ...updated[index], label: e.target.value };
                setData({ ...data, [field]: updated });
              }}
              placeholder={isRTL ? "التسمية" : "Label"}
              className="bg-muted/50 border-border text-foreground w-32"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() =>
              setData({
                ...data,
                [field]: data[field].filter((_, i) => i !== index),
              })
            }
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  const contextNote =
    context === "footer"
      ? isRTL
        ? "هذه البيانات تظهر في الفوتر والصفحة الرئيسية وصفحة اتصل بنا."
        : "This data appears in the footer, homepage, and contact page."
      : isRTL
        ? "هذه البيانات تظهر في صفحة اتصل بنا والفوتر والصفحة الرئيسية."
        : "This data appears on the contact page, footer, and homepage.";

  return (
    <Card className="mb-6 backdrop-blur-xl bg-card/90 border-primary/30 shadow-elevation-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>
              {isRTL ? "بيانات الاتصال" : "Contact Data"}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">{contextNote}</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving
              ? isRTL
                ? "جاري الحفظ..."
                : "Saving..."
              : isRTL
                ? "حفظ البيانات"
                : "Save Data"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              <Mail className="h-4 w-4 inline mr-2" />
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>
              <Phone className="h-4 w-4 inline mr-2" />
              {isRTL ? "هاتف عام" : "General Phone"}
            </Label>
            <Input
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
        </div>

        {renderPhoneList(
          isRTL ? "أرقام المبيعات" : "Sales Phone Numbers",
          "phoneNumbersSales",
          "phone",
        )}
        {renderPhoneList(
          isRTL ? "أرقام الإدارة" : "Administration Phone Numbers",
          "phoneNumbersAdmin",
          "phone",
        )}
        {renderPhoneList(
          isRTL ? "فاكس المبيعات" : "Sales Fax Numbers",
          "faxNumbersSales",
          "fax",
          "Sales Fax",
        )}
        {renderPhoneList(
          isRTL ? "فاكس الإدارة" : "Administration Fax Numbers",
          "faxNumbersAdmin",
          "fax",
          "Admin Fax",
        )}

        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label>
              <MapPin className="h-4 w-4 inline mr-2" />
              {isRTL ? "المقر الرئيسي" : "Head Office"} (EN)
            </Label>
            <Input
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>
              <MapPin className="h-4 w-4 inline mr-2" />
              {isRTL ? "المقر الرئيسي" : "Head Office"} (AR)
            </Label>
            <Input
              value={data.addressAr}
              onChange={(e) => setData({ ...data, addressAr: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? "مكتب القاهرة" : "Cairo Office"} (EN)</Label>
            <Input
              value={data.cairoAddress}
              onChange={(e) => setData({ ...data, cairoAddress: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? "مكتب القاهرة" : "Cairo Office"} (AR)</Label>
            <Input
              value={data.cairoAddressAr}
              onChange={(e) => setData({ ...data, cairoAddressAr: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              <Clock className="h-4 w-4 inline mr-2" />
              {isRTL ? "ساعات العمل" : "Working Hours"} (EN)
            </Label>
            <Input
              value={data.workingHours}
              onChange={(e) => setData({ ...data, workingHours: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>
              <Clock className="h-4 w-4 inline mr-2" />
              {isRTL ? "ساعات العمل" : "Working Hours"} (AR)
            </Label>
            <Input
              value={data.workingHoursAr}
              onChange={(e) => setData({ ...data, workingHoursAr: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={data.facebook}
              onChange={(e) => setData({ ...data, facebook: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input
              value={data.linkedin}
              onChange={(e) => setData({ ...data, linkedin: e.target.value })}
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={data.whatsapp}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              placeholder="https://wa.me/..."
              className="bg-muted/50 border-border text-foreground"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDataEditor;

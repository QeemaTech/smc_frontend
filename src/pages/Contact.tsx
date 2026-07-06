import { useState } from 'react';
import { MapPin, Mail, Clock, Building, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings, usePageHero, usePageContent } from '@/hooks/usePageContent';
import { useCreateContact } from '@/hooks/useApi';
import { toast } from 'sonner';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import mnFacility from '@/assets/manganese/portfolio14.jpg';
import PhoneNumbers from '@/components/PhoneNumbers';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';

const Contact = () => {
  const { t, language, isRTL } = useLanguage();
  const settings = useSettings();
  const createContact = useCreateContact();
  const hero = usePageHero('contact', {
    badge: t('contactSubtitle'),
    title: t('contactUs'),
    description: t('contactHeroBody'),
  });
  const contactFormTitle = usePageContent('contact', 'formTitle', t('contactFormTitle'));
  const contactFormSubtitle = usePageContent('contact', 'formSubtitle', t('contactFormSectionLabel'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  // Combine all phone numbers for display
  const allPhones = [
    ...(settings.phoneNumbersSales || []),
    ...(settings.faxNumbersSales || []),
    ...(settings.phoneNumbersAdmin || []),
    ...(settings.faxNumbersAdmin || []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      toast.error(
        isRTL
          ? 'يرجى تعبئة الاسم والبريد الإلكتروني والرسالة'
          : 'Please fill in your name, email, and message',
      );
      return;
    }

    try {
      await createContact.mutateAsync({
        name,
        email,
        phone,
        message,
      });
      toast.success(t('contactMessageSuccess'));
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Contact form submission failed:', error);
      const apiMessage = error?.message?.replace(/^API Error:\s*/i, '') || '';
      toast.error(
        isRTL
          ? `فشل في إرسال الرسالة${apiMessage ? `: ${apiMessage}` : ''}`
          : `Failed to send message${apiMessage ? `: ${apiMessage}` : ''}`,
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { 
      icon: MapPin, 
      label: t('contactHeadOfficeLabel'), 
      value: settings.address || t('contactHeadOfficeValue'),
      isPhoneSection: false
    },
    { 
      icon: Mail, 
      label: t('contactEmailLabel'), 
      value: settings.email || 'info@smc-eg.com',
      isPhoneSection: false
    },
    { 
      icon: Clock, 
      label: t('workingHours'),
      value: settings.workingHours || t('workingHoursValue'),
      isPhoneSection: false
    },
  ];

  const highlights = [
    { title: t('contactHighlight1Title'), subtitle: t('contactHighlight1Subtitle') },
    { title: t('contactHighlight2Title'), subtitle: t('contactHighlight2Subtitle') },
    { title: t('contactHighlight3Title'), subtitle: t('contactHighlight3Subtitle') },
  ];

  return (
    <div className="bg-background">
      <PublicPageHeader
        variant="brand"
        icon="mail"
        eyebrow={hero.badge || undefined}
        title={hero.title}
        description={hero.description}
        backgroundImage={heroSlideOne}
        backgroundAlt="SMC facility"
        aside={
          <div className="rounded-[24px] border border-white/30 bg-white/10 p-6 backdrop-blur md:p-8">
            <div className="space-y-4 text-sm text-white/80">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-white/20 bg-white/5 p-4"
                >
                  <item.icon className="h-5 w-5 shrink-0 text-white" />
                  <div className="flex-1">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-white/60">{item.label}</p>
                    <p className="text-base">{item.value}</p>
                  </div>
                </div>
              ))}
              {allPhones.length > 0 && (
                <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-start">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/60">
                    {t('phoneAndFaxNumbers')}
                  </p>
                  <PhoneNumbers
                    phones={allPhones}
                    className="space-y-2"
                    textClassName="text-white/80"
                    showLabels={true}
                  />
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-white/30 bg-white/10 p-4 text-center">
              <p className="text-2xl font-semibold">{item.title}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </PublicPageHeader>

      <PublicShell className="mt-8 pb-12 md:pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="rounded-[32px] border border-border shadow-2xl">
            <CardContent className="p-10">
              <div className="mb-8 space-y-2 text-start">
                <p className="text-sm uppercase tracking-[0.4em] text-primary">{contactFormSubtitle}</p>
                <h2 className="text-3xl font-semibold">{contactFormTitle}</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 text-start">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t('name')}
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t('email')}
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {t('phone')}
                  </label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t('message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#204393] text-white hover:bg-[#1b356f]"
                  disabled={createContact.isPending}
                >
                  <Send className="me-2 h-4 w-4" />
                  {t('send')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[32px] border border-border shadow-xl">
              <CardContent className="space-y-4 p-8">
                <div className="flex items-center gap-3 text-primary">
                  <Building className="h-5 w-5" />
                  <p className="text-sm uppercase tracking-[0.4em]">{t('contactFactoryLabel')}</p>
                </div>
                <p className="text-lg font-semibold text-foreground">{t('contactFactoryTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('contactFactoryDescription')}</p>
                <img
                  src={mnFacility}
                  alt="Abu Zenima industrial facility"
                  className="h-48 w-full rounded-2xl object-cover"
                />
              </CardContent>
            </Card>
            <Card className="rounded-[32px] border border-border shadow-xl">
              <CardContent className="space-y-4 p-8">
                <h3 className="text-lg font-semibold">{t('contactProcessTitle')}</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li>• {t('contactProcessStep1')}</li>
                  <li>• {t('contactProcessStep2')}</li>
                  <li>• {t('contactProcessStep3')}</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicShell>
    </div>
  );
};

export default Contact;

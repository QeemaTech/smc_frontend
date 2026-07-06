import { useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, FileText, Headphones, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { usePageHero } from '@/hooks/usePageContent';
import heroSlideTwo from '@/assets/manganese/two.jpg';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';

const Complaints = () => {
  const { t, isRTL } = useLanguage();
  const hero = usePageHero('complaints', {
    badge: t('complaintsBadge'),
    title: t('complaintsTitle'),
    description: t('complaintsDescription'),
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticket: '',
    category: '',
    message: '',
  });

  const stats = [
    { label: t('complaintsStat1Label'), value: t('complaintsStat1Value') },
    { label: t('complaintsStat2Label'), value: t('complaintsStat2Value') },
    { label: t('complaintsStat3Label'), value: t('complaintsStat3Value') },
  ];

  const complaintCategories = [
    { id: 'quality', label: t('complaintCategoryQuality') },
    { id: 'delivery', label: t('complaintCategoryDelivery') },
    { id: 'billing', label: t('complaintCategoryBilling') },
    { id: 'other', label: t('complaintCategoryOther') },
  ];

  const steps = [
    { icon: FileText, title: t('complaintsStep1Title'), description: t('complaintsStep1Desc') },
    { icon: Headphones, title: t('complaintsStep2Title'), description: t('complaintsStep2Desc') },
    { icon: CheckCircle2, title: t('complaintsStep3Title'), description: t('complaintsStep3Desc') },
  ];

  const hotlineNumbers = ['+20 122 000 4567', '+20 100 555 9834'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t('complaintsToastTitle'), description: t('complaintsToastDescription') });
    setFormData({ name: '', email: '', phone: '', ticket: '', category: '', message: '' });
  };

  return (
    <div className="bg-background">
      <PublicPageHeader
        variant="muted"
        icon="support_agent"
        eyebrow={hero.badge || undefined}
        title={hero.title}
        description={hero.description}
        backgroundImage={heroSlideTwo}
        backgroundAlt={hero.title}
        aside={
          <Card className="w-full rounded-[24px] border border-border/60 bg-white/90 shadow-elevation-2">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="space-y-1 text-start">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t('complaintsSlaTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('complaintsSlaNote')}</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{t('complaintsAttachNote')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Building2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{t('customerRelationsTeam')}</p>
                  <p>{t('abuZinimaCairo')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/70 bg-white/80 p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </PublicPageHeader>

      <PublicShell className="grid gap-10 py-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-[32px] border border-border shadow-2xl">
          <CardContent className="p-10">
            <div className="mb-8 space-y-2 text-start">
              <p className="text-sm uppercase tracking-[0.4em] text-primary">{t('complaintsFormTitle')}</p>
              <p className="text-muted-foreground">{t('complaintsFormSubtitle')}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 text-start">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="name"
                  placeholder={t('complaintsFormName')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder={t('complaintsFormEmail')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="phone"
                  placeholder={t('complaintsFormPhone')}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  name="ticket"
                  placeholder={t('complaintsFormTicket')}
                  value={formData.ticket}
                  onChange={handleInputChange}
                />
              </div>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('complaintsFormCategory')} />
                </SelectTrigger>
                <SelectContent align="start">
                  {complaintCategories.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                name="message"
                placeholder={t('complaintsFormMessage')}
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                required
              />
              <Button type="submit" size="lg" className="w-full bg-[#204393] text-white hover:bg-[#1b356f]">
                <Send className={cn('me-2 h-4 w-4', isRTL && 'rotate-180')} />
                {t('complaintsFormSubmit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[32px] border border-border shadow-xl">
            <CardContent className="space-y-4 p-8">
              <h3 className="text-lg font-semibold">{t('complaintsStepsTitle')}</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-border/70 p-4 text-start"
                  >
                    <step.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border border-border shadow-xl">
            <CardContent className="space-y-3 p-8">
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-primary" />
                <p className="text-sm uppercase tracking-[0.4em] text-primary">{t('complaintsHotlineTitle')}</p>
              </div>
              <div className="space-y-2">
                {hotlineNumbers.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="block text-lg font-semibold text-foreground ltr-nums">
                    {phone}
                  </a>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{t('complaintsHotlineNote')}</p>
            </CardContent>
          </Card>
        </div>
      </PublicShell>
    </div>
  );
};

export default Complaints;

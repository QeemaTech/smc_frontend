import { useState, useRef } from 'react';
import { FileText, Calendar, AlertCircle, Upload, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { pickLocalized } from '@/lib/localize';
import { useTenders, useSubmitTender } from '@/hooks/useApi';
import { toast } from 'sonner';
import { usePageHero, usePageSections } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { ContentCard } from '@/components/public/cards';
import { PageSections } from '@/components/public/ContentSection';

const Tenders = () => {
  const { t, language } = useLanguage();
  const sections = usePageSections('tenders');
  const hero = usePageHero('tenders', {
    title: t('tenders'),
    description: t('tendersSubtitle'),
  });
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitTender = useSubmitTender();

  const { data: tenders = [], isLoading } = useTenders();
  const activeTenders = tenders.filter((tender) => tender.status === 'active');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;

    if (files.length === 0) {
      toast.error(t('attachAtLeastOneFile'));
      return;
    }

    try {
      const filePromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Files = await Promise.all(filePromises);

      await submitTender.mutateAsync({
        tenderId: selectedTender.id,
        submission: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          files: base64Files,
        },
      });

      toast.success(t('submissionSentSuccess'));
      setIsDialogOpen(false);
      setFormData({ companyName: '', contactName: '', email: '', phone: '' });
      setFiles([]);
    } catch {
      toast.error(t('submissionFailed'));
    }
  };

  const handleOpenDialog = (tender: any) => {
    setSelectedTender(tender);
    setIsDialogOpen(true);
  };

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="gavel"
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="space-y-12 py-8 md:py-10">
        <div className="mb-12 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className="text-start">
              <h3 className="font-semibold text-lg mb-2">{t('tenderGuidelinesTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('tenderGuidelinesText')}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('loadingTenders')}</p>
          </div>
        ) : (
          <div className="space-y-6 mb-16">
            {activeTenders.map((tender, index) => (
              <ContentCard key={tender.id} index={index} className="p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="text-start">
                    <h3 className="mb-2 text-2xl font-medium">{pickLocalized(tender, 'title', language)}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        T-{tender.id}
                      </span>
                      <span className="rounded-full bg-primary-container px-3 py-1 text-primary">
                        {pickLocalized(tender, 'category', language)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t('deadlineLabel')}
                      <span className="ltr-nums">{new Date(tender.deadline).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-start text-muted-foreground">{pickLocalized(tender, 'description', language)}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {tender.documentFile && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = tender.documentFile!;
                        link.download = tender.documentFileName || `tender-${tender.id}.pdf`;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 me-2" />
                      {t('downloadTenderDocument')}
                    </Button>
                  )}
                  <Button className="ms-auto" onClick={() => handleOpenDialog(tender)}>
                    {t('submitProposal')}
                  </Button>
                </div>
              </ContentCard>
            ))}
            {activeTenders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('noActiveTenders')}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-muted rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('needMoreInformation')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('needMoreInformationDesc')}</p>
          <Button asChild size="lg">
            <Link to={getLocalizedLink('/contact', language)}>{t('contactUs')}</Link>
          </Button>
        </div>

        <PageSections sections={sections} />
      </PublicShell>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('submitTenderProposal')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('companyNameLabel')}</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('contactNameLabel')}</Label>
              <Input
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('email')}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('phone')}</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('attachedFilesLabel')}</Label>
              <Input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="h-4 w-4 me-2" />
                {t('chooseFiles')}
              </Button>
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={submitTender.isPending}>
                {t('submit')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tenders;

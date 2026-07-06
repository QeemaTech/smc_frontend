import { useState, useEffect } from 'react';
import { Save, Search, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SEOSettings {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  keywords: string;
  keywordsAr: string;
  ogTitle: string;
  ogTitleAr: string;
  ogDescription: string;
  ogDescriptionAr: string;
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
  canonicalUrl: string;
  robots: string;
  author: string;
  language: string;
}

const SEOSettings = () => {
  const { t, isRTL } = useLanguage();
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: 'SMC - Sinai Manganese Company | Egypt\'s Leading Manganese Producer',
    titleAr: 'شركة سيناء للمنجنيز | أكبر منتج للمنجنيز في مصر',
    description: 'Sinai Manganese Co. is Egypt\'s first and largest manganese ore producer, established 1957. Producing high-quality Silicomanganese at Abu-Zinima, Sinai.',
    descriptionAr: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر، تأسست عام 1957. تنتج سيليكون منجنيز عالي الجودة في أبو زنيمة، سيناء.',
    keywords: 'manganese, Egypt, Sinai, mining, Silicomanganese, industrial minerals',
    keywordsAr: 'منجنيز، مصر، سيناء، تعدين، سيليكون منجنيز، معادن صناعية',
    ogTitle: 'SMC - Sinai Manganese Company',
    ogTitleAr: 'شركة سيناء للمنجنيز',
    ogDescription: 'Egypt\'s first and largest manganese ore producer since 1957',
    ogDescriptionAr: 'أول وأكبر منتج لخام المنجنيز في مصر منذ عام 1957',
    ogImage: '/favicon.png',
    twitterCard: 'summary_large_image',
    twitterSite: '@SMCEgypt',
    canonicalUrl: '',
    robots: 'index, follow',
    author: 'Sinai Manganese Company',
    language: 'en, ar',
  });

  useEffect(() => {
    // Load saved SEO settings
    const saved = localStorage.getItem('seoSettings');
    if (saved) {
      setSeoSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('seoSettings', JSON.stringify(seoSettings));
    
    // Update document meta tags
    if (typeof document !== 'undefined') {
      document.title = seoSettings.title;
      
      // Update meta tags
      const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attribute, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      updateMetaTag('description', seoSettings.description);
      updateMetaTag('keywords', seoSettings.keywords);
      updateMetaTag('author', seoSettings.author);
      updateMetaTag('robots', seoSettings.robots);
      updateMetaTag('og:title', seoSettings.ogTitle, 'property');
      updateMetaTag('og:description', seoSettings.ogDescription, 'property');
      updateMetaTag('og:image', seoSettings.ogImage, 'property');
      updateMetaTag('twitter:card', seoSettings.twitterCard);
      updateMetaTag('twitter:site', seoSettings.twitterSite);
      updateMetaTag('twitter:image', seoSettings.ogImage);
      
      if (seoSettings.canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', seoSettings.canonicalUrl);
      }
    }

    toast.success(t('seoSavedSuccess'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('seoSettings') || 'SEO Settings'}</h2>
          <p className="text-muted-foreground mt-1">{t('manageSeoSettings')}</p>
        </div>
        <Button onClick={handleSave} >
          <Save className="h-4 w-4 mr-2" />
          {t('save') || 'Save'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="backdrop-blur-xl bg-card/90 border-border">
          <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Search className="h-4 w-4 mr-2" />
            {t('basicSeo')}
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4 mr-2" />
            {t('socialMediaTab')}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            {t('advancedTab')}
          </TabsTrigger>
        </TabsList>

        {/* Basic SEO */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('pageTitleLabel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('titleEnglish')}</Label>
                <Input
                  value={seoSettings.title}
                  onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.title.length}/60 characters (Recommended: 50-60)
                </p>
              </div>
              <div className="space-y-2">
                <Label>{t('titleArabic')}</Label>
                <Input
                  value={seoSettings.titleAr}
                  onChange={(e) => setSeoSettings({ ...seoSettings, titleAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="عنوان الصفحة لمحركات البحث"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('metaDescriptionLabel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('descriptionEnglish')}</Label>
                <Textarea
                  value={seoSettings.description}
                  onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  rows={3}
                  placeholder="Brief description of your website"
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.description.length}/160 characters (Recommended: 150-160)
                </p>
              </div>
              <div className="space-y-2">
                <Label>{t('descriptionArabic')}</Label>
                <Textarea
                  value={seoSettings.descriptionAr}
                  onChange={(e) => setSeoSettings({ ...seoSettings, descriptionAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  rows={3}
                  placeholder="وصف مختصر لموقعك"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('keywordsLabel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('keywordsEnglish')}</Label>
                <Input
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('keywordsArabic')}</Label>
                <Input
                  value={seoSettings.keywordsAr}
                  onChange={(e) => setSeoSettings({ ...seoSettings, keywordsAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="كلمة1، كلمة2، كلمة3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('openGraphLabel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('ogTitleEnglish')}</Label>
                <Input
                  value={seoSettings.ogTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogTitle: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ogTitleArabic')}</Label>
                <Input
                  value={seoSettings.ogTitleAr}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogTitleAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ogDescriptionEnglish')}</Label>
                <Textarea
                  value={seoSettings.ogDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogDescription: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ogDescriptionArabic')}</Label>
                <Textarea
                  value={seoSettings.ogDescriptionAr}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogDescriptionAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ogImageUrl')}</Label>
                <div className="flex gap-2">
                  <Input
                    value={seoSettings.ogImage}
                    onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                    className="bg-muted/50 border-border text-foreground"
                    placeholder="/favicon.png or full URL"
                  />
                  {seoSettings.ogImage && (
                    <div className="w-16 h-16 rounded border border-border overflow-hidden">
                      <img src={seoSettings.ogImage} alt="OG" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 1200x630px</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('twitterCardLabel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('twitterCardType')}</Label>
                <select
                  value={seoSettings.twitterCard}
                  onChange={(e) => setSeoSettings({ ...seoSettings, twitterCard: e.target.value })}
                  className="w-full bg-muted/50 border border-border text-foreground rounded-md px-3 py-2"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('twitterSiteLabel')}</Label>
                <Input
                  value={seoSettings.twitterSite}
                  onChange={(e) => setSeoSettings({ ...seoSettings, twitterSite: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="@SMCEgypt"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced" className="space-y-4">
          <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
            <CardHeader>
              <CardTitle>{t('advancedSeo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('canonicalUrlLabel')}</Label>
                <Input
                  value={seoSettings.canonicalUrl}
                  onChange={(e) => setSeoSettings({ ...seoSettings, canonicalUrl: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="https://yourdomain.com"
                />
                <p className="text-xs text-muted-foreground">Leave empty to use current page URL</p>
              </div>
              <div className="space-y-2">
                <Label>{t('robotsMetaLabel')}</Label>
                <Input
                  value={seoSettings.robots}
                  onChange={(e) => setSeoSettings({ ...seoSettings, robots: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="index, follow"
                />
                <p className="text-xs text-muted-foreground">Options: index/noindex, follow/nofollow</p>
              </div>
              <div className="space-y-2">
                <Label>{t('authorLabel')}</Label>
                <Input
                  value={seoSettings.author}
                  onChange={(e) => setSeoSettings({ ...seoSettings, author: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('languageLabel')}</Label>
                <Input
                  value={seoSettings.language}
                  onChange={(e) => setSeoSettings({ ...seoSettings, language: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                  placeholder="en, ar"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOSettings;


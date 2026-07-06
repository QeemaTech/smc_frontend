import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageHero, usePageContent } from '@/hooks/usePageContent';
import { MaterialIcon } from '@/components/MaterialIcon';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';

const About = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const hash = location.hash.replace('#', '');
  const isVisionPage = hash === 'vision';

  const defaultHero = usePageHero('about', {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  });

  const missionTitle = usePageContent('about', 'mission', 'Our Mission');
  const missionText = usePageContent(
    'about',
    'missionText',
    'To be the leading producer of manganese products in Egypt and the region.',
  );
  const visionTitle = usePageContent('about', 'vision', t('companyVision'));
  const visionText = usePageContent(
    'about',
    'visionText',
    'To expand our operations and serve more industries globally.',
  );
  const valuesTitle = usePageContent('about', 'values', 'Our Values');
  const valuesText = usePageContent(
    'about',
    'valuesText',
    'Quality, Innovation, Sustainability, and Excellence.',
  );

  const hero = isVisionPage
    ? { badge: '', title: visionTitle, description: visionText }
    : defaultHero;

  const headerIcon = isVisionPage ? 'visibility' : 'info';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  const features = [
    {
      iconName: 'factory',
      title: t('aboutFeatureModernFacilities'),
      description: t('aboutFeatureModernFacilitiesDesc'),
    },
    {
      iconName: 'bolt',
      title: t('aboutFeaturePowerStation'),
      description: t('aboutFeaturePowerStationDesc'),
    },
    {
      iconName: 'group',
      title: t('aboutFeatureEmployees'),
      description: t('aboutFeatureEmployeesDesc'),
    },
    {
      iconName: 'workspace_premium',
      title: t('aboutFeatureIndustryLeader'),
      description: t('aboutFeatureIndustryLeaderDesc'),
    },
  ];

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon={headerIcon}
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="space-y-12 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-[24px] border border-border/60 shadow-[var(--md-elevation-2)] transition-all hover:-translate-y-1 hover:shadow-[var(--md-elevation-3)]"
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <MaterialIcon
                    name={feature.iconName}
                    size={28}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-[32px] border border-border/60 bg-muted/70 p-8 shadow-[var(--md-elevation-2)] md:p-12">
          <h2 className="text-3xl font-bold mb-6">{t('companyHistory')}</h2>
          <div className="space-y-4 text-muted-foreground text-start">
            <p className="text-lg leading-relaxed">
              {t('aboutHistoryParagraph1')}
            </p>
            <p className="text-lg leading-relaxed">
              {t('aboutHistoryParagraph2')}
            </p>
            <p className="text-lg leading-relaxed">
              {t('aboutHistoryParagraph3')}
            </p>
          </div>
        </div>

        <div className="scroll-mt-24 rounded-[32px] border border-border/60 bg-background p-8 shadow-[var(--md-elevation-2)] md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-start">{missionTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {missionText}
          </p>
        </div>

        <div
          id="vision"
          className="scroll-mt-24 rounded-[32px] border border-border/60 bg-muted/40 p-8 shadow-[var(--md-elevation-2)] md:p-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-start">{visionTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {visionText}
          </p>
        </div>

        <div className="scroll-mt-24 rounded-[32px] border border-border/60 bg-background p-8 shadow-[var(--md-elevation-2)] md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-start">{valuesTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {valuesText}
          </p>
        </div>
      </PublicShell>
    </div>
  );
};

export default About;

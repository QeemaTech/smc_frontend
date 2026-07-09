import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageHero, usePageContent, usePageSections } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { FeatureCard, ContentCard } from '@/components/public/cards';
import { PageSections } from '@/components/public/ContentSection';

const About = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const hash = location.hash.replace('#', '');
  const isVisionPage = hash === 'vision';
  const sections = usePageSections('about');

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <ContentCard className="p-8 md:p-12 bg-muted/70">
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
        </ContentCard>

        <ContentCard className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-start">{missionTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {missionText}
          </p>
        </ContentCard>

        <ContentCard
          id="vision"
          className="scroll-mt-24 p-8 md:p-12 bg-muted/40"
        >
          <h2 className="text-3xl font-bold mb-4 text-start">{visionTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {visionText}
          </p>
        </ContentCard>

        <ContentCard className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-start">{valuesTitle}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-start">
            {valuesText}
          </p>
        </ContentCard>

        <PageSections sections={sections} />
      </PublicShell>
    </div>
  );
};

export default About;

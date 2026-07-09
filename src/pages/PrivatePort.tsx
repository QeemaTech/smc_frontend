import { Ship, Package, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent, usePageHero, usePageSections } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { ContentCard } from '@/components/public/cards';
import { PageSections } from '@/components/public/ContentSection';

const PrivatePort = () => {
  const { t } = useLanguage();
  const sections = usePageSections('privatePort');
  const hero = usePageHero('privatePort', {
    title: t('privatePort'),
    description: t('privatePortSubtitle'),
  });

  const feature1Title = usePageContent('privatePort', 'feature1Title', t('portFeatureModernFacilities'));
  const feature1Desc = usePageContent('privatePort', 'feature1Desc', t('portFeatureModernFacilitiesDesc'));
  const feature2Title = usePageContent('privatePort', 'feature2Title', t('portFeatureHighCapacity'));
  const feature2Desc = usePageContent('privatePort', 'feature2Desc', t('portFeatureHighCapacityDesc'));
  const feature3Title = usePageContent('privatePort', 'feature3Title', t('portFeatureStrategicLocation'));
  const feature3Desc = usePageContent('privatePort', 'feature3Desc', t('portFeatureStrategicLocationDesc'));
  const feature4Title = usePageContent('privatePort', 'feature4Title', t('portFeatureSafetyStandards'));
  const feature4Desc = usePageContent('privatePort', 'feature4Desc', t('portFeatureSafetyStandardsDesc'));

  const capabilitiesTitle = usePageContent('privatePort', 'capabilitiesTitle', t('portCapabilities'));
  const loadingSectionTitle = usePageContent('privatePort', 'loadingSectionTitle', t('portLoadingShipping'));
  const storageSectionTitle = usePageContent('privatePort', 'storageSectionTitle', t('portStorageHandling'));

  const loadingItem1 = usePageContent('privatePort', 'loadingItem1', t('portLoadingItem1'));
  const loadingItem2 = usePageContent('privatePort', 'loadingItem2', t('portLoadingItem2'));
  const loadingItem3 = usePageContent('privatePort', 'loadingItem3', t('portLoadingItem3'));
  const loadingItem4 = usePageContent('privatePort', 'loadingItem4', t('portLoadingItem4'));

  const storageItem1 = usePageContent('privatePort', 'storageItem1', t('portStorageItem1'));
  const storageItem2 = usePageContent('privatePort', 'storageItem2', t('portStorageItem2'));
  const storageItem3 = usePageContent('privatePort', 'storageItem3', t('portStorageItem3'));
  const storageItem4 = usePageContent('privatePort', 'storageItem4', t('portStorageItem4'));

  const features = [
    { icon: Ship, title: feature1Title, description: feature1Desc },
    { icon: Package, title: feature2Title, description: feature2Desc },
    { icon: TrendingUp, title: feature3Title, description: feature3Desc },
    { icon: Shield, title: feature4Title, description: feature4Desc },
  ];

  const loadingItems = [loadingItem1, loadingItem2, loadingItem3, loadingItem4];
  const storageItems = [storageItem1, storageItem2, storageItem3, storageItem4];

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="anchor"
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="space-y-12 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <ContentCard key={index} index={index} className="p-6 md:p-8">
              <feature.icon className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-2xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </ContentCard>
          ))}
        </div>

        <div>
          <h2 className="section-heading__title mb-8 text-center keep-center">{capabilitiesTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContentCard index={0} className="p-6 md:p-8">
              <h3 className="mb-4 text-xl font-medium">{loadingSectionTitle}</h3>
              <ul className="space-y-3 text-start">
                {loadingItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
            <ContentCard index={1} className="p-6 md:p-8">
              <h3 className="mb-4 text-xl font-medium">{storageSectionTitle}</h3>
              <ul className="space-y-3 text-start">
                {storageItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </div>
        </div>

        <PageSections sections={sections} />
      </PublicShell>
    </div>
  );
};

export default PrivatePort;

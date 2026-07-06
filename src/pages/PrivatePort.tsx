import { Ship, Package, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageHero } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { ContentCard } from '@/components/public/cards';

const PrivatePort = () => {
  const { t } = useLanguage();
  const hero = usePageHero('privatePort', {
    title: t('privatePort'),
    description: t('privatePortSubtitle'),
  });

  const features = [
    {
      icon: Ship,
      title: t('portFeatureModernFacilities'),
      description: t('portFeatureModernFacilitiesDesc'),
    },
    {
      icon: Package,
      title: t('portFeatureHighCapacity'),
      description: t('portFeatureHighCapacityDesc'),
    },
    {
      icon: TrendingUp,
      title: t('portFeatureStrategicLocation'),
      description: t('portFeatureStrategicLocationDesc'),
    },
    {
      icon: Shield,
      title: t('portFeatureSafetyStandards'),
      description: t('portFeatureSafetyStandardsDesc'),
    },
  ];

  const loadingItems = [
    t('portLoadingItem1'),
    t('portLoadingItem2'),
    t('portLoadingItem3'),
    t('portLoadingItem4'),
  ];

  const storageItems = [
    t('portStorageItem1'),
    t('portStorageItem2'),
    t('portStorageItem3'),
    t('portStorageItem4'),
  ];

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
          <h2 className="section-heading__title mb-8 text-center keep-center">{t('portCapabilities')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContentCard index={0} className="p-6 md:p-8">
              <h3 className="mb-4 text-xl font-medium">{t('portLoadingShipping')}</h3>
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
              <h3 className="mb-4 text-xl font-medium">{t('portStorageHandling')}</h3>
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
      </PublicShell>
    </div>
  );
};

export default PrivatePort;

import { Ship, Package, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageHero } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">{t('portCapabilities')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('portLoadingShipping')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-start">
                  {loadingItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('portStorageHandling')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-start">
                  {storageItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicShell>
    </div>
  );
};

export default PrivatePort;

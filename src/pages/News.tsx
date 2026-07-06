import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { resolveImageSrc } from '@/lib/utils';
import { pickLocalized } from '@/lib/localize';
import { usePageHero } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { NewsCard } from '@/components/public/cards';
import { useNews } from '@/hooks/useApi';
import slideOne from '@/assets/manganese/one.jpeg';
import slideTwo from '@/assets/manganese/two.jpg';
import slideThree from '@/assets/manganese/three.jpg';
import homeImage from '@/assets/manganese/home3-image3.jpg';
import portfolio14 from '@/assets/manganese/portfolio14.jpg';
import portfolio16 from '@/assets/manganese/portfolio16.jpg';

const News = () => {
  const { t, language } = useLanguage();
  const hero = usePageHero('news', {
    title: t('news'),
    description: t('newsPageSubtitle'),
  });
  const { data: news = [], isLoading: newsLoading } = useNews();

  const defaultImages = [slideOne, slideTwo, slideThree, homeImage, portfolio14, portfolio16];

  const newsItemsFromAPI = news
    .filter((n) => n.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => ({
      ...item,
      title: pickLocalized(item, 'title', language),
      excerpt: pickLocalized(item, 'content', language).substring(0, 150),
      category: pickLocalized(item, 'category', language),
      image: item.image,
    }));

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="newspaper"
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="py-8 md:py-10">
        {newsLoading ? (
          <div className="py-12 text-center keep-center">
            <p className="text-muted-foreground">{t('loadingNews')}</p>
          </div>
        ) : newsItemsFromAPI.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center keep-center animate-fade-in">
            <div className="mb-6 rounded-full bg-muted p-6">
              <Newspaper className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">{t('noNewsYet')}</h2>
            <p className="max-w-md text-muted-foreground">{t('noNewsYetDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItemsFromAPI.map((item, index) => (
              <NewsCard
                key={item.id}
                to={getLocalizedLink(`/news/${item.id}`, language)}
                imageSrc={resolveImageSrc(item.image, {
                  fallback: defaultImages[item.id % defaultImages.length],
                })}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category}
                date={new Date(item.date).toLocaleDateString()}
                index={index}
              />
            ))}
          </div>
        )}
      </PublicShell>
    </div>
  );
};

export default News;

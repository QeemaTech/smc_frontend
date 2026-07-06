import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { cn, resolveImageSrc } from '@/lib/utils';
import { pickLocalized } from '@/lib/localize';
import { usePageHero } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { useNews } from '@/hooks/useApi';
import slideOne from '@/assets/manganese/one.jpeg';
import slideTwo from '@/assets/manganese/two.jpg';
import slideThree from '@/assets/manganese/three.jpg';
import homeImage from '@/assets/manganese/home3-image3.jpg';
import portfolio14 from '@/assets/manganese/portfolio14.jpg';
import portfolio16 from '@/assets/manganese/portfolio16.jpg';

const News = () => {
  const { t, isRTL, language } = useLanguage();
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('loadingNews')}</p>
          </div>
        ) : newsItemsFromAPI.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted">
              <Newspaper className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">{t('noNewsYet')}</h2>
            <p className="text-muted-foreground text-center max-w-md">{t('noNewsYetDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItemsFromAPI.map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden bg-white hover:shadow-xl transition-all">
                <div className="group relative h-48 w-full overflow-hidden">
                  <img
                    src={resolveImageSrc(item.image, {
                      fallback: defaultImages[item.id % defaultImages.length],
                    })}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 start-3 text-xs uppercase tracking-[0.4em] text-white">
                    {item.category}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-primary">{item.category}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="ltr-nums">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{item.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link to={getLocalizedLink(`/news/${item.id}`, language)}>
                      {t('readMore')}
                      <ArrowRight
                        className={cn(
                          'ms-2 h-4 w-4 group-hover:translate-x-1 transition-transform',
                          isRTL && 'rotate-180 group-hover:-translate-x-1',
                        )}
                      />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </PublicShell>
    </div>
  );
};

export default News;

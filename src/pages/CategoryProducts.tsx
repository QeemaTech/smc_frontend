import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn, resolveImageSrc } from '@/lib/utils';
import { formatMessage, pickLocalized } from '@/lib/localize';
import { ArrowLeft, Loader2, Factory, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import heroSlideTwo from '@/assets/manganese/two.jpg';
import heroSlideThree from '@/assets/manganese/three.jpg';
import mnHome from '@/assets/manganese/home3-image3.jpg';
import mnPortfolio14 from '@/assets/manganese/portfolio14.jpg';
import mnPortfolio16 from '@/assets/manganese/portfolio16.jpg';

const productFallbackImages = [
  heroSlideOne,
  heroSlideTwo,
  heroSlideThree,
  mnHome,
  mnPortfolio14,
  mnPortfolio16,
];

const CategoryProducts = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const mainCategory = categories.find(cat =>
    cat.slug === categorySlug && !cat.parent_id && cat.status === 'active'
  );

  const categoryProducts = products.filter(p => {
    if (p.status !== 'active') return false;
    const productCategoryId = p.category_id ?? p.categoryId;
    if (productCategoryId && mainCategory) {
      return productCategoryId === mainCategory.id;
    }
    if (mainCategory) {
      const categoryMatch =
        (p.category === 'Mining' && mainCategory.slug === 'mining') ||
        (p.category === 'Industrial' && mainCategory.slug === 'industrial') ||
        (p.category_slug === mainCategory.slug);
      return categoryMatch;
    }
    return false;
  });

  const categoryName = mainCategory ? pickLocalized(mainCategory, 'name', language) : '';

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!mainCategory) {
    return (
      <div className="pb-12 md:pb-16">
        <PublicPageHeader title={t('categoryNotFound')} centered />
        <PublicShell className="flex flex-col items-center py-10 text-center">
          <p className="text-muted-foreground mb-4">{t('categoryNotFound')}</p>
          <Button onClick={() => navigate(getLocalizedLink('/products', language))}>
            {t('backToProducts')}
          </Button>
        </PublicShell>
      </div>
    );
  }

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="category"
        eyebrow={categoryName}
        title={t('productsHeading')}
        description={formatMessage(t('discoverProductsIn'), { category: categoryName })}
        centered
        leading={
          <Button
            variant="ghost"
            onClick={() => navigate(getLocalizedLink('/products', language))}
            className="gap-2 px-0 hover:bg-transparent"
          >
            <ArrowLeft className={cn('h-4 w-4', isRTL && 'rotate-180')} />
            {t('backToProducts')}
          </Button>
        }
      />

      <PublicShell className="py-8 md:py-10">
        {categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">{t('noProductsYet')}</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {formatMessage(t('noProductsYetDesc'), { category: categoryName })}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mx-auto"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {categoryProducts.map((product) => {
              const imageSrc = resolveImageSrc(product.image, {
                cacheKey: product.updated_at || product.updatedAt,
                fallback: productFallbackImages[product.id % productFallbackImages.length],
              });
              const productName = pickLocalized(product, 'name', language);
              const productDescription = pickLocalized(product, 'description', language);

              return (
                <Link key={product.id} to={getLocalizedLink(`/product/${product.id}`, language)} className="block h-full">
                  <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-64 shrink-0 overflow-hidden bg-muted">
                      <img
                        src={imageSrc}
                        alt={productName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        key={`${product.id}-${product.updated_at || Date.now()}`}
                        onError={(event) => {
                          const target = event.currentTarget;
                          const fallback = productFallbackImages[product.id % productFallbackImages.length];
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                      <div className="absolute end-4 top-4 rounded-full bg-primary/90 p-3 backdrop-blur">
                        <Factory className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="flex flex-1 flex-col p-6">
                      <CardTitle className="mb-3 line-clamp-2 min-h-[3.5rem] text-2xl">
                        {productName}
                      </CardTitle>
                      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {productDescription}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </PublicShell>
    </div>
  );
};

export default CategoryProducts;

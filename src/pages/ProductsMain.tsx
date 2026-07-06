import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { usePageHero } from '@/hooks/usePageContent';
import { cn, resolveImageSrc } from '@/lib/utils';
import { pickLocalized } from '@/lib/localize';
import { Factory, Loader2, Package } from 'lucide-react';
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

const ProductsMain = () => {
  const { t, language, isRTL } = useLanguage();
  const hero = usePageHero('products', {
    badge: t('productsEyebrow'),
    title: t('ourProductsHeading'),
    description: t('productsPageIntro'),
  });
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mainCategories = useMemo(
    () => categories.filter((cat) => !cat.parent_id && cat.status === 'active'),
    [categories],
  );

  const matchesCategory = (product: any, categorySlug: string) => {
    if (categorySlug === 'all') return true;

    const productCategoryId = product.category_id ?? product.categoryId;
    if (productCategoryId) {
      const matchedCategory = mainCategories.find((cat) => cat.id === productCategoryId);
      if (matchedCategory) {
        return matchedCategory.slug === categorySlug;
      }
    }

    const normalizedSlug = String(product.category_slug ?? product.category ?? '')
      .trim()
      .toLowerCase();
    const normalizedName = String(product.category_name ?? product.category ?? '')
      .trim()
      .toLowerCase();

    return (
      normalizedSlug === categorySlug ||
      normalizedName === categorySlug ||
      normalizedName.includes(categorySlug) ||
      normalizedSlug.includes(categorySlug)
    );
  };

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.status !== 'active') return false;
      return matchesCategory(product, selectedCategory);
    });
  }, [products, selectedCategory, mainCategories]);

  const renderProductsGrid = (productsToRender: any[]) => {
    if (productsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">{t('noProductsFound')}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{t('noProductsFoundCategory')}</p>
        </div>
      );
    }

    return (
      <div
        className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {productsToRender.map((product) => {
          const imageSrc = resolveImageSrc(product.image, {
            cacheKey: product.updated_at || product.updatedAt,
            fallback: productFallbackImages[product.id % productFallbackImages.length],
          });
          const productName = pickLocalized(product, 'name', language);
          const productDescription = pickLocalized(product, 'description', language);

          return (
            <Link
              key={product.id}
              to={getLocalizedLink(`/product/${product.id}`, language)}
              className="block h-full"
            >
              <Card className="group flex h-full flex-col overflow-hidden border border-border/80 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-52 shrink-0 overflow-hidden bg-muted sm:h-56">
                  <img
                    src={imageSrc}
                    alt={productName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget;
                      const fallback = productFallbackImages[product.id % productFallbackImages.length];
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute end-3 top-3 rounded-full bg-primary/90 p-2.5 backdrop-blur-sm">
                    <Factory className="h-4 w-4 text-white" />
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col p-5 text-start">
                  <CardTitle className="mb-2 line-clamp-2 min-h-[3.25rem] text-xl font-semibold">
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
    );
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="inventory_2"
        eyebrow={hero.badge || undefined}
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="py-8 md:py-10">
        {mainCategories.length === 0 ? (
          <p className="text-start text-muted-foreground">{t('noCategoriesAvailable')}</p>
        ) : (
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <TabsList
              className={cn(
                'products-tab-list mb-4 h-auto w-full justify-start bg-muted/50',
                isRTL ? 'flex flex-wrap' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap',
              )}
            >
              <TabsTrigger value="all" className="products-tab-trigger">
                {t('all')}
              </TabsTrigger>
              {mainCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.slug}
                  className="products-tab-trigger"
                >
                  {pickLocalized(category, 'name', language)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderProductsGrid(visibleProducts)}
            </TabsContent>

            {mainCategories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-0">
                {renderProductsGrid(visibleProducts)}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </PublicShell>
    </div>
  );
};

export default ProductsMain;

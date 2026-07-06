import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { cn, resolveImageSrc } from '@/lib/utils';
import { formatMessage, pickLocalized } from '@/lib/localize';
import { getProductIconName } from '@/lib/productIcons';
import { ArrowLeft, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { ProductCard } from '@/components/public/cards';
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
        <PublicShell className="flex flex-col items-center py-10 text-center keep-center">
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
          <div className="flex flex-col items-center justify-center py-20 text-center keep-center animate-fade-in">
            <div className="mb-6 rounded-full bg-muted p-6">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">{t('noProductsYet')}</h2>
            <p className="max-w-md text-center text-muted-foreground">
              {formatMessage(t('noProductsYetDesc'), { category: categoryName })}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mx-auto"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {categoryProducts.map((product, index) => {
              const imageSrc = resolveImageSrc(product.image, {
                cacheKey: product.updated_at || product.updatedAt,
                fallback: productFallbackImages[product.id % productFallbackImages.length],
              });
              const productName = pickLocalized(product, 'name', language);
              const productDescription = pickLocalized(product, 'description', language);

              return (
                <ProductCard
                  key={product.id}
                  to={getLocalizedLink(`/product/${product.id}`, language)}
                  imageSrc={imageSrc}
                  imageAlt={productName}
                  title={productName}
                  description={productDescription}
                  iconName={getProductIconName(product.name ?? productName)}
                  index={index}
                  onImageError={(event) => {
                    const target = event.currentTarget;
                    const fallback = productFallbackImages[product.id % productFallbackImages.length];
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </PublicShell>
    </div>
  );
};

export default CategoryProducts;

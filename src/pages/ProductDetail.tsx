import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Factory, Sparkles, Beaker, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { getLocalizedSpecificationsTable } from '@/lib/productSpecifications';
import { cn, isValidImageValue, resolveImageSrc } from '@/lib/utils';
import { pickLocalized } from '@/lib/localize';
import { useProduct } from '@/hooks/useApi';
import { PublicDetailTitle, PublicShell } from '@/components/public/PublicShell';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { t, isRTL, language } = useLanguage();
  const { data: product, isLoading } = useProduct(parseInt(productId || '0'));
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);
  const [imageError, setImageError] = useState(false);

  const productGallery: string[] = useMemo(() => {
    if (!product?.gallery) {
      return [];
    }
    
    try {
      if (typeof product.gallery === 'string') {
        const parsed = JSON.parse(product.gallery);
        return Array.isArray(parsed) ? parsed : [];
      } else if (Array.isArray(product.gallery)) {
        return product.gallery.filter((img: any) => img && typeof img === 'string');
      }
    } catch (e) {
      console.error('Error parsing gallery:', e);
      return [];
    }
    
    return [];
  }, [product?.gallery]);
  
  const iconMap: Record<string, any> = {
    'Silicomanganese': Factory,
    'Silicomanganese Alloy': Factory,
    'Calcined Gypsum': Sparkles,
    'Kaolin': Beaker,
    'Silica Sand': Factory,
    'Raw Gypsum': Sparkles,
    'Iron Oxide': Flame,
    'Fine Manganese': Factory,
  };
  const ProductIcon = product ? iconMap[product.name] : Factory;
  const productImage = useMemo(
    () => (isValidImageValue(product?.image) ? product.image.trim() : undefined),
    [product?.image],
  );

  const imageCacheKey = product?.updated_at || product?.updatedAt;
  const productImageSrc = resolveImageSrc(productImage, { cacheKey: imageCacheKey });

  useEffect(() => {
    setImageError(false);
  }, [productImage, productId]);

  const localizedSpecTables = useMemo(
    () => getLocalizedSpecificationsTable(product?.specifications_table, language),
    [product?.specifications_table, language],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <div className="text-center">
          <p className="text-muted-foreground">{t('loadingProduct')}</p>
        </div>
      </div>
    );
  }

  // Product not found - show error message
  if (!product && !isLoading) {
    return (
      <div className="pb-12 md:pb-16">
        <PublicShell className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
          <PublicDetailTitle title={t('productNotFound')} description={t('productNotFoundDesc')} />
          <Button asChild className="mt-6">
            <Link to={getLocalizedLink('/products', language)}>{t('backToProducts')}</Link>
          </Button>
        </PublicShell>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Extract product data from API - no fallbacks
  const productName = pickLocalized(product, 'name', language, 'Product');
  const productDescription = pickLocalized(product, 'description', language);
  const productCategory = product?.category || t('industrialProducts') || 'Industrial';

  return (
    <div className="pb-12 md:pb-16 bg-background">
      <PublicShell className="py-8 md:py-10">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <Link to={getLocalizedLink('/products', language)}>
              <ArrowLeft className={cn('h-4 w-4', isRTL && 'rotate-180')} />
              {t('backToProducts')}
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-10 md:mb-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-[32px] border border-border shadow-2xl bg-muted">
                {productImageSrc && !imageError ? (
                  <img
                    src={productImageSrc}
                    alt={productName || 'Product image'}
                    className="h-full w-full object-cover"
                    key={`${productId}-${imageCacheKey || 'image'}`}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    {ProductIcon && <ProductIcon className="h-24 w-24 text-muted-foreground" />}
                  </div>
                )}
                <div className="absolute top-6 end-6 rounded-full bg-primary/90 p-4 backdrop-blur">
                  {ProductIcon && <ProductIcon className="h-8 w-8 text-white" />}
                </div>
              </div>
              
              {/* Gallery with Large Image and Thumbnail Strip */}
              {productGallery && productGallery.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-start">{t('imageGallery')}</h3>
                  
                  {/* Large Main Image */}
                  <div className="mb-4">
                    <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-lg border border-border shadow-lg">
                      {productGallery[selectedGalleryIndex] && (
                        <img
                          src={resolveImageSrc(productGallery[selectedGalleryIndex], { cacheKey: imageCacheKey })}
                          alt={`${productName} - Image ${selectedGalleryIndex + 1}`}
                          className="w-full h-full object-contain bg-muted/30"
                          key={`gallery-${selectedGalleryIndex}-${imageCacheKey || 'image'}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {productGallery.length > 1 && (
                    <div className="overflow-x-auto">
                      <div className="flex gap-2 pb-2">
                        {productGallery.map((img: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedGalleryIndex(index)}
                            className={cn(
                              "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg border-2 transition-all",
                              selectedGalleryIndex === index
                                ? "border-primary shadow-lg scale-105"
                                : "border-border hover:border-primary/50 hover:shadow-md"
                            )}
                          >
                            <img
                              src={resolveImageSrc(img, { cacheKey: imageCacheKey })}
                              alt={`${productName} - Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              key={`thumb-${index}-${imageCacheKey || 'image'}`}
                            />
                            {selectedGalleryIndex === index && (
                              <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-6 text-start">
              <PublicDetailTitle
                eyebrow={productCategory || undefined}
                title={productName}
                description={productDescription || undefined}
              />
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to={getLocalizedLink('/contact', language)}>{t('contactUs')}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={getLocalizedLink('/products', language)}>{t('viewAllProducts')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Tables from API */}
        {localizedSpecTables.length > 0 && (
          <div className="space-y-8 mb-8">
            {localizedSpecTables.map((table, tableIndex) => (
              table.columns.length > 0 ? (
                <Card key={tableIndex} className="mb-8">
                  <CardContent className="p-8">
                    {(table.title || tableIndex === 0) && (
                      <h2 className="text-2xl font-bold mb-6 text-start">
                        {table.title || t('specifications')}
                      </h2>
                    )}
                    <div className="overflow-x-auto rounded-2xl border border-border">
                      <table className="w-full text-sm text-start">
                        <thead className="bg-muted/70">
                          <tr>
                            {table.columns.map((col, idx) => (
                              <th key={idx} className="px-4 py-3 text-start text-xs font-semibold uppercase text-muted-foreground">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t border-border/60">
                              {row.map((value, colIdx) => (
                                <td key={colIdx} className="px-4 py-3">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : null
            ))}
          </div>
        )}

        {/* Applications & Features - Only show if product has this data in database */}
        {/* Note: These fields are not in the current database schema, so they won't display */}
        {/* If you need applications/features, add them to the database schema */}
      </PublicShell>
    </div>
  );
};

export default ProductDetail;


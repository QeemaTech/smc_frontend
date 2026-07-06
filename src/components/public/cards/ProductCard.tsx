import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaterialIcon } from '@/components/MaterialIcon';

export interface ProductCardProps {
  to: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  iconName?: string;
  index?: number;
  className?: string;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function ProductCard({
  to,
  imageSrc,
  imageAlt,
  title,
  description,
  iconName = 'inventory_2',
  index = 0,
  className,
  onImageError,
}: ProductCardProps) {
  const { t, isRTL } = useLanguage();

  return (
    <Link to={to} className={cn('group block h-full', className)}>
      <article
        className="md-card flex h-full flex-col animate-fade-in-up"
        style={{ animationDelay: `${index * 70}ms` }}
      >
        <div className="md-card-media">
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            onError={onImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elevation-2">
            <MaterialIcon name={iconName} size={20} filled />
          </div>
        </div>
        <div className="relative flex flex-1 flex-col p-5 text-start">
          <h3 className="mb-2 line-clamp-2 text-lg font-medium leading-snug text-foreground md:text-xl">
            {title}
          </h3>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
            <span>{t('readMore')}</span>
            <ArrowRight
              className={cn(
                'h-4 w-4 transition-transform group-hover:translate-x-0.5',
                isRTL && 'rotate-180 group-hover:-translate-x-0.5',
              )}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

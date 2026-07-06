import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NewsCardProps {
  to: string;
  imageSrc: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  index?: number;
}

export function NewsCard({
  to,
  imageSrc,
  title,
  excerpt,
  category,
  date,
  index = 0,
}: NewsCardProps) {
  const { t, isRTL } = useLanguage();

  return (
    <article
      className="md-card flex h-full flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={to} className="group flex h-full flex-col">
        <div className="md-card-media h-48">
          <img src={imageSrc} alt={title} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="absolute bottom-3 start-3 rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 text-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-primary">{category}</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="ltr-nums">{date}</span>
            </div>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-medium leading-snug">{title}</h3>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
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
      </Link>
    </article>
  );
}

import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/MaterialIcon';

export interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
  index?: number;
  centered?: boolean;
  className?: string;
}

export function FeatureCard({
  iconName,
  title,
  description,
  index = 0,
  centered = true,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        'md-feature-card animate-fade-in-up',
        centered && 'md-feature-card--center',
        className,
      )}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="md-feature-card__icon">
        <MaterialIcon name={iconName} size={28} className="text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-medium md:text-xl">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}

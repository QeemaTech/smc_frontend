import { cn } from '@/lib/utils';

export interface ContentCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  index?: number;
  hover?: boolean;
}

/** Generic Material Design elevated surface for tenders, members, stats, etc. */
export function ContentCard({
  children,
  className,
  index = 0,
  hover = true,
  ...props
}: ContentCardProps) {
  return (
    <article
      className={cn(
        'md-content-card animate-fade-in-up',
        hover && 'md-content-card--hover',
        className,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
      {...props}
    >
      {children}
    </article>
  );
}

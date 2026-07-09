import { ContentCard } from '@/components/public/cards';
import { cn } from '@/lib/utils';
import type { PageSection } from '@/lib/pageSections';

export interface ContentSectionProps {
  title?: string;
  body?: string;
  index?: number;
  className?: string;
}

export function ContentSection({
  title,
  body,
  index = 0,
  className,
}: ContentSectionProps) {
  const trimmedTitle = title?.trim() || '';
  const trimmedBody = body?.trim() || '';

  if (!trimmedTitle && !trimmedBody) return null;

  return (
    <ContentCard
      index={index}
      className={cn('p-8 md:p-12', index % 2 === 1 && 'bg-muted/40', className)}
    >
      {trimmedTitle ? (
        <h2 className="mb-4 text-start text-3xl font-bold">{trimmedTitle}</h2>
      ) : null}
      {trimmedBody ? (
        <p className="whitespace-pre-line text-start text-lg leading-relaxed text-muted-foreground">
          {trimmedBody}
        </p>
      ) : null}
    </ContentCard>
  );
}

export interface PageSectionsProps {
  sections: PageSection[];
  className?: string;
}

export function PageSections({ sections, className }: PageSectionsProps) {
  const visible = sections.filter(
    (section) => section.title?.trim() || section.body?.trim(),
  );

  if (visible.length === 0) return null;

  return (
    <div className={cn('space-y-12', className)}>
      {visible.map((section, index) => (
        <ContentSection
          key={`${section.title}-${index}`}
          title={section.title}
          body={section.body}
          index={index}
        />
      ))}
    </div>
  );
}

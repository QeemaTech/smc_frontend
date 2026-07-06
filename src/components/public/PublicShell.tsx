import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/MaterialIcon';

interface PublicShellProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
}

/** Max-width 1280px centered content shell for public pages. */
export function PublicShell({
  children,
  className,
  as: Tag = 'div',
}: PublicShellProps) {
  return (
    <Tag className={cn('public-shell', className)}>
      {children}
    </Tag>
  );
}

interface PublicPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: string;
  centered?: boolean;
  variant?: 'standard' | 'muted' | 'brand';
  backgroundImage?: string;
  backgroundAlt?: string;
  leading?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  as?: 'header' | 'section' | 'div';
}

/** Consistent page-level title band for public routes. */
export function PublicPageHeader({
  eyebrow,
  title,
  description,
  icon,
  centered = false,
  variant = 'standard',
  backgroundImage,
  backgroundAlt = '',
  leading,
  aside,
  children,
  className,
  as: Tag = 'header',
}: PublicPageHeaderProps) {
  const isBrand = variant === 'brand';
  const isMuted = variant === 'muted';
  const hasImage = Boolean(backgroundImage);

  return (
    <Tag
      className={cn(
        'public-page-header',
        variant === 'standard' && 'public-page-header--standard',
        isMuted && 'public-page-header--muted',
        isBrand && 'public-page-header--brand',
        className,
      )}
    >
      {hasImage && (
        <div className="public-page-header__media" aria-hidden={!backgroundAlt}>
          <img
            src={backgroundImage}
            alt={backgroundAlt}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <PublicShell className="public-page-header__shell">
        {leading ? <div className="public-page-header__leading">{leading}</div> : null}

        <div
          className={cn(
            aside && 'flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10',
          )}
        >
          <div
            className={cn(
              'public-page-header__content',
              centered && 'public-page-header__content--center keep-center',
              aside && 'max-w-2xl flex-1',
            )}
          >
            {icon ? (
              <div
                className={cn(
                  'public-page-header__icon',
                  isBrand && 'public-page-header__icon--brand',
                )}
              >
                <MaterialIcon name={icon} size={26} filled />
              </div>
            ) : null}

            {eyebrow ? (
              <p
                className={cn(
                  'public-page-header__eyebrow',
                  isBrand && 'public-page-header__eyebrow--brand',
                )}
              >
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                'public-page-header__title',
                isBrand && 'public-page-header__title--brand',
              )}
            >
              {title}
            </h1>

            {description ? (
              <p
                className={cn(
                  'public-page-header__description',
                  isBrand && 'public-page-header__description--brand',
                )}
              >
                {description}
              </p>
            ) : null}

            {variant === 'standard' && !centered ? (
              <div className="public-page-header__divider" aria-hidden="true" />
            ) : null}

            {children ? <div className="public-page-header__slot">{children}</div> : null}
          </div>

          {aside ? <div className="public-page-header__aside w-full shrink-0 lg:max-w-md">{aside}</div> : null}
        </div>
      </PublicShell>
    </Tag>
  );
}

interface PublicSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

/** In-page section heading — same typography scale as page headers. */
export function PublicSectionHeader({
  eyebrow,
  title,
  description,
  className,
  centered = false,
}: PublicSectionHeaderProps) {
  return (
    <div
      className={cn(
        'public-section-header mb-8 md:mb-10',
        centered && 'public-section-header--center keep-center',
        className,
      )}
    >
      {eyebrow ? <p className="public-page-header__eyebrow">{eyebrow}</p> : null}
      <h2 className="public-page-header__title public-section-header__title">{title}</h2>
      {description ? (
        <p className="public-page-header__description">{description}</p>
      ) : null}
    </div>
  );
}

interface PublicDetailTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  inverted?: boolean;
  className?: string;
}

/** Detail pages: product title block, post overlay title, etc. */
export function PublicDetailTitle({
  eyebrow,
  title,
  description,
  inverted = false,
  className,
}: PublicDetailTitleProps) {
  return (
    <div className={cn('public-detail-title text-start', className)}>
      {eyebrow ? (
        <p
          className={cn(
            'public-page-header__eyebrow',
            inverted && 'public-page-header__eyebrow--brand',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          'public-page-header__title mt-2',
          inverted && 'public-page-header__title--brand',
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            'public-page-header__description mt-3',
            inverted && 'public-page-header__description--brand',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

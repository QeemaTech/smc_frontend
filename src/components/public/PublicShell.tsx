import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/MaterialIcon';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { isRTL } = useLanguage();
  const isBrand = variant === 'brand';
  const isMuted = variant === 'muted';
  const hasImage = Boolean(backgroundImage);
  const useRtlLayout = isRTL;

  const iconEl = icon ? (
    <div
      className={cn(
        'public-page-header__icon',
        useRtlLayout && 'public-page-header__icon--inline',
        isBrand && 'public-page-header__icon--brand',
      )}
    >
      <MaterialIcon name={icon} size={26} filled />
    </div>
  ) : null;

  const eyebrowEl = eyebrow ? (
    <p
      className={cn(
        'public-page-header__eyebrow',
        isBrand && 'public-page-header__eyebrow--brand',
      )}
    >
      {eyebrow}
    </p>
  ) : null;

  const titleEl = (
    <h1
      className={cn(
        'public-page-header__title',
        isBrand && 'public-page-header__title--brand',
      )}
    >
      {title}
    </h1>
  );

  const descriptionEl = description ? (
    <p
      className={cn(
        'public-page-header__description',
        isBrand && 'public-page-header__description--brand',
      )}
    >
      {description}
    </p>
  ) : null;

  const showDivider = variant === 'standard' && !centered && !useRtlLayout;

  const contentInner = useRtlLayout ? (
    <>
      {leading ? (
        <div className="public-page-header__leading public-page-header__leading--rtl">
          {leading}
        </div>
      ) : null}
      {eyebrowEl}
      <div className="public-page-header__title-row">
        {iconEl}
        {titleEl}
      </div>
      {descriptionEl}
      {children ? <div className="public-page-header__slot">{children}</div> : null}
    </>
  ) : (
    <>
      {iconEl}
      {eyebrowEl}
      {titleEl}
      {descriptionEl}
      {showDivider ? <div className="public-page-header__divider" aria-hidden="true" /> : null}
      {children ? <div className="public-page-header__slot">{children}</div> : null}
    </>
  );

  return (
    <Tag
      className={cn(
        'public-page-header',
        variant === 'standard' && 'public-page-header--standard',
        isMuted && 'public-page-header--muted',
        isBrand && 'public-page-header--brand',
        useRtlLayout && 'public-page-header--rtl',
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
        {!useRtlLayout && leading ? (
          <div className="public-page-header__leading">{leading}</div>
        ) : null}

        <div
          className={cn(
            aside && 'flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10',
          )}
        >
          <div
            className={cn(
              'public-page-header__content',
              useRtlLayout && 'public-page-header__content--rtl',
              !useRtlLayout && centered && 'public-page-header__content--center keep-center',
              aside && 'max-w-2xl flex-1',
            )}
          >
            {contentInner}
          </div>

          {aside ? (
            <div className="public-page-header__aside w-full shrink-0 lg:max-w-md">{aside}</div>
          ) : null}
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
  const { isRTL } = useLanguage();

  if (isRTL) {
    return (
      <div className={cn('public-section-header public-section-header--rtl mb-6 md:mb-8', className)}>
        {eyebrow ? <p className="public-page-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="public-page-header__title public-section-header__title">{title}</h2>
        {description ? (
          <p className="public-page-header__description">{description}</p>
        ) : null}
      </div>
    );
  }

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
  const { isRTL } = useLanguage();

  return (
    <div
      className={cn(
        'public-detail-title text-start',
        isRTL && 'public-detail-title--rtl',
        className,
      )}
    >
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
          'public-page-header__title',
          !isRTL && 'mt-2',
          inverted && 'public-page-header__title--brand',
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            'public-page-header__description',
            !isRTL && 'mt-3',
            inverted && 'public-page-header__description--brand',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export type AppLanguage = 'en' | 'ar';

const LANG_PREFIX_RE = /^\/(en|ar)(?=\/|$)/;

/** Strip /en or /ar prefix from a pathname; dashboard/login paths pass through unchanged. */
export const stripLanguagePrefix = (pathname: string): string => {
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return pathname;
  }
  if (LANG_PREFIX_RE.test(pathname)) {
    const stripped = pathname.replace(LANG_PREFIX_RE, '');
    return stripped === '' ? '/' : stripped;
  }
  if (pathname === '/en' || pathname === '/ar') {
    return '/';
  }
  return pathname;
};

/** Build a localized URL preserving path, query string, and hash. */
export const buildLocalizedUrl = (
  pathname: string,
  lang: AppLanguage,
  search = '',
  hash = '',
): string => {
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return `${pathname}${search}${hash}`;
  }

  const pathWithoutLang = stripLanguagePrefix(pathname);
  const localizedPath =
    pathWithoutLang === '/' ? `/${lang}/` : `/${lang}${pathWithoutLang}`;

  return `${localizedPath}${search}${hash}`;
};

/**
 * Hook for navigation with language prefix support
 * Automatically adds language prefix to paths
 */
export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ lang?: string }>();
  const { language } = useLanguage();

  const currentLang = (params.lang === 'ar' || params.lang === 'en' ? params.lang : language) as AppLanguage;

  const getLocalizedPath = (path: string): string => {
    const hashIndex = path.indexOf('#');
    const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
    const pathOnly = hashIndex >= 0 ? path.slice(0, hashIndex) : path;

    const cleanPath = pathOnly.startsWith('/') ? pathOnly.slice(1) : pathOnly;

    if (cleanPath.startsWith('dashboard') || cleanPath.startsWith('login')) {
      return `/${cleanPath}${hash}`;
    }

    if (cleanPath.startsWith('ar/') || cleanPath.startsWith('en/')) {
      return `/${currentLang}/${cleanPath.slice(3)}${hash}`;
    }

    if (cleanPath === '' || cleanPath === 'ar' || cleanPath === 'en') {
      return `/${currentLang}/${hash}`;
    }

    return `/${currentLang}/${cleanPath}${hash}`;
  };

  const localizedNavigate = (path: string, options?: { replace?: boolean; state?: unknown }) => {
    const localizedPath = getLocalizedPath(path);
    navigate(localizedPath, options);
  };

  const getPathWithoutLang = (): string => {
    return stripLanguagePrefix(location.pathname);
  };

  return {
    navigate: localizedNavigate,
    getLocalizedPath,
    getPathWithoutLang,
    currentLang,
  };
};

/**
 * Build a localized link path for the given language
 */
export const getLocalizedLink = (path: string, lang: string = 'en'): string => {
  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const pathOnly = hashIndex >= 0 ? path.slice(0, hashIndex) : path;

  if (pathOnly.startsWith('/dashboard') || pathOnly.startsWith('/login')) {
    return `${pathOnly}${hash}`;
  }

  if (pathOnly.startsWith('/ar/') || pathOnly.startsWith('/en/')) {
    return `/${lang}${pathOnly.slice(3)}${hash}`;
  }

  if (pathOnly === '/' || pathOnly === '/ar' || pathOnly === '/en') {
    return `/${lang}/${hash}`;
  }

  return `/${lang}${pathOnly}${hash}`;
};

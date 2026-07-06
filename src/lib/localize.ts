import type { AppLanguage } from '@/hooks/useLocalizedNavigate';

type LocalizableRecord = Record<string, unknown>;

/** Pick the language-appropriate field from an API/CMS record (e.g. name vs nameAr). */
export const pickLocalized = (
  item: LocalizableRecord | null | undefined,
  field: string,
  language: AppLanguage,
  fallback = '',
): string => {
  if (!item) return fallback;

  const enValue = item[field];
  const arValue = item[`${field}Ar`];

  if (language === 'ar') {
    const value = arValue ?? enValue ?? fallback;
    return value != null ? String(value) : fallback;
  }

  const value = enValue ?? arValue ?? fallback;
  return value != null ? String(value) : fallback;
};

/** Replace `{name}` placeholders in a translated string. */
export const formatMessage = (template: string, values: Record<string, string | number>): string => {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template,
  );
};

/** Localized banner/CMS field with English + Arabic variants. */
export const pickLocalizedBannerField = (
  item: LocalizableRecord | null | undefined,
  field: string,
  language: AppLanguage,
  fallback = '',
): string => {
  if (!item) return fallback;

  if (language === 'ar') {
    const arField = `${field}Ar`;
    const value = item[arField] ?? item[field] ?? fallback;
    return value != null ? String(value) : fallback;
  }

  const value = item[field] ?? item[`${field}Ar`] ?? fallback;
  return value != null ? String(value) : fallback;
};

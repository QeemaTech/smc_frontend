export interface PageSection {
  title: string;
  body: string;
}

export const SECTIONS_KEY = 'sections';

export function parsePageSections(raw?: string | null): PageSection[] {
  if (!raw || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        title: typeof item?.title === 'string' ? item.title.trim() : '',
        body: typeof item?.body === 'string' ? item.body.trim() : '',
      }))
      .filter((section) => section.title.length > 0 || section.body.length > 0);
  } catch {
    return [];
  }
}

export function serializePageSections(sections: PageSection[]): string {
  const cleaned = sections
    .map((section) => ({
      title: (section.title || '').trim(),
      body: (section.body || '').trim(),
    }))
    .filter((section) => section.title.length > 0 || section.body.length > 0);

  return JSON.stringify(cleaned);
}

export function normalizeSectionsForSave(sections: PageSection[]): PageSection[] {
  return sections
    .map((section) => ({
      title: (section.title || '').trim(),
      body: (section.body || '').trim(),
    }))
    .filter((section) => section.title.length > 0 || section.body.length > 0);
}

export function createEmptySection(): PageSection {
  return { title: '', body: '' };
}

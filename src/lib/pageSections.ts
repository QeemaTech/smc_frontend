export interface PageSection {
  title: string;
  body: string;
}

export const SECTIONS_KEY = 'sections';

type ParseOptions = {
  /** Keep empty draft sections in the admin editor. */
  keepEmpty?: boolean;
};

function mapSections(items: unknown[]): PageSection[] {
  return items.map((item) => ({
    title: typeof (item as PageSection)?.title === 'string' ? (item as PageSection).title : '',
    body: typeof (item as PageSection)?.body === 'string' ? (item as PageSection).body : '',
  }));
}

function isSectionVisible(section: PageSection): boolean {
  return section.title.trim().length > 0 || section.body.trim().length > 0;
}

export function parsePageSections(
  raw?: string | null,
  options: ParseOptions = {},
): PageSection[] {
  if (!raw || !String(raw).trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const sections = mapSections(parsed).map((section) => ({
      title: options.keepEmpty ? section.title : section.title.trim(),
      body: options.keepEmpty ? section.body : section.body.trim(),
    }));

    if (options.keepEmpty) return sections;
    return sections.filter(isSectionVisible);
  } catch {
    return [];
  }
}

export function serializePageSections(
  sections: PageSection[],
  options: ParseOptions = {},
): string {
  const mapped = sections.map((section) => ({
    title: options.keepEmpty ? section.title || '' : (section.title || '').trim(),
    body: options.keepEmpty ? section.body || '' : (section.body || '').trim(),
  }));

  const cleaned = options.keepEmpty ? mapped : mapped.filter(isSectionVisible);
  return JSON.stringify(cleaned);
}

export function normalizeSectionsForSave(sections: PageSection[]): PageSection[] {
  return sections
    .map((section) => ({
      title: (section.title || '').trim(),
      body: (section.body || '').trim(),
    }))
    .filter(isSectionVisible);
}

export function createEmptySection(): PageSection {
  return { title: '', body: '' };
}

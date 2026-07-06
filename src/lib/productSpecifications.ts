export const SPEC_COLUMN_LABELS = {
  en: ["Property / Specification Name", "Property Value"] as const,
  ar: ["اسم الخاصية / المواصفة", "قيمة الخاصية"] as const,
};

export interface SpecRow {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
}

export interface SpecTable {
  titleEn: string;
  titleAr: string;
  columnsEn: readonly [string, string];
  columnsAr: readonly [string, string];
  rows: SpecRow[];
}

export interface SpecificationsTable {
  tables: SpecTable[];
}

function emptyRow(): SpecRow {
  return { labelEn: "", labelAr: "", valueEn: "", valueAr: "" };
}

function normalizeRow(row: unknown): SpecRow {
  if (Array.isArray(row)) {
    return {
      labelEn: row[0] ?? "",
      labelAr: row[2] ?? row[0] ?? "",
      valueEn: row[1] ?? "",
      valueAr: row[3] ?? row[1] ?? "",
    };
  }

  if (row && typeof row === "object") {
    const record = row as Record<string, string>;
    return {
      labelEn: record.labelEn ?? record.label ?? "",
      labelAr: record.labelAr ?? "",
      valueEn: record.valueEn ?? record.value ?? "",
      valueAr: record.valueAr ?? "",
    };
  }

  return emptyRow();
}

function normalizeTable(table: any): SpecTable | null {
  if (!table || typeof table !== "object") {
    return null;
  }

  const rowsSource = Array.isArray(table.rows) ? table.rows : [];

  return {
    titleEn: table.titleEn ?? table.title ?? "",
    titleAr: table.titleAr ?? "",
    columnsEn: SPEC_COLUMN_LABELS.en,
    columnsAr: SPEC_COLUMN_LABELS.ar,
    rows: rowsSource.length > 0 ? rowsSource.map(normalizeRow) : [emptyRow()],
  };
}

export function normalizeSpecificationsTable(input: unknown): SpecificationsTable | null {
  if (!input) {
    return null;
  }

  let parsed = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return null;
    }
  }

  const record = parsed as any;

  if (record?.tables && Array.isArray(record.tables)) {
    const tables = record.tables.map(normalizeTable).filter(Boolean) as SpecTable[];
    return tables.length > 0 ? { tables } : null;
  }

  if (record?.columns || record?.rows) {
    const table = normalizeTable(record);
    return table ? { tables: [table] } : null;
  }

  return null;
}

export function createEmptySpecificationsTable(): SpecificationsTable {
  return {
    tables: [
      {
        titleEn: "",
        titleAr: "",
        columnsEn: SPEC_COLUMN_LABELS.en,
        columnsAr: SPEC_COLUMN_LABELS.ar,
        rows: [emptyRow()],
      },
    ],
  };
}

export function getLocalizedSpecificationsTable(
  input: unknown,
  language: "en" | "ar",
): Array<{ title: string; columns: string[]; rows: string[][] }> {
  const normalized = normalizeSpecificationsTable(input);
  if (!normalized) {
    return [];
  }

  const isArabic = language === "ar";

  return normalized.tables.map((table) => ({
    title: isArabic
      ? table.titleAr || table.titleEn
      : table.titleEn || table.titleAr,
    columns: [...(isArabic ? table.columnsAr : table.columnsEn)],
    rows: table.rows.map((row) => [
      isArabic ? row.labelAr || row.labelEn : row.labelEn || row.labelAr,
      isArabic ? row.valueAr || row.valueEn : row.valueEn || row.valueAr,
    ]),
  }));
}

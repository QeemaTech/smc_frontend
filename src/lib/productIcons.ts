const PRODUCT_ICON_MAP: Record<string, string> = {
  Silicomanganese: 'all_inbox',
  'Calcined Gypsum': 'science',
  Kaolin: 'terrain',
  'Silica Sand': 'deployed_code',
  'Raw Gypsum': 'science',
  'Iron Oxide': 'auto_mode',
  'Fine Manganese': 'all_inbox',
};

export function getProductIconName(productName: string): string {
  return PRODUCT_ICON_MAP[productName] || 'inventory_2';
}

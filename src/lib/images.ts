const INVALID_IMAGE_VALUES = new Set(["", "null", "undefined"]);

function appendCacheBuster(url: string, cacheKey?: string | number): string {
  if (!cacheKey) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${cacheKey}`;
}

/** Returns true when the value is a non-empty image reference. */
export function isValidImageValue(image: unknown): image is string {
  if (typeof image !== "string") {
    return false;
  }
  const trimmed = image.trim();
  return trimmed.length > 0 && !INVALID_IMAGE_VALUES.has(trimmed.toLowerCase());
}

/** API origin without the `/api` suffix — used to resolve upload paths. */
export function getApiOrigin(): string {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

/**
 * Normalize stored image paths to a consistent `/uploads/...` shape.
 * Maps legacy `/uploads/banners/` paths to `/uploads/home/`.
 */
export function normalizeImagePath(image: string): string {
  let normalized = image.trim();

  normalized = normalized.replace(
    /^\/?uploads\/banners\//i,
    "/uploads/home/",
  );

  if (normalized.startsWith("uploads/")) {
    normalized = `/${normalized}`;
  }

  if (
    !normalized.startsWith("/") &&
    !normalized.includes("://") &&
    !normalized.startsWith("data:") &&
    !normalized.startsWith("blob:")
  ) {
    normalized = `/uploads/${normalized.replace(/^uploads\//, "")}`;
  }

  return normalized;
}

/**
 * Resolve any stored image value to a browser-ready URL.
 * Supports data URIs, blob URLs, absolute URLs, `/uploads` paths, and bare relative paths.
 */
export function getImageUrl(
  image: string | null | undefined,
  cacheKey?: string | number,
): string {
  if (!isValidImageValue(image)) {
    return "";
  }

  const trimmed = image.trim();

  if (
    trimmed.startsWith("data:image") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return appendCacheBuster(trimmed, cacheKey);
  }

  const normalizedPath = normalizeImagePath(trimmed);

  if (normalizedPath.startsWith("/uploads/")) {
    return appendCacheBuster(`${getApiOrigin()}${normalizedPath}`, cacheKey);
  }

  if (normalizedPath.startsWith("/")) {
    return appendCacheBuster(normalizedPath, cacheKey);
  }

  return appendCacheBuster(trimmed, cacheKey);
}

/** Resolve an image URL with an optional fallback (e.g. bundled asset). */
export function resolveImageSrc(
  image: string | null | undefined,
  options?: { cacheKey?: string | number; fallback?: string },
): string {
  const resolved = getImageUrl(image, options?.cacheKey);
  if (resolved) {
    return resolved;
  }

  if (options?.fallback) {
    return getImageUrl(options.fallback) || options.fallback;
  }

  return "";
}

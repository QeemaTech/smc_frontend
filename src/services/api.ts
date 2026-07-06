// API Service for Dashboard
// Backend is hosted at: https://smc-eg.com/api
//
// IMPORTANT: Set VITE_API_URL in Vercel Environment Variables if you need to override:
// VITE_API_URL=https://smc-eg.com/api
import { clearAdminSession } from "@/lib/adminAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Types
export interface ProductCategory {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  order: number;
  status: "active" | "inactive";
  parent_id?: number | null; // Deprecated - kept for backward compatibility, but should always be null
  image?: string;
}

export interface ProductSpecificationTable {
  title?: string; // Optional title for the table
  columns: string[];
  rows: Array<Array<string>>;
}

export interface ProductSpecificationTables {
  tables: ProductSpecificationTable[]; // Array of tables, each with optional title
}

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  category_id?: number;
  categoryId?: number;
  category: string;
  category_name?: string;
  category_nameAr?: string;
  category_slug?: string;
  status: "active" | "inactive" | "draft";
  views: number;
  description: string;
  descriptionAr: string;
  image?: string;
  gallery?: string[]; // Array of base64 images
  specifications_table?:
    | ProductSpecificationTable
    | ProductSpecificationTables
    | null;
  updated_at?: string; // ISO timestamp of last update
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  id: number;
  title: string;
  titleAr: string;
  date: string;
  category: string;
  views: number;
  status: "published" | "draft";
  content: string;
  contentAr: string;
  image?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  permissions: string[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "read";
}

export interface Complaint {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: "pending" | "in-progress" | "resolved";
}

export interface ChatMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  reply?: string | null;
  status: "new" | "read" | "replied" | "closed";
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroBanner {
  id: number;
  image: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  active: boolean;
}

export interface MediaItem {
  id: number;
  name: string;
  type: "image" | "video" | "file";
  url: string;
  size: string;
  uploaded: string;
}

export interface TenderSubmission {
  id: number;
  tenderId: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  files: string[]; // Base64 encoded files or URLs
  submittedAt: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "reviewing" | "approved";
}

export interface Tender {
  id: number;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  deadline: string;
  description: string;
  descriptionAr: string;
  status: "active" | "closed" | "draft";
  createdAt: string;
  documentFile?: string; // Base64 encoded PDF or document file
  documentFileName?: string; // Original file name
  submissions: TenderSubmission[];
}

export interface Member {
  id: number;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  order: number;
  status: "active" | "inactive";
  photoUrl?: string;
  image?: string;
}

export interface Client {
  id: number;
  name: string;
  nameAr: string;
  logo?: string;
  website?: string;
  order: number;
  status: "active" | "inactive";
}

export interface SiteSetting {
  id: number;
  key: string;
  valueEn: string | null;
  valueAr: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: number;
  page: string;
  key: string;
  valueEn: string | null;
  valueAr: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRevenue {
  id: number;
  year: number | string;
  revenue: number;
  profit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialProduction {
  id: number;
  year?: number | string;
  month: string;
  production: number;
  target: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialExport {
  id: number;
  name: string;
  nameEn?: string;
  nameAr?: string;
  value: number;
  color?: string;
  order?: number;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Response normalizers (backend compatibility layer)
// ---------------------------------------------------------------------------

function toIsoString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  try {
    return new Date(value as string | number | Date).toISOString();
  } catch {
    return String(value);
  }
}

function normalizeProduct(raw: any): Product {
  const categoryId = raw?.category_id ?? raw?.categoryId ?? raw?.productCategory?.id;
  const specs = raw?.specifications_table ?? raw?.specificationsTable ?? null;

  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    nameAr: raw.nameAr ?? "",
    category_id: categoryId,
    categoryId,
    category: raw.category ?? raw.category_name ?? raw.productCategory?.name ?? "",
    category_name: raw.category_name ?? raw.productCategory?.name,
    category_nameAr: raw.category_nameAr ?? raw.productCategory?.nameAr,
    category_slug: raw.category_slug ?? raw.productCategory?.slug,
    status: raw.status === "PUBLISHED" ? "active" : raw.status === "ARCHIVED" ? "inactive" : (raw.status || "active"),
    views: raw.views ?? raw.viewCount ?? 0,
    description: raw.description ?? raw.descriptionEn ?? "",
    descriptionAr: raw.descriptionAr ?? "",
    image: raw.image ?? raw.imageUrl,
    gallery: Array.isArray(raw.gallery)
      ? raw.gallery
      : typeof raw.gallery === "string"
        ? (() => {
            try {
              return JSON.parse(raw.gallery);
            } catch {
              return [];
            }
          })()
        : [],
    specifications_table: specs,
    updated_at: toIsoString(raw.updated_at ?? raw.updatedAt),
    createdAt: toIsoString(raw.createdAt ?? raw.created_at),
    updatedAt: toIsoString(raw.updatedAt ?? raw.updated_at),
  };
}

function normalizeCategory(raw: any): ProductCategory {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    nameAr: raw.nameAr ?? "",
    slug: raw.slug ?? "",
    order: raw.order ?? raw.displayOrder ?? 0,
    status: raw.status === true || raw.isActive === true
      ? "active"
      : raw.status === false || raw.isActive === false
        ? "inactive"
        : (raw.status || "active"),
    parent_id: raw.parent_id ?? raw.parentId ?? null,
    image: raw.image ?? raw.imageUrl,
  };
}

function normalizeNews(raw: any): News {
  return {
    ...raw,
    id: raw.id,
    title: raw.title ?? raw.titleEn ?? "",
    titleAr: raw.titleAr ?? "",
    date: toIsoString(raw.date ?? raw.publishedAt ?? raw.createdAt).slice(0, 10),
    category: raw.category ?? "",
    views: raw.views ?? raw.viewCount ?? 0,
    status: raw.status === "PUBLISHED" ? "published" : (raw.status || "published"),
    content: raw.content ?? raw.contentEn ?? "",
    contentAr: raw.contentAr ?? "",
    image: raw.image ?? raw.imageUrl,
  };
}

function normalizeBanner(raw: any): HeroBanner {
  return {
    ...raw,
    id: raw.id,
    image: raw.image ?? raw.imageUrl ?? "",
    title: raw.title ?? raw.titleEn ?? "",
    titleAr: raw.titleAr ?? "",
    subtitle: raw.subtitle ?? raw.subtitleEn ?? "",
    subtitleAr: raw.subtitleAr ?? "",
    description: raw.description ?? raw.descriptionEn ?? "",
    descriptionAr: raw.descriptionAr ?? "",
    order: raw.order ?? raw.displayOrder ?? 0,
    active: typeof raw.active === "boolean" ? raw.active : Boolean(raw.isActive ?? true),
  };
}

function normalizeMember(raw: any): Member {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    nameAr: raw.nameAr ?? "",
    title: raw.title ?? raw.titleEn ?? "",
    titleAr: raw.titleAr ?? "",
    order: raw.order ?? raw.displayOrder ?? 0,
    status: raw.status === true || raw.isActive === true
      ? "active"
      : raw.status === false || raw.isActive === false
        ? "inactive"
        : (raw.status || "active"),
    photoUrl: raw.photoUrl ?? raw.imageUrl ?? raw.image,
    image: raw.image ?? raw.imageUrl ?? raw.photoUrl,
  };
}

function normalizeClient(raw: any): Client {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    nameAr: raw.nameAr ?? "",
    logo: raw.logo ?? raw.logoUrl,
    website: raw.website ?? raw.websiteUrl,
    order: raw.order ?? raw.displayOrder ?? raw.sortOrder ?? 0,
    status: raw.status === true || raw.isActive === true
      ? "active"
      : raw.status === false || raw.isActive === false
        ? "inactive"
        : (raw.status || "active"),
  };
}

function normalizeSubmissionStatus(
  status: string,
): TenderSubmission["status"] {
  const map: Record<string, TenderSubmission["status"]> = {
    pending: "pending",
    reviewing: "reviewed",
    reviewed: "reviewed",
    approved: "accepted",
    accepted: "accepted",
    rejected: "rejected",
  };
  return map[String(status || "pending").toLowerCase()] || "pending";
}

function toBackendSubmissionStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "PENDING",
    reviewed: "REVIEWING",
    reviewing: "REVIEWING",
    accepted: "APPROVED",
    approved: "APPROVED",
    rejected: "REJECTED",
  };
  return map[String(status || "pending").toLowerCase()] || "PENDING";
}

function normalizeSubmission(raw: any): TenderSubmission {
  const files = Array.isArray(raw?.files)
    ? raw.files.map((file: any) =>
        typeof file === "string" ? file : file?.url || file?.fileUrl || "",
      )
    : [];

  return {
    id: raw.id,
    tenderId: raw.tenderId,
    companyName: raw.companyName,
    contactName: raw.contactName,
    email: raw.email,
    phone: raw.phone || "",
    files,
    submittedAt: toIsoString(raw.submittedAt ?? raw.createdAt),
    status: normalizeSubmissionStatus(raw.status),
  };
}

function normalizeTender(raw: any): Tender {
  const firstAttachment = Array.isArray(raw?.attachments) ? raw.attachments[0] : null;

  return {
    ...raw,
    id: raw.id,
    title: raw.title ?? raw.titleEn ?? "",
    titleAr: raw.titleAr ?? "",
    category: raw.category ?? "",
    categoryAr: raw.categoryAr ?? raw.category ?? "",
    deadline: toIsoString(raw.deadline ?? raw.deadlineAt).slice(0, 10),
    description: raw.description ?? raw.descriptionEn ?? "",
    descriptionAr: raw.descriptionAr ?? "",
    status: raw.status === "PUBLISHED" ? "active" : (raw.status || "active"),
    createdAt: toIsoString(raw.createdAt),
    documentFile: raw.documentFile ?? firstAttachment?.fileUrl ?? firstAttachment?.url,
    documentFileName: raw.documentFileName ?? firstAttachment?.fileName ?? firstAttachment?.name,
    submissions: Array.isArray(raw.submissions)
      ? raw.submissions.map(normalizeSubmission)
      : [],
  };
}

function normalizeContact(raw: any): Contact {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    message: raw.message ?? "",
    date: toIsoString(raw.date ?? raw.createdAt).slice(0, 10),
    status: (raw.status || "new") as Contact["status"],
  };
}

function normalizeComplaint(raw: any): Complaint {
  const status = String(raw.status || "pending").toLowerCase();
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? "",
    email: raw.email ?? "",
    subject: raw.subject ?? "",
    message: raw.message ?? "",
    date: toIsoString(raw.date ?? raw.createdAt).slice(0, 10),
    status: (status === "new" ? "pending" : status) as Complaint["status"],
  };
}

function normalizeUser(raw: any): User {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    email: raw.email ?? "",
    role: (String(raw.role || "viewer").toLowerCase() as User["role"]),
    status: raw.status === true || raw.isActive === true
      ? "active"
      : raw.status === false || raw.isActive === false
        ? "inactive"
        : (raw.status || "active"),
    permissions: Array.isArray(raw.permissions) ? raw.permissions : [],
  };
}

function normalizeChatMessage(raw: any): ChatMessage {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? "",
    email: raw.email ?? "",
    message: raw.message ?? "",
    reply: raw.reply ?? null,
    status: (raw.status || "new") as ChatMessage["status"],
    timestamp: toIsoString(raw.timestamp ?? raw.createdAt),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt),
  };
}

function normalizeRevenue(raw: any): FinancialRevenue {
  return {
    ...raw,
    id: raw.id,
    year: raw.year,
    revenue: Number(raw.revenue ?? 0),
    profit: Number(raw.profit ?? 0),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt),
  };
}

function normalizeProduction(raw: any): FinancialProduction {
  return {
    ...raw,
    id: raw.id,
    year: raw.year,
    month: raw.month ?? "",
    production: Number(raw.production ?? 0),
    target: Number(raw.target ?? 0),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt),
  };
}

function normalizeExport(raw: any): FinancialExport {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? raw.nameEn ?? "",
    nameEn: raw.nameEn ?? raw.name,
    nameAr: raw.nameAr ?? "",
    value: Number(raw.value ?? 0),
    color: raw.color ?? "#204393",
    order: raw.order ?? raw.displayOrder ?? 0,
    status: raw.status === false || raw.isActive === false ? "inactive" : (raw.status || "active"),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt),
  };
}

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminAuth") : null;

  // Get session-based cache buster (changes on each page load)
  let sessionId = "";
  if (typeof window !== "undefined") {
    sessionId = sessionStorage.getItem("api_session_id") || "";
    if (!sessionId) {
      // Generate new session ID on first load
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem("api_session_id", sessionId);
    }
  }

  // Add aggressive cache-busting with timestamp, random number, version, and session
  const separator = endpoint.includes("?") ? "&" : "?";
  const version =
    typeof window !== "undefined"
      ? localStorage.getItem("api_version") || "1"
      : "1";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const cacheBuster = `_t=${timestamp}&_r=${random}&_v=${version}&_s=${sessionId}&_cb=${btoa(
    `${timestamp}-${random}`
  )}`;
  const url = `${API_BASE_URL}${endpoint}`;

  // Log API call in development and production (for debugging)
  console.log("API Call:", {
    method: options?.method || "GET",
    url,
    endpoint,
    apiBaseUrl: API_BASE_URL,
    isProd: import.meta.env.PROD,
    envApiUrl: import.meta.env.VITE_API_URL,
  });

  let response: Response;
  try {
    // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
    const isFormData = options?.body instanceof FormData;
    
    response = await fetch(url, {
      ...options,
      method: options?.method || "GET",
      headers: {
        // Only set Content-Type for non-FormData requests
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "X-Requested-With": "XMLHttpRequest",
        "X-Request-ID": `${timestamp}-${random}`,
        "X-Session-ID": sessionId,
        // Vercel CDN bypass headers - VERY AGGRESSIVE
        "X-Vercel-Cache-Control": "no-cache",
        "CDN-Cache-Control": "no-cache",
        "Vercel-CDN-Cache-Control": "no-cache",
        "X-Cache-Bypass": "true",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      cache: "no-store", // Prevent browser caching
      credentials: "omit", // Don't send cookies that might affect caching
    });
  } catch (networkError: unknown) {
    // Network error (no internet, CORS, etc.)
    const errorMessage =
      (networkError instanceof Error
        ? networkError.message
        : String(networkError)) || "Network request failed";
    const errorString = String(networkError).toLowerCase();

    // Check for CORS errors - "Failed to fetch" with CORS policy message is usually CORS
    const isCorsError =
      errorMessage.includes("CORS") ||
      errorMessage.includes("cors") ||
      errorMessage.includes("Access-Control") ||
      (errorMessage.includes("Failed to fetch") &&
        errorString.includes("cors")) ||
      (errorMessage.includes("Failed to fetch") &&
        typeof window !== "undefined" &&
        window.location.origin !== new URL(API_BASE_URL).origin);

    const isConnectionError =
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError") ||
      errorMessage.includes("ERR_");

    let userFriendlyMessage = "";
    if (isCorsError) {
      userFriendlyMessage = `CORS Error: The backend at ${API_BASE_URL} is not allowing requests from ${
        typeof window !== "undefined" ? window.location.origin : "this origin"
      }. Please configure CORS on the backend to allow requests from your frontend domain. See CORS_FIX_GUIDE.md for instructions.`;
    } else if (isConnectionError) {
      userFriendlyMessage = `Connection failed: Cannot reach the backend server at ${API_BASE_URL}. Please ensure the backend is running and accessible.`;
    } else {
      userFriendlyMessage = `Network error: ${errorMessage}. Please check your internet connection and ensure the backend is running at ${API_BASE_URL}.`;
    }

    console.error("Network Error:", {
      url,
      endpoint,
      apiBaseUrl: API_BASE_URL,
      error: networkError,
      message: errorMessage,
      userFriendlyMessage,
      isCorsError,
      isConnectionError,
    });

    throw new Error(userFriendlyMessage);
  }

  if (!response.ok) {
    // Try to get error message from response body
    let errorMessage = response.statusText || `HTTP ${response.status} error`;
    let errorDetails = "";

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.error ||
        errorData.message ||
        errorData.msg ||
        response.statusText ||
        `HTTP ${response.status} error`;
      errorDetails = errorData.details || "";

      // Log full error for debugging
      console.error("API Error Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
        errorData,
        endpoint,
      });
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        if (text && text.trim()) {
          errorMessage = text;
          // Try to parse as JSON if it looks like JSON
          try {
            const parsed = JSON.parse(text);
            errorMessage = parsed.error || parsed.message || parsed.msg || text;
            errorDetails = parsed.details || "";
          } catch (e2) {
            // Use text as is (might be HTML error page)
            if (text.length > 200) {
              errorMessage = `Server returned error (${
                response.status
              }): ${text.substring(0, 200)}...`;
            } else {
              errorMessage = `Server returned error (${response.status}): ${text}`;
            }
          }
        } else {
          // No text content, use status
          errorMessage = response.statusText || `HTTP ${response.status} error`;
        }
      } catch (e2) {
        // Use status text as fallback
        errorMessage = response.statusText || `HTTP ${response.status} error`;
      }

      console.error("API Error (non-JSON response):", {
        url,
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        endpoint,
      });
    }

    // Add more context to error message
    const fullErrorMessage = errorDetails
      ? `${errorMessage}${errorDetails ? ` (${errorDetails})` : ""}`
      : errorMessage;

    // Provide user-friendly error messages based on status code
    let userFriendlyMessage = fullErrorMessage;
    if (response.status === 0 || response.status === 500) {
      userFriendlyMessage = `Server error: ${fullErrorMessage}. Please check if the backend is running.`;
    } else if (response.status === 404) {
      userFriendlyMessage = `Not found: ${fullErrorMessage}`;
    } else if (response.status === 400) {
      userFriendlyMessage = `Invalid request: ${fullErrorMessage}`;
    } else if (response.status === 401 || response.status === 403) {
      userFriendlyMessage = `Authentication error: ${fullErrorMessage}`;
      if (
        typeof window !== "undefined" &&
        token &&
        (window.location.pathname.startsWith("/dashboard") ||
          window.location.pathname.startsWith("/admin"))
      ) {
        clearAdminSession();
        window.location.href = "/login";
      }
    } else if (response.status >= 500) {
      userFriendlyMessage = `Server error (${response.status}): ${fullErrorMessage}`;
    }

    console.error("API Error (final):", {
      url,
      status: response.status,
      statusText: response.statusText,
      errorMessage: fullErrorMessage,
      userFriendlyMessage,
      endpoint,
    });

    throw new Error(userFriendlyMessage);
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: async () => (await apiCall<any[]>("/products")).map(normalizeProduct),
  getById: async (id: number) => normalizeProduct(await apiCall<any>(`/products/${id}`)),
  create: async (product: Omit<Product, "id">, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "products");
      Object.keys(product).forEach((key) => {
        if (
          key !== "image" &&
          product[key as keyof typeof product] !== undefined
        ) {
          const value = product[key as keyof typeof product];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        }
      });
      return normalizeProduct(await apiCall<any>("/products", {
        method: "POST",
        body: formData,
        headers: {},
      }));
    }
    return normalizeProduct(await apiCall<any>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }));
  },
  update: async (id: number, product: Partial<Product>, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "products");
      Object.keys(product).forEach((key) => {
        if (
          key !== "image" &&
          product[key as keyof typeof product] !== undefined
        ) {
          const value = product[key as keyof typeof product];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        }
      });
      return normalizeProduct(await apiCall<any>(`/products/${id}`, {
        method: "PUT",
        body: formData,
        headers: {},
      }));
    }
    return normalizeProduct(await apiCall<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }));
  },
  delete: (id: number) =>
    apiCall<void>(`/products/${id}`, { method: "DELETE" }),
};

// News API
export const newsAPI = {
  getAll: async () => (await apiCall<any[]>("/news")).map(normalizeNews),
  getById: async (id: number) => normalizeNews(await apiCall<any>(`/news/${id}`)),
  create: async (news: Omit<News, "id">, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "news");
      Object.keys(news).forEach((key) => {
        if (
          key !== "image" &&
          news[key as keyof typeof news] !== undefined
        ) {
          formData.append(key, String(news[key as keyof typeof news]));
        }
      });
      return normalizeNews(await apiCall<any>("/news", {
        method: "POST",
        body: formData,
        headers: {},
      }));
    }
    return normalizeNews(await apiCall<any>("/news", {
      method: "POST",
      body: JSON.stringify(news),
    }));
  },
  update: async (id: number, news: Partial<News>, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "news");
      Object.keys(news).forEach((key) => {
        if (
          key !== "image" &&
          news[key as keyof typeof news] !== undefined
        ) {
          formData.append(key, String(news[key as keyof typeof news]));
        }
      });
      return normalizeNews(await apiCall<any>(`/news/${id}`, {
        method: "PUT",
        body: formData,
        headers: {},
      }));
    }
    return normalizeNews(await apiCall<any>(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(news),
    }));
  },
  delete: (id: number) => apiCall<void>(`/news/${id}`, { method: "DELETE" }),
};

// Users API
export const usersAPI = {
  getAll: async () => (await apiCall<any[]>("/users")).map(normalizeUser),
  getById: async (id: number) => normalizeUser(await apiCall<any>(`/users/${id}`)),
  create: async (user: Omit<User, "id"> & { password?: string }) =>
    normalizeUser(await apiCall<any>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })),
  update: async (id: number, user: Partial<User>) =>
    normalizeUser(await apiCall<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })),
  delete: (id: number) => apiCall<void>(`/users/${id}`, { method: "DELETE" }),
};

// Contacts API
export const contactsAPI = {
  getAll: async () => (await apiCall<any[]>("/contacts")).map(normalizeContact),
  getById: async (id: number) => normalizeContact(await apiCall<any>(`/contacts/${id}`)),
  create: async (contact: Omit<Contact, "id" | "date" | "status">) =>
    normalizeContact(await apiCall<any>("/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
    })),
  update: async (id: number, contact: Partial<Contact>) =>
    normalizeContact(await apiCall<any>(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    })),
  delete: (id: number) =>
    apiCall<void>(`/contacts/${id}`, { method: "DELETE" }),
};

// Complaints API
export const complaintsAPI = {
  getAll: async () => (await apiCall<any[]>("/complaints")).map(normalizeComplaint),
  getById: async (id: number) => normalizeComplaint(await apiCall<any>(`/complaints/${id}`)),
  create: async (complaint: Omit<Complaint, "id" | "date" | "status">) =>
    normalizeComplaint(await apiCall<any>("/complaints", {
      method: "POST",
      body: JSON.stringify(complaint),
    })),
  update: async (id: number, complaint: Partial<Complaint>) =>
    normalizeComplaint(await apiCall<any>(`/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(complaint),
    })),
  delete: (id: number) =>
    apiCall<void>(`/complaints/${id}`, { method: "DELETE" }),
};

// Hero Banners API
export const bannersAPI = {
  getAll: async () => (await apiCall<any[]>("/banners")).map(normalizeBanner),
  getById: async (id: number) => normalizeBanner(await apiCall<any>(`/banners/${id}`)),
  create: async (banner: Omit<HeroBanner, "id">, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "home");
      Object.keys(banner).forEach((key) => {
        if (
          key !== "image" &&
          banner[key as keyof typeof banner] !== undefined
        ) {
          formData.append(key, String(banner[key as keyof typeof banner]));
        }
      });
      return normalizeBanner(await apiCall<any>("/banners", {
        method: "POST",
        body: formData,
        headers: {},
      }));
    }
    return normalizeBanner(await apiCall<any>("/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    }));
  },
  update: async (id: number, banner: Partial<HeroBanner>, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", "home");
      Object.keys(banner).forEach((key) => {
        if (
          key !== "image" &&
          banner[key as keyof typeof banner] !== undefined
        ) {
          formData.append(key, String(banner[key as keyof typeof banner]));
        }
      });
      return normalizeBanner(await apiCall<any>(`/banners/${id}`, {
        method: "PUT",
        body: formData,
        headers: {},
      }));
    }
    return normalizeBanner(await apiCall<any>(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(banner),
    }));
  },
  delete: (id: number) => apiCall<void>(`/banners/${id}`, { method: "DELETE" }),
};

// Media API
export const mediaAPI = {
  getAll: () => apiCall<MediaItem[]>("/media"),
  upload: (file: File, type = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return apiCall<MediaItem>("/media/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it
    });
  },
  delete: (id: string) => apiCall<void>(`/media/${id}`, { method: "DELETE" }),
};

// Statistics API
export const statisticsAPI = {
  getOverview: () =>
    apiCall<{
      totalProducts: number;
      totalNews: number;
      totalContacts: number;
      totalComplaints: number;
      totalRevenue: string;
      monthlyGrowth: string;
      totalViews: number;
    }>("/statistics/overview"),
  getMonthlyData: () =>
    apiCall<Array<{ month: string; views: number; visitors: number }>>(
      "/statistics/monthly"
    ),
  getProductViews: () =>
    apiCall<Array<{ product: string; views: number }>>(
      "/statistics/product-views"
    ),
};

// Financial API
export const financialAPI = {
  revenue: {
    getAll: async () =>
      (await apiCall<any[]>("/financial/revenue")).map(normalizeRevenue),
    create: async (record: Omit<FinancialRevenue, "id">) =>
      normalizeRevenue(await apiCall<any>("/financial/revenue", {
        method: "POST",
        body: JSON.stringify(record),
      })),
    update: async (id: number, record: Partial<FinancialRevenue>) =>
      normalizeRevenue(await apiCall<any>(`/financial/revenue/${id}`, {
        method: "PUT",
        body: JSON.stringify(record),
      })),
    delete: (id: number) =>
      apiCall<void>(`/financial/revenue/${id}`, { method: "DELETE" }),
  },
  production: {
    getAll: async () =>
      (await apiCall<any[]>("/financial/production")).map(normalizeProduction),
    create: async (record: Omit<FinancialProduction, "id">) =>
      normalizeProduction(await apiCall<any>("/financial/production", {
        method: "POST",
        body: JSON.stringify(record),
      })),
    update: async (id: number, record: Partial<FinancialProduction>) =>
      normalizeProduction(await apiCall<any>(`/financial/production/${id}`, {
        method: "PUT",
        body: JSON.stringify(record),
      })),
    delete: (id: number) =>
      apiCall<void>(`/financial/production/${id}`, { method: "DELETE" }),
  },
  export: {
    getAll: async () =>
      (await apiCall<any[]>("/financial/export")).map(normalizeExport),
    create: async (record: Omit<FinancialExport, "id">) =>
      normalizeExport(await apiCall<any>("/financial/export", {
        method: "POST",
        body: JSON.stringify(record),
      })),
    update: async (id: number, record: Partial<FinancialExport>) =>
      normalizeExport(await apiCall<any>(`/financial/export/${id}`, {
        method: "PUT",
        body: JSON.stringify(record),
      })),
    delete: (id: number) =>
      apiCall<void>(`/financial/export/${id}`, { method: "DELETE" }),
  },
};

// Chat API
export const chatAPI = {
  getAll: async () => (await apiCall<any[]>("/chat")).map(normalizeChatMessage),
  create: async (message: Pick<ChatMessage, "name" | "email" | "message">) =>
    normalizeChatMessage(await apiCall<any>("/chat", {
      method: "POST",
      body: JSON.stringify(message),
    })),
  update: async (id: number, message: Partial<ChatMessage>) =>
    normalizeChatMessage(await apiCall<any>(`/chat/${id}`, {
      method: "PUT",
      body: JSON.stringify(message),
    })),
};

// Tenders API
export const tendersAPI = {
  getAll: async () => (await apiCall<any[]>("/tenders")).map(normalizeTender),
  getById: async (id: number) => normalizeTender(await apiCall<any>(`/tenders/${id}`)),
  create: async (tender: Omit<Tender, "id" | "createdAt" | "submissions">) =>
    normalizeTender(await apiCall<any>("/tenders", {
      method: "POST",
      body: JSON.stringify(tender),
    })),
  update: async (id: number, tender: Partial<Tender>) =>
    normalizeTender(await apiCall<any>(`/tenders/${id}`, {
      method: "PUT",
      body: JSON.stringify(tender),
    })),
  delete: (id: number) => apiCall<void>(`/tenders/${id}`, { method: "DELETE" }),
  submit: async (
    tenderId: number,
    submission: Omit<TenderSubmission, "id" | "submittedAt" | "status">
  ) =>
    normalizeSubmission(await apiCall<any>("/tenders/submit", {
      method: "POST",
      body: JSON.stringify({ tenderId, ...submission }),
    })),
  getSubmissions: async (tenderId: number) =>
    (await apiCall<any[]>(`/tenders/${tenderId}/submissions`)).map(normalizeSubmission),
  updateSubmissionStatus: async (
    _tenderId: number,
    submissionId: number,
    status: TenderSubmission["status"]
  ) =>
    normalizeSubmission(await apiCall<any>(`/tender-submissions/${submissionId}`, {
      method: "PUT",
      body: JSON.stringify({ status: toBackendSubmissionStatus(status) }),
    })),
};

// Members API
export const membersAPI = {
  getAll: async () => (await apiCall<any[]>("/members")).map(normalizeMember),
  getAllWithStatus: async (status: "active" | "all" = "active") => {
    const endpoint = status === "all" ? "/members?status=all" : "/members";
    return (await apiCall<any[]>(endpoint)).map(normalizeMember);
  },
  getById: async (id: number) => normalizeMember(await apiCall<any>(`/members/${id}`)),
  create: async (member: Omit<Member, "id">) =>
    normalizeMember(await apiCall<any>("/members", {
      method: "POST",
      body: JSON.stringify(member),
    })),
  update: async (id: number, member: Partial<Member>) =>
    normalizeMember(await apiCall<any>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(member),
    })),
  delete: (id: number) => apiCall<void>(`/members/${id}`, { method: "DELETE" }),
};

// Clients API
export const clientsAPI = {
  getAll: async () => (await apiCall<any[]>("/clients")).map(normalizeClient),
  getAllWithStatus: async (status: "active" | "all" = "active") => {
    const endpoint = status === "all" ? "/clients?status=all" : "/clients";
    return (await apiCall<any[]>(endpoint)).map(normalizeClient);
  },
  getById: async (id: number) => normalizeClient(await apiCall<any>(`/clients/${id}`)),
  create: async (client: Omit<Client, "id">) =>
    normalizeClient(await apiCall<any>("/clients", {
      method: "POST",
      body: JSON.stringify(client),
    })),
  update: async (id: number, client: Partial<Client>) =>
    normalizeClient(await apiCall<any>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(client),
    })),
  delete: (id: number) => apiCall<void>(`/clients/${id}`, { method: "DELETE" }),
};

// Product Categories API
export const productCategoriesAPI = {
  getAll: async () =>
    (await apiCall<any[]>("/product-categories")).map(normalizeCategory),
  getAllWithStatus: async (status: "active" | "all" = "active") => {
    const endpoint =
      status === "all" ? "/product-categories?status=all" : "/product-categories";
    return (await apiCall<any[]>(endpoint)).map(normalizeCategory);
  },
  getById: async (id: number) =>
    normalizeCategory(await apiCall<any>(`/product-categories/${id}`)),
  create: async (category: Omit<ProductCategory, "id">) =>
    normalizeCategory(await apiCall<any>("/product-categories", {
      method: "POST",
      body: JSON.stringify(category),
    })),
  update: async (id: number, category: Partial<ProductCategory>) =>
    normalizeCategory(await apiCall<any>(`/product-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    })),
  delete: (id: number) =>
    apiCall<void>(`/product-categories/${id}`, { method: "DELETE" }),
};

// Settings API
export const settingsAPI = {
  getAll: () => apiCall<SiteSetting[]>("/settings"),
  getByKey: (key: string) => apiCall<SiteSetting>(`/settings/${key}`),
  createOrUpdate: (setting: { key: string; valueEn?: string | null; valueAr?: string | null }) =>
    apiCall<SiteSetting>("/settings", {
      method: "POST",
      body: JSON.stringify(setting),
    }),
};

// Page Content API
export const pageContentAPI = {
  getAll: (page?: string) => {
    const url = page ? `/page-content?page=${page}` : "/page-content";
    return apiCall<PageContent[]>(url);
  },
  getByPage: (page: string) => apiCall<PageContent[]>(`/page-content/page/${page}`),
  getByKey: (page: string, key: string) =>
    apiCall<PageContent>(`/page-content/page/${page}/key/${key}`),
  createOrUpdate: (content: { page: string; key: string; valueEn?: string | null; valueAr?: string | null }) =>
    apiCall<PageContent>("/page-content", {
      method: "POST",
      body: JSON.stringify(content),
    }),
  update: (page: string, key: string, content: { valueEn?: string | null; valueAr?: string | null }) =>
    apiCall<PageContent>(`/page-content/page/${page}/key/${key}`, {
      method: "PUT",
      body: JSON.stringify(content),
    }),
  delete: (page: string, key: string) =>
    apiCall<void>(`/page-content/page/${page}/key/${key}`, { method: "DELETE" }),
  bulkUpdate: (contents: Array<{ page: string; key: string; valueEn?: string | null; valueAr?: string | null }>) =>
    apiCall<{ message: string; count: number; results: PageContent[] }>("/page-content/bulk", {
      method: "POST",
      body: JSON.stringify({ content: contents }),
    }),
};

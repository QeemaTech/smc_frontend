export interface StoredAdminUser {
  id: number;
  email: string;
  role: string;
  name?: string;
  status?: string;
}

export function getStoredAdminUser(): StoredAdminUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem("adminUser");
    return raw ? (JSON.parse(raw) as StoredAdminUser) : null;
  } catch {
    return null;
  }
}

export function isAdminRole(role?: string | null): boolean {
  return String(role || "").toLowerCase() === "admin";
}

export function hasValidAdminSession(): boolean {
  const token = localStorage.getItem("adminAuth");
  const user = getStoredAdminUser();

  return Boolean(token && token !== "true" && user && isAdminRole(user.role));
}

export function clearAdminSession(): void {
  localStorage.removeItem("adminAuth");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("adminEmail");
}

export function saveAdminSession(token: string, user: StoredAdminUser): void {
  localStorage.setItem("adminAuth", token);
  localStorage.setItem("adminUser", JSON.stringify(user));
  localStorage.setItem("adminEmail", user.email);
}

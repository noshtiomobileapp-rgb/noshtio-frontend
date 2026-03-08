/* ============================================================
   API BASE
============================================================ */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noshtio-backend.onrender.com";

/* ============================================================
   TYPES
============================================================ */

type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

/* ============================================================
   TOKEN HELPER
============================================================ */

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/* ============================================================
   CORE API CLIENT
============================================================ */

export async function apiClient(path: string, options: ApiOptions = {}) {
  const isFormData = options.body instanceof FormData;

  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  /* Attach Authorization header if token exists */

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  /* JSON content type for non-form requests */

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
    credentials: "include",
  });

  const text = await res.text();

  if (!text) return {};

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from API");
  }

  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}

/* ============================================================
   CONVENIENCE HELPERS
============================================================ */

export const apiGet = (path: string) =>
  apiClient(path, { method: "GET" });

export const apiPost = (path: string, body: any) =>
  apiClient(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiUpload = (path: string, formData: FormData) =>
  apiClient(path, {
    method: "POST",
    body: formData,
  });
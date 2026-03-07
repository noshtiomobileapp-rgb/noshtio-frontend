const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noshtio-backend.onrender.com";

type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function apiClient(path: string, options: ApiOptions = {}) {
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
    credentials: "include", // 🔑 REQUIRED for auth cookies
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

/* ---------- Convenience helpers ---------- */

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
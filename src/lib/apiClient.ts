const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient(path: string, options: any = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers };
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // CRITICAL: This allows cookies to be sent/received
  });

  const text = await res.text();
  if (!text || text.trim() === "") return {};

  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (e) {
    return {};
  }
}

export const apiGet = (path: string) => apiClient(path, { method: "GET" });
export const apiPost = (path: string, body: any) => apiClient(path, {
  method: "POST",
  body
});
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient(path: string, options: any = {}) {
  const isFormData = options.body instanceof FormData;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ Attach Authorization header automatically
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  if (!text || text.trim() === "") return {};

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const apiGet = (path: string) =>
  apiClient(path, { method: "GET" });

export const apiPost = (path: string, body: any) =>
  apiClient(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
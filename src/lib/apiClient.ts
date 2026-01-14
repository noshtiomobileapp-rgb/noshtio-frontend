/* ============================================================
   API CLIENT — COOKIE AUTH (CANONICAL · LOCKED)
============================================================ */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export type ApiOptions = RequestInit & {
  skipJson?: boolean;
};

export async function apiClient(
  path: string,
  options: ApiOptions = {}
): Promise<any> {
  const { skipJson, ...fetchOptions } = options;

  const isFormData =
    fetchOptions.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipJson && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const text = await res.text();
      if (text) message = text;
    } catch {}
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiClient(path);
}

export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  return apiClient(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

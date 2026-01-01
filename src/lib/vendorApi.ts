const BACKEND_URL = "http://localhost:4000";

export async function vendorFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // 🚫 Client-only guard
  if (typeof window === "undefined") {
    throw new Error("vendorFetch called on server");
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 🔐 Auth failure — let caller decide redirect
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://noshtio-backend.onrender.com";

/*
============================================================
Vendor API Fetch Wrapper
============================================================
*/

export async function vendorFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  if (typeof window === "undefined") {
    throw new Error("vendorFetch should run in browser only");
  }

  const token = localStorage.getItem("token");

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers || {}),
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}
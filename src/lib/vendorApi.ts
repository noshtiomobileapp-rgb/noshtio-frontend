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

  /*
  ============================================================
  GET TOKEN
  ============================================================
  */

  const token = localStorage.getItem("token");

  /*
  ============================================================
  HEADERS
  ============================================================
  */

  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  /*
  ============================================================
  REQUEST
  ============================================================
  */

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  /*
  ============================================================
  UNAUTHORIZED
  ============================================================
  */

  if (res.status === 401) {
    console.error("Vendor API Unauthorized:", path);
    throw new Error("Unauthorized");
  }

  /*
  ============================================================
  ERROR HANDLING
  ============================================================
  */

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}
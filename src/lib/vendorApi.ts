/*
============================================================
Vendor API Fetch Wrapper
============================================================
Handles:
• Token injection
• Standard headers
• Error handling
• JSON parsing
• Unauthorized detection
============================================================
*/

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://noshtio-backend.onrender.com";

export async function vendorFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  if (typeof window === "undefined") {
    throw new Error("vendorFetch should run in browser only");
  }

  /* ============================================================
     TOKEN
  ============================================================ */

  const token = localStorage.getItem("token");

  /* ============================================================
     HEADERS
  ============================================================ */

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  /* ============================================================
     REQUEST
  ============================================================ */

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  /* ============================================================
     UNAUTHORIZED
  ============================================================ */

  if (res.status === 401) {
    console.error("Vendor API Unauthorized:", path);

    throw new Error("Unauthorized");
  }

  /* ============================================================
     ERROR HANDLING
  ============================================================ */

  if (!res.ok) {
    let message = "Request failed";

    try {
      const data = await res.json();
      message = data?.message || JSON.stringify(data);
    } catch {
      message = await res.text();
    }

    throw new Error(message || "Request failed");
  }

  /* ============================================================
     RESPONSE PARSE
  ============================================================ */

  try {
    return await res.json();
  } catch {
    return {} as T;
  }
}
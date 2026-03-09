const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://noshtio-backend.onrender.com";

/**
 * Vendor API Fetch Wrapper
 * - Adds Authorization header automatically
 * - Handles JSON safely
 * - Handles 401 auth failures
 * - Prevents server-side execution
 */

export async function vendorFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  // Prevent execution during SSR
  if (typeof window === "undefined") {
    throw new Error("vendorFetch should only run in browser");
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    credentials: "include"
  });

  // Handle authentication failure
  if (res.status === 401) {
    console.warn("Vendor API: Unauthorized request");

    // Optional redirect
    // window.location.href = "/vendor/login";

    throw new Error("Unauthorized");
  }

  // Handle non-success responses
  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const data = await res.json();
      errorMessage = data?.message || errorMessage;
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }

    throw new Error(errorMessage);
  }

  // Safe JSON parsing
  try {
    return await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }
}
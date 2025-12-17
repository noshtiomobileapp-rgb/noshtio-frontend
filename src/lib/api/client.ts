// C:\Users\Admin\qrestro\qrestro-frontend-v2\lib\api\client.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  console.log("DEBUG BASE_URL =", BASE_URL);

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  // Get JWT token on client side
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("vendor_token") || "";
  }

  // Build headers
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add token if exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Final request
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Error handling
  if (!res.ok) {
    let msg = "Request failed";

    try {
      const data = await res.json();
      msg = data.message || JSON.stringify(data);
    } catch {}

    throw new Error(msg);
  }

  return res.json();
}

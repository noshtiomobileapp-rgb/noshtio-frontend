const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function loginVendor(
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    credentials: "include", // 🔒 REQUIRED
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Login failed");
  }
}

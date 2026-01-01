const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE is not defined");
}

type LoginResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

export async function loginVendor(
  email: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data: LoginResponse;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid auth response");
  }

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data.message || "Login failed");
  }

  return { token: data.token };
}

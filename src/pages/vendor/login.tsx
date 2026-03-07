"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { apiPost } from "@/lib/apiClient";

export default function VendorLoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();

```
setError(null);
setLoading(true);

try {
  const data = await apiPost("/api/auth/login", {
    email,
    password,
  });

  console.log("Login response:", data);

  // Validate backend response
  if (!data?.success) {
    throw new Error(data?.message || "Login failed");
  }

  // 🔑 Save authentication token
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  // Optional session info
  localStorage.setItem("vendorEmail", email);

  // Redirect to dashboard
  router.push("/vendor/dashboard");

} catch (err: any) {
  console.error("Login error:", err);
  setError(err?.message || "Login failed");
} finally {
  setLoading(false);
}
```

}

return (
<div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
<h1 style={{ marginBottom: 20 }}>Vendor Login</h1>

```
  <form onSubmit={handleSubmit}>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      style={{
        width: "100%",
        marginBottom: 12,
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 6,
      }}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={{
        width: "100%",
        marginBottom: 12,
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 6,
      }}
    />

    {error && (
      <p style={{ color: "red", marginBottom: 12 }}>
        {error}
      </p>
    )}

    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: 10,
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>
```

);
}

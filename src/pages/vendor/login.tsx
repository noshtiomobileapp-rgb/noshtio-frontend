import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { apiClient } from "@/lib/apiClient";

export default function VendorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      // ✅ Cookie-based auth established by backend
      // ✅ One-way redirect only
      router.replace("/vendor/menu");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Vendor Login | Noshtio</title>
      </Head>

      <div style={{ maxWidth: 420, margin: "80px auto" }}>
        <h2>Vendor Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: 8 }}>
            {error}
          </div>
        )}
      </div>
    </>
  );
}

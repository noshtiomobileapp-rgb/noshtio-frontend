"use client";

import { useState } from "react";
import { loginVendor } from "@/api/auth";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const { token } = await loginVendor(email, password);

      // 🔒 REQUIRED FOR MIDDLEWARE
      document.cookie = `token=${token}; path=/; max-age=86400`;

      // Optional client-side usage
      localStorage.setItem("token", token);

      // Hard redirect to trigger middleware
      window.location.href = "/vendor/menu";
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h2>Vendor Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

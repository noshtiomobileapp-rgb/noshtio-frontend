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

    setError(null);
    setLoading(true);

    try {
      const data = await apiPost("/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      // Save JWT token
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Optional
      localStorage.setItem("vendorEmail", email);

      // Redirect
      router.push("/vendor/dashboard");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h1>Vendor Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
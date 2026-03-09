"use client";

import { useState } from "react";
import { useRouter } from "next/router";

import { apiPost } from "@/lib/apiClient";

type LoginResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    role: string;
  };
};

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
      const data = (await apiPost("/api/auth/login", {
        email,
        password,
        role: "vendor",
      })) as LoginResponse;

      console.log("Login response:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      if (!data?.token) {
        throw new Error("Authentication token missing");
      }

      /*
      ============================================================
      SAVE AUTH TOKEN
      ============================================================
      */

      localStorage.setItem("token", data.token);

      /*
      Optional debugging / vendor info
      */

      localStorage.setItem("vendorEmail", email);

      if (data?.user?.id) {
        localStorage.setItem("vendorId", data.user.id);
      }

      /*
      ============================================================
      REDIRECT TO DASHBOARD
      ============================================================
      */

      router.replace("/vendor/dashboard");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "80px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Vendor Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ddd",
            borderRadius: 4,
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
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ddd",
            borderRadius: 4,
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
            padding: 12,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
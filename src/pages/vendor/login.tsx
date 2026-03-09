"use client";

import { useState } from "react";
import { useRouter } from "next/router";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://noshtio-backend.onrender.com";

export default function VendorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "vendor",
        }),
      });

      const data = await res.json();

      console.log("Login response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (!data?.token) {
        throw new Error("Token missing from server response");
      }

      /*
      ==============================================
      RESET OLD AUTH STATE
      ==============================================
      */

      localStorage.removeItem("token");
      localStorage.removeItem("vendorId");
      localStorage.removeItem("vendorEmail");

      /*
      ==============================================
      SAVE NEW TOKEN
      ==============================================
      */

      localStorage.setItem("token", data.token);

      if (data?.user?.id) {
        localStorage.setItem("vendorId", data.user.id);
      }

      localStorage.setItem("vendorEmail", email);

      /*
      ==============================================
      VERIFY TOKEN SAVED
      ==============================================
      */

      const savedToken = localStorage.getItem("token");

      console.log("Saved token:", savedToken);

      if (!savedToken) {
        throw new Error("Token failed to store in browser");
      }

      /*
      ==============================================
      SMALL DELAY (ensures storage commit)
      ==============================================
      */

      setTimeout(() => {
        router.replace("/vendor/dashboard");
      }, 150);

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
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
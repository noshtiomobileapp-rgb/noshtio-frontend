"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:4000/api/vendors";

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        credentials: "include", // REQUIRED for HTTP-only cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid login credentials");
      }

      // Login is successful → redirect to dashboard
      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white shadow-xl rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Vendor Login
        </h1>

        <label className="text-gray-600 text-sm">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-gray-600 text-sm">Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={() => router.push("/vendor/forgot-password")}
          className="w-full text-blue-600 text-sm mt-4"
        >
          Forgot Password?
        </button>

        <button
          onClick={() => router.push("/vendor/login-otp")}
          className="w-full text-blue-600 text-sm mt-2"
        >
          Login with Mobile OTP
        </button>

      </div>
    </div>
  );
}

import { useState } from "react";
import Head from "next/head";
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

      await loginVendor(email.trim(), password.trim());

      // 🔒 OPTION B: Trust backend + middleware
      window.location.replace("/vendor/menu");
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
    </>
  );
}

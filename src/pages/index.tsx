"use client";

import { useEffect, useState } from "react";

/* ============================================================
   TYPES (MVP SAFE)
============================================================ */

type Summary = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue?: number;
};

type DashboardResponse = {
  summary: Summary;
};

/* ============================================================
   PAGE
============================================================ */

export default function HomePage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        /**
         * ✅ IMPORTANT
         * Use FRONTEND proxy so auth cookie is included
         */
        const res = await fetch("/api/vendor/analytics/summary");

        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        const json: DashboardResponse = await res.json();

        if (!json?.summary) {
          throw new Error("Invalid dashboard data");
        }

        setData(json);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /* ============================================================
     STATES
  ============================================================ */

  if (loading) {
    return <p style={{ padding: 20 }}>Loading dashboard…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 20, color: "red" }}>
        {error}
      </p>
    );
  }

  if (!data) {
    return (
      <p style={{ padding: 20 }}>
        No dashboard data available
      </p>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  const { summary } = data;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <p>Total Orders: {summary.totalOrders}</p>
      <p>Total Revenue: ₹{summary.totalRevenue}</p>
      <p>
        Avg Order Value: ₹
        {summary.averageOrderValue ?? 0}
      </p>
    </div>
  );
}

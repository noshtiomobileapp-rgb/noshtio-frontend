"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import VendorLayout from "@/components/vendor/VendorLayout";
import DashboardKpis from "@/components/vendor/dashboard/DashboardKpis";

import { apiGet } from "@/lib/apiClient";

/* ============================================================
   TYPES — API RESPONSES
============================================================ */

type VendorMe = {
  _id: string;
  name: string;
  email: string;
  role: "vendor";
};

type AnalyticsResponse = {
  data: {
    totalOrders: number;
    totalRevenue: number;
    menuCount: number;
  };
};

type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

/* ============================================================
   PAGE — VENDOR DASHBOARD (COOKIE AUTH · SAFE)
============================================================ */

export default function VendorDashboardPage() {
  const router = useRouter();

  const [vendor, setVendor] = useState<VendorMe | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalOrders: 0,
    totalRevenue: 0,
    menuCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD VENDOR + ANALYTICS
  ============================================================ */
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [vendorRes, analyticsRes] = await Promise.all([
          apiGet<VendorMe>("/api/vendor/me"),
          apiGet<AnalyticsResponse>("/api/vendor/analytics/summary"),
        ]);

        if (cancelled) return;

        setVendor(vendorRes);
        setSummary({
          totalOrders: Number(analyticsRes.data.totalOrders ?? 0),
          totalRevenue: Number(analyticsRes.data.totalRevenue ?? 0),
          menuCount: Number(analyticsRes.data.menuCount ?? 0),
        });
      } catch (err: any) {
        if (cancelled) return;

        if (err?.status === 401) {
          router.replace("/vendor/login");
          return;
        }

        setError("Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  /* ============================================================
     RENDER GUARDS
  ============================================================ */

  if (loading) {
    return <div>Loading dashboard…</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!vendor) {
    return null;
  }

  /* ============================================================
     MAIN VIEW
  ============================================================ */

  return (
    <VendorLayout
      vendor={vendor}
      active="dashboard"
      onNavigate={(key) => router.push(`/vendor/${key}`)}
    >
      <DashboardKpis summary={summary} />
    </VendorLayout>
  );
}

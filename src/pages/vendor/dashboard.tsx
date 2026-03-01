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

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [vendorRes, analyticsRes] = await Promise.all([
          apiGet("/api/vendor/me"),
          apiGet("/api/vendor/analytics/summary"),
        ]);

        if (cancelled) return;

        setVendor(vendorRes as VendorMe);

        const analytics = analyticsRes as AnalyticsResponse;

        setSummary({
          totalOrders: Number(analytics?.data?.totalOrders ?? 0),
          totalRevenue: Number(analytics?.data?.totalRevenue ?? 0),
          menuCount: Number(analytics?.data?.menuCount ?? 0),
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

  if (loading) return <div>Loading dashboard…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!vendor) return null;

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
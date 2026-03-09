"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import VendorLayout from "@/components/vendor/VendorLayout";
import DashboardKpis from "@/components/vendor/dashboard/DashboardKpis";

import { vendorFetch } from "@/lib/vendorApi";

/* ============================================================
   TYPES — API RESPONSES
============================================================ */

type VendorMe = {
  vendorId: string;
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
   PAGE — VENDOR DASHBOARD
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
          vendorFetch<VendorMe>("/api/vendor/me"),
          vendorFetch<AnalyticsResponse>("/api/vendor/analytics/summary"),
        ]);

        if (cancelled) return;

        setVendor(vendorRes);

        setSummary({
          totalOrders: Number(analyticsRes?.data?.totalOrders ?? 0),
          totalRevenue: Number(analyticsRes?.data?.totalRevenue ?? 0),
          menuCount: Number(analyticsRes?.data?.menuCount ?? 0),
        });
      } catch (err: any) {
        if (cancelled) return;

        console.error("Dashboard load error:", err);

        if (err?.message === "Unauthorized") {
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

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

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
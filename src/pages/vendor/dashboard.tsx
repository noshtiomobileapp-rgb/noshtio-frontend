"use client";

import { useEffect, useState } from "react";
import VendorLayout from "@/components/vendor/VendorLayout";
import DashboardKpis from "@/components/vendor/dashboard/DashboardKpis";

/* ============================================================
   TYPES
============================================================ */

type NavKey = "dashboard" | "orders" | "menu" | "profile";

type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

/* ============================================================
   PAGE
============================================================ */

export default function VendorDashboardPage() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [vendor, setVendor] = useState<any>(null);

  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalOrders: 0,
    totalRevenue: 0,
    menuCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     AUTH + DATA LOAD
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.replace("/vendor/login");
          return;
        }

        const [vendorRes, analyticsRes] = await Promise.all([
          fetch("http://localhost:4000/api/vendor/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/api/vendor/analytics/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (vendorRes.status === 401 || analyticsRes.status === 401) {
          localStorage.removeItem("token");
          window.location.replace("/vendor/login");
          return;
        }

        const vendorData = await vendorRes.json();
        const analyticsData = await analyticsRes.json();

        if (!cancelled) {
          setVendor(vendorData);
          setSummary({
            totalOrders: Number(analyticsData?.data?.totalOrders ?? 0),
            totalRevenue: Number(analyticsData?.data?.totalRevenue ?? 0),
            menuCount: Number(analyticsData?.data?.menuCount ?? 0),
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ============================================================
     RENDER GUARDS
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  const isEmpty =
    summary.totalOrders === 0 &&
    summary.totalRevenue === 0 &&
    summary.menuCount === 0;

  /* ============================================================
     MAIN VIEW (INSIDE VENDOR LAYOUT)
  ============================================================ */

  return (
    <VendorLayout
      vendor={vendor}
      active={active}
      onNavigate={setActive}
    >
      {isEmpty ? (
        <div className="border border-dashed border-neutral-300 rounded-lg p-10 text-center bg-white">
          <h2 className="text-lg font-medium mb-2">
            No activity yet
          </h2>
          <p className="text-sm text-neutral-600">
            Add your menu to start receiving orders.
          </p>
        </div>
      ) : (
        <DashboardKpis summary={summary} />
      )}
    </VendorLayout>
  );
}

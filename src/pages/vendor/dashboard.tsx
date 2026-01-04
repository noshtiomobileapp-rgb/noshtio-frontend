"use client";

import { useEffect, useState } from "react";
import VendorLayout from "@/components/vendor/VendorLayout";
import DashboardKpis from "@/components/vendor/dashboard/DashboardKpis";

type NavKey = "dashboard" | "orders" | "menu" | "profile";

type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
}

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

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/vendor/login";
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [meRes, analyticsRes] = await Promise.all([
          fetch(`${API_BASE}/api/vendor/me`, { headers }),
          fetch(`${API_BASE}/api/vendor/analytics/summary`, { headers }),
        ]);

        if (meRes.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/vendor/login";
          return;
        }

        const vendorData = await meRes.json();
        const analyticsData = await analyticsRes.json();

        setVendor(vendorData);
        setSummary({
          totalOrders: Number(analyticsData?.data?.totalOrders ?? 0),
          totalRevenue: Number(analyticsData?.data?.totalRevenue ?? 0),
          menuCount: Number(analyticsData?.data?.menuCount ?? 0),
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading dashboard…</div>;
  if (error) return <div>{error}</div>;
  if (!vendor) return null;

  return (
    <VendorLayout vendor={vendor} active={active} onNavigate={setActive}>
      <DashboardKpis summary={summary} />
    </VendorLayout>
  );
}

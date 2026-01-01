"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DashboardKpis from "@/components/vendor/dashboard/DashboardKpis";

type NavKey = "dashboard" | "orders" | "menu" | "profile";

type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

export default function VendorDashboardPage() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [vendor, setVendor] = useState<any>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [vendorRes, analyticsRes] = await Promise.all([
          fetch("http://localhost:4000/api/vendors/me", {
            credentials: "include",
          }),
          fetch("http://localhost:4000/api/vendor/analytics/summary", {
            credentials: "include",
          }),
        ]);

        const vendorData = await vendorRes.json();
        const analyticsData = await analyticsRes.json();

        if (!vendorRes.ok) throw new Error(vendorData.message);
        if (!analyticsRes.ok) throw new Error(analyticsData.message);

        setVendor(vendorData);
        setSummary(analyticsData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!vendor || !summary) return <p className="p-6">No data available.</p>;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar vendor={vendor} active={active} onNavigate={setActive} />

      <div className="flex-1">
        <TopNav vendor={vendor} />

        <main className="p-6">
          {active === "dashboard" && (
            <DashboardKpis summary={summary} />
          )}
        </main>
      </div>
    </div>
  );
}

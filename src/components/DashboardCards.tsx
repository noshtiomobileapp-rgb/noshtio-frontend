// components/DashboardCards.tsx
"use client";

import React, { useEffect, useState } from "react";

interface DashboardCardsProps {
  vendor?: any;
}

export default function DashboardCards({ vendor }: DashboardCardsProps) {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    revenue: 0,
    avgOrder: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try to fetch vendor-specific metrics from backend if available
        if (!vendor?._id) {
          setMetrics({ totalOrders: 0, revenue: 0, avgOrder: 0, pending: 0 });
          return;
        }

        // If you have a metrics endpoint, replace the URL below
        const res = await fetch(`http://localhost:4000/api/vendors/${vendor._id}/metrics`, {
          credentials: "include",
        }).catch(() => null);

        if (res && res.ok) {
          const j = await res.json();
          setMetrics({
            totalOrders: j.totalOrders ?? 0,
            revenue: j.revenue ?? 0,
            avgOrder: j.avgOrder ?? 0,
            pending: j.pending ?? 0,
          });
        } else {
          // fallback to dummy values or compute from orders endpoint
          setMetrics({ totalOrders: 0, revenue: 0, avgOrder: 0, pending: 0 });
        }
      } catch (e) {
        setMetrics({ totalOrders: 0, revenue: 0, avgOrder: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [vendor]);

  if (loading) return <div className="p-4">Loading overview...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Orders" value={metrics.totalOrders} />
      <Card title="Revenue" value={formatCurrency(metrics.revenue)} />
      <Card title="Avg Order Value" value={formatCurrency(metrics.avgOrder)} />
      <Card title="Pending" value={metrics.pending} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);
}

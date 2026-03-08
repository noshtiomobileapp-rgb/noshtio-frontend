"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

/* ============================================================
   Types
============================================================ */

type DashboardSummary = {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
};

type MenuStatus = {
  hasDraft: boolean;
  hasPublished: boolean;
};

/* ============================================================
   Page
============================================================ */

export default function VendorDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<MenuStatus | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [menuData, summaryData] = await Promise.all([
          apiClient("/api/vendor/menu/status"),
          apiClient("/api/vendor/analytics/summary"),
        ]);

        if (cancelled) return;

        if (menuData) {
          setMenu(menuData);
        }

        if (summaryData) {
          setSummary(summaryData);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div>Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      {!summary && (
        <div className="text-gray-500">
          Dashboard loaded. Data will appear once backend services are available.
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Kpi label="Orders Today" value={summary.ordersToday} />
          <Kpi label="Revenue Today" value={`₹${summary.revenueToday}`} />
          <Kpi label="Pending Orders" value={summary.pendingOrders} />
        </div>
      )}

      {menu && !menu.hasPublished && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <div className="font-medium">Your menu is not live yet</div>
          <div className="text-sm text-gray-700 mt-1">
            {menu.hasDraft
              ? "You have a draft menu ready. Publish it to start receiving orders."
              : "Upload your menu to start receiving orders."}
          </div>

          <Link
            href="/vendor/menu"
            className="inline-block mt-2 text-blue-600 underline text-sm"
          >
            Go to Menu
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction href="/vendor/orders" label="View Orders" />
        <QuickAction href="/vendor/menu" label="Manage Menu" />
        <QuickAction href="/vendor/analytics" label="View Analytics" />
      </div>
    </div>
  );
}

/* ============================================================
   Components
============================================================ */

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function QuickAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700"
    >
      {label}
    </Link>
  );
}
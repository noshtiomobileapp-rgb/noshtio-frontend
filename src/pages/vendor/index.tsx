"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
   Helpers
============================================================ */

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ============================================================
   Page — ACCESS FIRST (LOCKED)
============================================================ */

export default function VendorDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<MenuStatus | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const headers = getAuthHeaders();

        const [menuRes, summaryRes] = await Promise.allSettled([
          fetch("/api/vendor/menu/status", { headers }),
          fetch("/api/vendor/orders/summary", { headers }),
        ]);

        if (cancelled) return;

        if (
          menuRes.status === "fulfilled" &&
          menuRes.value.ok
        ) {
          setMenu(await menuRes.value.json());
        }

        if (
          summaryRes.status === "fulfilled" &&
          summaryRes.value.ok
        ) {
          setSummary(await summaryRes.value.json());
        }
      } catch {
        // ❗ Access-first rule: NEVER block dashboard
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ============================================================
     Rendering
  ============================================================ */

  if (loading) {
    return <div>Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      {!summary && (
        <div className="text-gray-500">
          Dashboard loaded. Data will appear once backend
          services are available.
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Kpi label="Orders Today" value={summary.ordersToday} />
          <Kpi
            label="Revenue Today"
            value={`₹${summary.revenueToday}`}
          />
          <Kpi
            label="Pending Orders"
            value={summary.pendingOrders}
          />
        </div>
      )}

      {menu && !menu.hasPublished && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <div className="font-medium">
            Your menu is not live yet
          </div>
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
        <QuickAction
          href="/vendor/analytics"
          label="View Analytics"
        />
      </div>
    </div>
  );
}

/* ============================================================
   Small Components
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

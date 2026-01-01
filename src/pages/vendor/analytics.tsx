"use client";

import React, { useEffect, useState } from "react";
import {
  getSummary,
  getOrdersPerDay,
  getStatusWise,
  type AnalyticsSummary,
  type OrdersPerDay,
  type StatusWise,
} from "@/api/vendorAnalytics";

import AnalyticsKpis from "@/components/vendor/analytics/AnalyticsKpis";
import OrdersPerDayChart from "@/components/vendor/analytics/OrdersPerDayChart";
import StatusBreakdown from "@/components/vendor/analytics/StatusBreakdown";
import AnalyticsEmptyState from "@/components/vendor/analytics/AnalyticsEmptyState";
import VendorAuthGate from "@/components/auth/VendorAuthGate";

/* ============================================================
   ANALYTICS CONTENT (PURE — AUTH HANDLED BY GATE)
============================================================ */

function AnalyticsContent() {
  const [range, setRange] = useState<7 | 30>(7);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [orders, setOrders] = useState<OrdersPerDay[]>([]);
  const [statuses, setStatuses] = useState<StatusWise[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);

        /**
         * REQUIRED ANALYTICS (FAIL PAGE IF ANY FAIL)
         */
        const summaryPromise = getSummary(range);
        const ordersPromise = getOrdersPerDay(range);

        /**
         * OPTIONAL ANALYTICS (NON-BLOCKING)
         * Status breakdown must NEVER break the page.
         */
        const statusPromise = getStatusWise().catch(() => []);

        const [s, o, st] = await Promise.all([
          summaryPromise,
          ordersPromise,
          statusPromise,
        ]);

        if (cancelled) return;

        setSummary(s);
        setOrders(o);
        setStatuses(st);
      } catch (err) {
        console.error("ANALYTICS LOAD ERROR:", err);
        if (!cancelled) {
          setError(
            "Failed to load analytics. Please refresh the page or try again later."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [range]);

  /* ============================================================
     RENDER STATES — STRICT & MVP-CORRECT
  ============================================================ */

  if (loading) {
    return <div className="p-4">Loading analytics…</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  /**
   * NO-DATA STATE (MVP-CORRECT)
   *
   * Show empty state ONLY when:
   * - Summary exists
   * - Vendor has ZERO lifetime orders
   *
   * Orders array MAY be empty due to date filtering.
   */
  const hasNoData =
    summary !== null && summary.totalOrders === 0;

  if (hasNoData) {
    return <AnalyticsEmptyState />;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-2">
        <button
          onClick={() => setRange(7)}
          className={`px-3 py-1 border rounded ${
            range === 7 ? "font-semibold" : ""
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setRange(30)}
          className={`px-3 py-1 border rounded ${
            range === 30 ? "font-semibold" : ""
          }`}
        >
          30 Days
        </button>
      </div>

      {/* KPIs are safe once summary exists */}
      {summary && <AnalyticsKpis {...summary} />}

      {/* Charts tolerate empty datasets */}
      <OrdersPerDayChart data={orders} />

      {statuses.length > 0 && (
        <StatusBreakdown data={statuses} />
      )}
    </div>
  );
}

/* ============================================================
   PAGE EXPORT — AUTH WRAPPED
============================================================ */

export default function VendorAnalyticsPage() {
  return (
    <VendorAuthGate>
      <AnalyticsContent />
    </VendorAuthGate>
  );
}

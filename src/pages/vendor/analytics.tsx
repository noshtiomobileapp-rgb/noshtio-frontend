"use client";

import { useEffect, useMemo, useState } from "react";
import { getVendorOrders } from "@/api/order.api";

/* ============================================================
   ANALYTICS-SAFE TYPES (MATCH API GUARANTEES)
   ============================================================ */

type AnalyticsItem = {
  name: string;
  qty: number;
};

type AnalyticsOrder = {
  id: string;
  createdAt: string;
  status: string;
  items: AnalyticsItem[];
};

/* ============================================================
   Constants
   ============================================================ */

type TimeRange = 7 | 30;
const TIME_RANGES: TimeRange[] = [7, 30];

/* ============================================================
   Helpers
   ============================================================ */

function isWithinRange(date: string, days: number) {
  return (
    Date.now() - new Date(date).getTime() <=
    days * 24 * 60 * 60 * 1000
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

/* ============================================================
   Page
   ============================================================ */

export default function VendorAnalyticsPage() {
  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>(7);

  /* ------------------------------------------------------------
     Load Orders (NORMALIZE API → UI)
     ------------------------------------------------------------ */

  useEffect(() => {
    async function load() {
      setLoading(true);

      const res = await getVendorOrders("COMPLETED");

      const normalized: AnalyticsOrder[] = res.data.map(
        (order) => ({
          id: order.id,
          createdAt: order.createdAt,
          status: order.status,
          items:
            order.items?.map((item) => ({
              name: item.name,
              qty: item.qty,
            })) ?? [],
        })
      );

      setOrders(normalized);
      setLoading(false);
    }

    load();
  }, []);

  /* ------------------------------------------------------------
     Filtered Orders
     ------------------------------------------------------------ */

  const filteredOrders = useMemo(
    () => orders.filter((o) => isWithinRange(o.createdAt, range)),
    [orders, range]
  );

  /* ------------------------------------------------------------
     Aggregations (MVP-SAFE)
     ------------------------------------------------------------ */

  const analytics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    let totalItems = 0;

    const itemMap = new Map<string, number>();
    const ordersPerDay = new Map<string, number>();

    for (const order of filteredOrders) {
      const day = formatDate(order.createdAt);
      ordersPerDay.set(day, (ordersPerDay.get(day) ?? 0) + 1);

      for (const item of order.items) {
        totalItems += item.qty;
        itemMap.set(
          item.name,
          (itemMap.get(item.name) ?? 0) + item.qty
        );
      }
    }

    return {
      totalOrders,
      avgItemsPerOrder:
        totalOrders === 0 ? 0 : totalItems / totalOrders,

      topItems: Array.from(itemMap.entries())
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5),

      ordersPerDay: Array.from(ordersPerDay.entries()).map(
        ([date, count]) => ({ date, count })
      ),
    };
  }, [filteredOrders]);

  /* ------------------------------------------------------------
     Render
     ------------------------------------------------------------ */

  if (loading) {
    return <div className="p-4">Loading analytics…</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Analytics</h1>
        <div className="flex gap-2">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded border ${
                range === r
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {r} days
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Orders" value={analytics.totalOrders} />
        <Stat
          label="Avg Items / Order"
          value={analytics.avgItemsPerOrder.toFixed(1)}
        />
      </div>

      {/* Orders per Day */}
      <Section title="Orders per Day">
        <Table
          headers={["Date", "Orders"]}
          rows={analytics.ordersPerDay.map((o) => [
            o.date,
            o.count,
          ])}
        />
      </Section>

      {/* Top Items */}
      <Section title="Top Selling Items">
        <Table
          headers={["Item", "Qty"]}
          rows={analytics.topItems.map((i) => [
            i.name,
            i.qty,
          ])}
        />
      </Section>
    </div>
  );
}

/* ============================================================
   UI Helpers (MVP-ONLY)
   ============================================================ */

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border rounded p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-medium mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h) => (
            <th key={h} className="text-left p-2 border-b">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b">
            {r.map((c, j) => (
              <td key={j} className="p-2">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

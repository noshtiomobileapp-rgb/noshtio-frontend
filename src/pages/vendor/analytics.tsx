"use client";

import { useEffect, useMemo, useState } from "react";
import { getVendorOrders } from "@/api/order.api";

/* ============================================================
   Types (MVP-SAFE)
   ============================================================ */

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  categoryName?: string;
};

type VendorOrder = {
  id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
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
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

/* ============================================================
   Page
   ============================================================ */

export default function VendorAnalyticsPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>(7);

  /* ------------------------------------------------------------
     Load Orders
     ------------------------------------------------------------ */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getVendorOrders(); // existing API
      setOrders(res);
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
     Aggregations
     ------------------------------------------------------------ */

  const analytics = useMemo(() => {
    let revenueTotal = 0;
    let totalOrders = filteredOrders.length;

    const itemMap = new Map<
      string,
      { qty: number; revenue: number }
    >();

    const categoryMap = new Map<
      string,
      { qty: number; revenue: number }
    >();

    const ordersPerDay = new Map<string, number>();

    for (const order of filteredOrders) {
      const day = formatDate(order.createdAt);
      ordersPerDay.set(day, (ordersPerDay.get(day) ?? 0) + 1);

      for (const item of order.items) {
        const itemRevenue = item.qty * item.price;
        revenueTotal += itemRevenue;

        // Items
        const i = itemMap.get(item.name) ?? {
          qty: 0,
          revenue: 0,
        };
        i.qty += item.qty;
        i.revenue += itemRevenue;
        itemMap.set(item.name, i);

        // Categories
        const cat = item.categoryName ?? "Uncategorized";
        const c = categoryMap.get(cat) ?? {
          qty: 0,
          revenue: 0,
        };
        c.qty += item.qty;
        c.revenue += itemRevenue;
        categoryMap.set(cat, c);
      }
    }

    return {
      revenueTotal,
      totalOrders,
      avgOrderValue:
        totalOrders === 0 ? 0 : revenueTotal / totalOrders,

      topItems: Array.from(itemMap.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5),

      categoryPerformance: Array.from(categoryMap.entries()).map(
        ([category, v]) => ({ category, ...v })
      ),

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

      {/* Revenue Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Revenue" value={`₹${analytics.revenueTotal}`} />
        <Stat label="Orders" value={analytics.totalOrders} />
        <Stat
          label="Avg Order"
          value={`₹${analytics.avgOrderValue.toFixed(0)}`}
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
          headers={["Item", "Qty", "Revenue"]}
          rows={analytics.topItems.map((i) => [
            i.name,
            i.qty,
            `₹${i.revenue}`,
          ])}
        />
      </Section>

      {/* Category Performance */}
      <Section title="Category Performance">
        <Table
          headers={["Category", "Qty", "Revenue"]}
          rows={analytics.categoryPerformance.map((c) => [
            c.category,
            c.qty,
            `₹${c.revenue}`,
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

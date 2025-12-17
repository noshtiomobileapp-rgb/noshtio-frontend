"use client";

import React, { useEffect, useState } from "react";

export default function OrdersTable({ }: {}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try a vendor-agnostic endpoint. If you have vendor-specific, replace with vendor id.
        const res = await fetch("http://localhost:4000/api/orders", { credentials: "include" }).catch(() => null);
        if (res && res.ok) {
          const j = await res.json();
          setOrders(Array.isArray(j) ? j : []);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = orders.filter((o) =>
    [o.id, o.customer, o.status, (o.total || "") + ""].join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input placeholder="Search orders" className="border rounded px-3 py-2" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <div className="text-sm text-slate-500">Showing {filtered.length} results</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left">
            <tr>
              <th className="py-2">Order</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Items</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id || o._id} className="border-t">
                <td className="py-3">{o.id || o._id}</td>
                <td className="py-3">{o.customer || o.customerName || "—"}</td>
                <td className="py-3">{(o.items && o.items.length) || o.itemsCount || 0}</td>
                <td className="py-3">{formatCurrency(o.total || 0)}</td>
                <td className="py-3">{o.status || "New"}</td>
                <td className="py-3">
                  <button className="text-sm underline" onClick={() => alert(JSON.stringify(o, null, 2))}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);
}

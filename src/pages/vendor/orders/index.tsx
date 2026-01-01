"use client";

import { useEffect, useState } from "react";
import { vendorFetch } from "@/lib/vendorApi";
import OrderDrawer from "@/components/order/OrderDrawer";

/* ============================================================
   Types
============================================================ */

export type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "READY"
  | "COMPLETED";

export type VendorOrder = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  tableLabel?: string;
  sessionId?: string;
};

/* ============================================================
   Constants
============================================================ */

const TABS: { label: string; value: OrderStatus }[] = [
  { label: "New", value: "NEW" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COMPLETED" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  PREPARING: "bg-yellow-100 text-yellow-800",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-200 text-gray-700",
};

/* ============================================================
   Helpers
============================================================ */

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function getNextStatus(status: OrderStatus): OrderStatus | null {
  if (status === "NEW") return "PREPARING";
  if (status === "PREPARING") return "READY";
  if (status === "READY") return "COMPLETED";
  return null;
}

/* ============================================================
   Page
============================================================ */

export default function VendorOrdersPage() {
  const [activeStatus, setActiveStatus] =
    useState<OrderStatus>("NEW");
  const [orders, setOrders] =
    useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await vendorFetch<VendorOrder[]>(
          `/api/vendor/orders?status=${activeStatus}`
        );

        if (!cancelled) setOrders(data ?? []);
      } catch {
        if (!cancelled) {
          setOrders([]);
          setError("Failed to load orders");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 6000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeStatus]);

  async function updateStatus(
    orderId: string,
    status: OrderStatus
  ) {
    const next = getNextStatus(status);
    if (!next) return;

    try {
      setActingId(orderId);
      await vendorFetch(
        `/api/vendor/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: next }),
        }
      );
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveStatus(t.value)}
            className={`px-3 py-1 rounded ${
              activeStatus === t.value
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading orders…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders.</div>
      ) : (
        orders.map((o) => (
          <div
            key={o.id}
            className="border rounded p-3 flex justify-between bg-white"
          >
            <div
              onClick={() => setSelectedOrderId(o.id)}
              className="cursor-pointer"
            >
              <div>Order #{o.id.slice(-6)}</div>
              <div className="text-xs">
                {timeAgo(o.createdAt)}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span
                className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[o.status]}`}
              >
                {o.status}
              </span>

              {getNextStatus(o.status) && (
                <button
                  disabled={actingId === o.id}
                  onClick={() =>
                    updateStatus(o.id, o.status)
                  }
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <OrderDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}

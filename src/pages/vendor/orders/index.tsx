"use client";

import { useEffect, useState } from "react";
import {
  getVendorOrders,
  VendorOrder,
  OrderStatus,
} from "@/api/order.api";
import OrderDrawer from "@/components/order/OrderDrawer";

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

/* ============================================================
   Page
============================================================ */

export default function VendorOrdersPage() {
  const [activeStatus, setActiveStatus] =
    useState<OrderStatus>("NEW");
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ NEW: selected order for drawer
  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await getVendorOrders(activeStatus);
        setOrders(res.data ?? []);
      } catch (error) {
        console.error("Failed to fetch vendor orders", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    intervalId = setInterval(fetchOrders, 6000);

    return () => clearInterval(intervalId);
  }, [activeStatus]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>

      {/* ================= Tabs ================= */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-3 py-1 rounded text-sm ${
              activeStatus === tab.value
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= List ================= */}
      {loading ? (
        <div className="text-sm text-gray-500">
          Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500">
          No orders
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className="border rounded p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  Order #{order.id.slice(-6)}
                </div>

                <div className="text-xs text-gray-500">
                  {order.tableLabel ?? order.sessionId}
                </div>

                <div className="text-xs text-gray-400">
                  {timeAgo(order.createdAt)}
                </div>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  STATUS_STYLES[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= Drawer ================= */}
      <OrderDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}

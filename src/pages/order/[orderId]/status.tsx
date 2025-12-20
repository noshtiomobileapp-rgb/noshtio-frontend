"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getCustomerOrder } from "@/api/order.api";
import { Order, OrderStatus } from "@/contracts/order.contract";
import OrderTimeline from "@/components/order/OrderTimeline";
import { button, text } from "@/styles/tokens";

export default function OrderStatusPage() {
  const router = useRouter();
  const rawOrderId = router.query.orderId;

  const orderId =
    typeof rawOrderId === "string" ? rawOrderId : null;

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchOrder(id: string) {
    try {
      setRefreshing(true);
      const res = await getCustomerOrder(id);
      setOrder(res.data);
      setError(null);
    } catch {
      setError("Unable to refresh order status. Retrying…");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!orderId) return;

    let active = true;

    const safeFetch = async () => {
      if (!active || !orderId) return;
      await fetchOrder(orderId);
    };

    safeFetch();
    const interval = setInterval(safeFetch, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (!orderId) {
    return <div className="p-4">Loading…</div>;
  }

  if (!order) {
    return <div className="p-4">Loading order status…</div>;
  }

  const isCompleted =
    order.status === OrderStatus.COMPLETED;
  const isCancelled =
    order.status === OrderStatus.CANCELLED;

  return (
    <div className="p-6 space-y-6">
      <h1 className={text.title}>Order status</h1>

      {/* Timeline */}
      <OrderTimeline currentStatus={order.status} />

      {/* Meta */}
      <div className="space-y-1">
        <p className={text.meta}>
          Order ID: {order._id}
        </p>
        <p className={text.meta}>
          Total: ₹{order.totalAmount}
        </p>
      </div>

      {/* Items */}
      <div className="pt-4 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between border-b pb-1"
          >
            <span className={text.body}>
              {item.name} × {item.qty}
            </span>
            <span className={text.meta}>
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal states */}
      {isCompleted && (
        <p className="pt-4 text-green-600 font-semibold">
          Order completed. Please collect your order.
        </p>
      )}

      {isCancelled && (
        <p className="pt-4 text-red-600 font-semibold">
          Order was cancelled.
        </p>
      )}

      {/* Error + manual refresh */}
      <div className="pt-2 space-y-2">
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={() => orderId && fetchOrder(orderId)}
          disabled={refreshing}
          className={button.ghost}
        >
          {refreshing ? "Refreshing…" : "Refresh status"}
        </button>
      </div>
    </div>
  );
}

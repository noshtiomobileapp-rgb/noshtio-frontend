"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomerOrder } from "@/api/order.api";
import { Order, OrderStatus } from "@/contracts/order.contract";

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let active = true;

    async function fetchOrder() {
      try {
        const res = await getCustomerOrder(orderId);
        if (active) setOrder(res.data);
      } catch {
        if (active) setError("Unable to load order");
      }
    }

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-4">Loading order...</div>;
  }

  const isDone =
    order.status === OrderStatus.COMPLETED ||
    order.status === OrderStatus.CANCELLED;

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Order Status</h1>

      <div>
        <strong>Status:</strong> {order.status}
      </div>

      <div>
        <strong>Total:</strong> ₹{order.totalAmount}
      </div>

      <div className="pt-4 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between border-b pb-1"
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {isDone && (
        <div className="pt-4 text-green-600 font-semibold">
          {order.status === OrderStatus.COMPLETED
            ? "Order completed"
            : "Order cancelled"}
        </div>
      )}
    </div>
  );
}

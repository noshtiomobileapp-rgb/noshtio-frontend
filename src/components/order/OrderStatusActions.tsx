"use client";

import { useState } from "react";
import {
  updateVendorOrderStatus,
  OrderStatus,
} from "@/api/order.api";

type Props = {
  orderId: string;
  status: OrderStatus;
  onSuccess: () => void;
};

const STATUS_ACTIONS: Record<
  OrderStatus,
  { label: string; next: OrderStatus } | null
> = {
  NEW: { label: "Accept Order", next: "PREPARING" },
  PREPARING: { label: "Mark Ready", next: "READY" },
  READY: { label: "Complete Order", next: "COMPLETED" },
  COMPLETED: null,
};

export default function OrderStatusActions({
  orderId,
  status,
  onSuccess,
}: Props) {
  const action = STATUS_ACTIONS[status];
  const [loading, setLoading] = useState(false);

  if (!action) return null;

  const { label, next } = action;

  async function handleClick() {
    setLoading(true);
    const res = await updateVendorOrderStatus(orderId, next);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      alert("Failed to update order status");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 bg-black text-white rounded disabled:opacity-50"
    >
      {loading ? "Updating…" : label}
    </button>
  );
}

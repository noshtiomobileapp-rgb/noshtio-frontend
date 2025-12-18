"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useSessionStore } from "@/store/session.store";
import { placeCustomerOrder } from "@/api/order.api";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const clearCart = useCartStore((s) => s.clearCart);

  const restaurantId = useSessionStore((s) => s.restaurantId);
  const sessionId = useSessionStore((s) => s.sessionId);

  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <div className="p-4">Your cart is empty</div>;
  }

  async function checkout() {
    if (!restaurantId || !sessionId) {
      alert("Session not initialized. Please refresh and try again.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await placeCustomerOrder({
        restaurantId,
        sessionId,
        items: items.map((item) => ({
          itemId: item.itemId,
          qty: item.qty,
        })),
      });

      clearCart();

      // 🔑 IMPORTANT: persist orderId in route
      router.push(`/order/${res.orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 space-y-3">
      {items.map((item) => (
        <div
          key={item.itemId}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>
            {item.name} × {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <div className="pt-4 border-t font-semibold">
        Total: ₹{totalAmount}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={checkout}
          disabled={submitting}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>

        <button
          onClick={clearCart}
          disabled={submitting}
          className="px-4 py-2 border rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

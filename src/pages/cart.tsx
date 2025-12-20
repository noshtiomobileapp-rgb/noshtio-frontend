"use client";

import { useRouter } from "next/router";
import { useState } from "react";

import { useCartStore } from "@/store/cart-store";
import { useSessionStore } from "@/store/session.store";
import { placeCustomerOrder } from "@/api/order.api";
import { button, text } from "@/styles/tokens";

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const clearCart = useCartStore((s) => s.clearCart);

  const restaurantId = useSessionStore((s) => s.restaurantId);
  const sessionId = useSessionStore((s) => s.sessionId);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    if (!restaurantId || !sessionId) {
      setError("Something went wrong. Please try again.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await placeCustomerOrder({
        restaurantId,
        sessionId,
        items: items.map((item) => ({
          itemId: item.itemId,
          qty: item.qty,
        })),
      });

      localStorage.setItem("lastOrderId", res.orderId);
      clearCart();
      router.push(`/customer/status/${res.orderId}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- Empty Cart ---------------- */
  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className={text.body}>
          Your cart is empty. Add items from the menu to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between items-center border rounded-md p-3"
          >
            <span className={text.body}>
              {item.name} × {item.qty}
            </span>
            <span className={text.meta}>
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}

        {error && (
          <p className="text-sm text-red-600 pt-2">
            {error}
          </p>
        )}
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <button
          onClick={checkout}
          disabled={submitting}
          className={`${button.primary} w-full min-h-[44px]`}
        >
          {submitting
            ? "Placing Order..."
            : `Place Order · ₹${totalAmount}`}
        </button>

        <button
          onClick={clearCart}
          disabled={submitting}
          className={`${button.ghost} w-full`}
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}

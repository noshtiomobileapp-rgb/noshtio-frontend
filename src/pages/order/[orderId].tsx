"use client";

import { useRouter } from "next/router";
import { button, text } from "@/styles/tokens";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query as { orderId?: string };

  if (!orderId) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className={text.title}>
        Order placed successfully
      </h1>

      <p className={text.meta}>
        Order ID: {orderId}
      </p>

      <p className={text.body}>
        Your order has been sent to the kitchen. You can track its status below.
      </p>

      <button
        onClick={() => router.push(`/order/${orderId}/status`)}
        className={`${button.primary} mt-4`}
      >
        View order status
      </button>
    </div>
  );
}

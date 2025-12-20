"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomerDashboard from "../_layout";

type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type OrderResponse = {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
};

const TERMINAL_STATES: OrderStatus[] = ["SERVED", "COMPLETED"];

export default function OrderStatusPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let timer: NodeJS.Timeout;

    async function fetchOrder() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/customer/order/${id}`
        );

        if (!res.ok) {
          throw new Error("Order not found");
        }

        const json = await res.json();
        setOrder(json.data);

        if (TERMINAL_STATES.includes(json.data.status)) {
          clearInterval(timer);
        }
      } catch (e: any) {
        setError(e.message);
        clearInterval(timer);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    timer = setInterval(fetchOrder, 6000);

    return () => clearInterval(timer);
  }, [id]);

  return (
    <CustomerDashboard>
      {loading && (
        <p className="text-center text-sm text-gray-500">
          Fetching order status…
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {order && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              Order #{order.id.slice(-6)}
            </h2>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-gray-100">
              {order.status}
            </span>
          </div>

          <div className="border rounded-md divide-y">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between px-3 py-2 text-sm"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.qty * item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold px-1">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {TERMINAL_STATES.includes(order.status) && (
            <p className="text-center text-green-600">
              Thank you! Your order is complete.
            </p>
          )}
        </div>
      )}
    </CustomerDashboard>
  );
}

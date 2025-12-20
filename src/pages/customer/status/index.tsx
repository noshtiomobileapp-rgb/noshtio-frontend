"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import CustomerDashboard from "../_layout";

export default function OrderStatusIndex() {
  const router = useRouter();

  useEffect(() => {
    const lastOrderId =
      typeof window !== "undefined"
        ? localStorage.getItem("lastOrderId")
        : null;

    if (lastOrderId) {
      router.replace(`/customer/status/${lastOrderId}`);
    }
  }, [router]);

  return (
    <CustomerDashboard>
      <div className="text-center text-sm text-gray-500 mt-12">
        No active orders yet.
      </div>
    </CustomerDashboard>
  );
}

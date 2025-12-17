"use client";

import React from "react";

export default function BottomBar({
  cart,
  total,
  onCheckout,
}: {
  cart: { id: string; name: string; qty: number; price: number }[];
  total: number;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 bg-yellow-50 border-t">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="min-w-[220px] bg-white p-3 rounded shadow">
          <div className="text-sm font-medium">Cart • {cart.reduce((s, i) => s + i.qty, 0)} item(s)</div>
          <div className="text-xs text-slate-600 truncate">{cart.map((i) => `${i.name} x${i.qty}`).join(", ")}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">₹{total}</div>
          <button onClick={onCheckout} className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

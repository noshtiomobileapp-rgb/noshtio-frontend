"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

export default function CartBar() {
  const router = useRouter();
  const totalQty = useCartStore((s) => s.totalQty());
  const totalAmount = useCartStore((s) => s.totalAmount());

  if (totalQty === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-600">{totalQty} items</p>
        <p className="font-semibold">₹{totalAmount}</p>
      </div>

      <button
        onClick={() => router.push("/cart")}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg"
      >
        View Cart
      </button>
    </div>
  );
}

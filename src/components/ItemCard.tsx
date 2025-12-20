"use client";

import { PublicMenuItemDTO } from "@/contracts/menu.contract";
import { useCartStore } from "@/store/cart-store";

export function ItemCard({ item }: { item: PublicMenuItemDTO }) {
  const qty = useCartStore((s) => s.getQuantity(item._id));
  const add = useCartStore((s) => s.addItem);

  return (
    <div
      className={`border p-3 rounded flex justify-between ${
        !item.available ? "opacity-50" : ""
      }`}
    >
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm">₹{item.price}</div>
      </div>

      <button
        disabled={!item.available}
        onClick={() =>
          add({ itemId: item._id, name: item.name, price: item.price })
        }
        className="px-3 py-1 bg-orange-500 text-white rounded disabled:bg-gray-300"
      >
        Add
      </button>
    </div>
  );
}

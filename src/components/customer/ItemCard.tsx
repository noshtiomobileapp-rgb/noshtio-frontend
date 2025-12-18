"use client";

import { useCartStore } from "@/store/cart-store";

type Item = {
  _id: string;
  name: string;
  price: number;
};

export default function ItemCard({ item }: { item: Item }) {
  const addItem = useCartStore((s) => s.addItem);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const qty = useCartStore((s) => s.getQuantity(item._id));

  return (
    <div className="border p-3 rounded flex justify-between items-center">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-600">₹{item.price}</p>
      </div>

      {qty === 0 ? (
        <button
          onClick={() =>
            addItem({
              itemId: item._id,
              name: item.name,
              price: item.price,
            })
          }
          className="px-3 py-1 border rounded"
        >
          Add
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => decrease(item._id)}
            className="px-2 py-1 border rounded"
          >
            –
          </button>

          <span className="min-w-[20px] text-center font-semibold">
            {qty}
          </span>

          <button
            onClick={() => increase(item._id)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

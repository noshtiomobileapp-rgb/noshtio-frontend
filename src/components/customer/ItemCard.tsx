"use client";

import { useCartStore } from "@/store/cart-store";
import { text, button } from "@/styles/tokens";

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
    <div className="border rounded-md p-3 flex flex-col gap-2">
      {/* Title + Price */}
      <div className="flex justify-between items-center">
        <span className={text.body}>{item.name}</span>
        <span className={text.meta}>₹{item.price}</span>
      </div>

      {/* Action Row (fixed height to prevent jump) */}
      <div className="flex justify-end min-h-[36px]">
        {qty === 0 ? (
          <button
            className={button.primary}
            onClick={() =>
              addItem({
                itemId: item._id,
                name: item.name,
                price: item.price,
              })
            }
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className={button.ghost}
              onClick={() => decrease(item._id)}
            >
              −
            </button>

            <span className="min-w-[20px] text-center font-medium">
              {qty}
            </span>

            <button
              className={button.ghost}
              onClick={() => increase(item._id)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

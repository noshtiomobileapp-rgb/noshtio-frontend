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
    <div className="border rounded-md p-3 flex flex-col gap-2 bg-white">
      {/* Title + Price */}
      <div className="flex justify-between items-center">
        <span className={`${text.body} font-semibold`}>
          {item.name}
        </span>
        <span className={text.meta}>₹{item.price}</span>
      </div>

      {/* Action Row (fixed height to prevent jump) */}
      <div className="flex justify-end min-h-[44px]">
        {qty === 0 ? (
          <button
            className={`${button.primary} min-h-[44px] active:bg-gray-800`}
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
              className={`${button.ghost} min-h-[44px] min-w-[44px] active:bg-gray-100 rounded-md`}
              onClick={() => decrease(item._id)}
            >
              −
            </button>

            <span className="min-w-[20px] text-center font-medium">
              {qty}
            </span>

            <button
              className={`${button.ghost} min-h-[44px] min-w-[44px] active:bg-gray-100 rounded-md`}
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

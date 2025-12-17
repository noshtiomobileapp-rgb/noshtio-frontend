"use client";

import React from "react";
import { useCartStore } from "@/store/cart-store";

export default function ItemCard({
  item,
}: {
  item: { id: string; name: string; desc: string; price: number; img?: string };
}) {
  const addItem = useCartStore((s) => s.addItem);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const qty = useCartStore((s) => s.getQuantity(item.id));

  return (
    <article className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Image */}
      <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 text-sm">Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-lg">{item.name}</h4>
          <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">₹{item.price}</div>

          {/* If qty = 0 ➝ show Add button */}
          {qty === 0 ? (
            <button
              onClick={() =>
                addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  img: item.img,
                })
              }
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Add
            </button>
          ) : (
            /* If qty > 0 ➝ show - qty + controls */
            <div className="flex items-center gap-3">
              <button
                onClick={() => decrease(item.id)}
                className="px-3 py-1 bg-slate-200 rounded-lg text-lg"
              >
                –
              </button>

              <span className="min-w-[20px] text-center font-semibold">
                {qty}
              </span>

              <button
                onClick={() => increase(item.id)}
                className="px-3 py-1 bg-orange-500 text-white rounded-lg text-lg"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

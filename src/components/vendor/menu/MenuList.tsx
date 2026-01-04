import React from "react";
import { MenuItem } from "@/api/vendorMenu";

/* ============================================================
   PROPS
============================================================ */

type Props = {
  items: MenuItem[];
};

/* ============================================================
   READ-ONLY MENU LIST (MVP)
============================================================ */

export default function MenuList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-600">
        No items extracted yet.
      </div>
    );
  }

  return (
    <ul className="border rounded divide-y">
      {items.map((item) => (
        <li
          key={item._id}
          className="p-3 flex justify-between text-sm"
        >
          <span>{item.name}</span>
          <span>
            {item.price != null ? `₹${item.price}` : "—"}
          </span>
        </li>
      ))}
    </ul>
  );
}

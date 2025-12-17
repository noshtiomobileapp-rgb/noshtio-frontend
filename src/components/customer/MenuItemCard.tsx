"use client";

import React from "react";

export default function MenuItemCard({ item }: { item: any }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex flex-col">
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-sm text-slate-500 mt-1">{item.description || "Tasty & freshly prepared."}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-bold">₹{item.price}</div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
      </div>
    </div>
  );
}

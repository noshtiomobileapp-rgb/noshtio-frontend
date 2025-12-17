"use client";

import React, { useState, useEffect } from "react";

export default function MenuItemForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: any;
  onCancel: () => void;
  onSave: (data: { name: string; price: number; category?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : "");
  const [category, setCategory] = useState(initial?.category ?? "Main");

  useEffect(() => {
    setName(initial?.name ?? "");
    setPrice(initial?.price ? String(initial.price) : "");
    setCategory(initial?.category ?? "Main");
  }, [initial]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Item name</label>
        <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Price</label>
        <input className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} />
      </div>
      <div>
        <label className="text-sm">Category</label>
        <input className="w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="px-3 py-2" onClick={onCancel}>Cancel</button>
        <button
          className="px-4 py-2 bg-slate-800 text-white rounded"
          onClick={() => {
            if (!name || !price) return alert("Provide name and price");
            onSave({ name, price: Number(price), category });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  price: number;
  available: boolean;
};

export default function PublishedMenuPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/menu/public")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
  }, []);

  async function toggle(id: string, value: boolean) {
    await fetch(`/api/vendor/item/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available: value }),
      headers: { "Content-Type": "application/json" },
    });

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: value } : i))
    );
  }

  return (
    <div className="p-4 space-y-3">
      {items.map((i) => (
        <div
          key={i.id}
          className={`flex justify-between p-3 border rounded ${
            !i.available ? "opacity-50" : ""
          }`}
        >
          <div>
            {i.name} — ₹{i.price}
          </div>
          <input
            type="checkbox"
            checked={i.available}
            onChange={(e) => toggle(i.id, e.target.checked)}
          />
        </div>
      ))}
    </div>
  );
}

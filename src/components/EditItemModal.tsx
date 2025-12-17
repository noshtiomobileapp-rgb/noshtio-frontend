"use client";

import React, { useEffect, useState } from "react";

export default function EditItemModal({
  item,
  onClose,
  refreshMenu,
}: {
  item: any;
  onClose: () => void;
  refreshMenu: () => void;
}) {
  const [form, setForm] = useState({
    name: item.name,
    price: item.price,
    description: item.description || "",
    category: item.category || "Uncategorized",
  });

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.map((c: any) => c.name));
      });
  }, []);

  const updateItem = async () => {
    const res = await fetch(
      `http://localhost:4000/api/vendors/menu/item/${item._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (!data.success) return alert("Update failed.");

    alert("Item updated!");
    onClose();
    refreshMenu();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 400,
          background: "#fff",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h2>Edit Item</h2>

        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Price</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <button onClick={updateItem} style={{ marginRight: 10 }}>
          Save
        </button>
        <button onClick={onClose} style={{ background: "#ccc" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}


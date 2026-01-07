"use client";

import React, { useEffect, useState } from "react";
import MenuItemForm from "./MenuItemForm";
import { apiFetch } from "@/lib/api";

/* ======================================================
   TYPES (lightweight, optional)
====================================================== */

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string;
  [key: string]: any;
};

/* ======================================================
   COMPONENT
====================================================== */

export default function MenuManager({ vendorId }: { vendorId?: string }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  /* ======================================================
     LOAD MENU
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      setLoading(true);

      try {
        if (!vendorId) {
          setMenu([]);
          return;
        }

        const data = await apiFetch(
          `/vendors/${vendorId}/menu`
        );

        if (cancelled) return;

        // Normalize possible backend shapes
        if (Array.isArray(data?.categories)) {
          const items = data.categories.flatMap((c: any) =>
            (c.items || []).map((it: any) => ({
              ...it,
              category: c.name,
            }))
          );
          setMenu(items);
        } else if (Array.isArray(data)) {
          setMenu(data);
        } else {
          setMenu([]);
        }
      } catch {
        setMenu([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  /* ======================================================
     UI ACTIONS
  ====================================================== */

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setShowForm(true);
  }

  /* ======================================================
     SAVE (CREATE / UPDATE)
  ====================================================== */

  async function handleSave(data: any) {
    if (!vendorId) return;

    if (editing) {
      // Optimistic update
      setMenu((m) =>
        m.map((it) =>
          it.id === editing.id ? { ...it, ...data } : it
        )
      );
      setShowForm(false);

      try {
        await apiFetch(`/vendors/menu`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            ...data,
          }),
        });
      } catch {
        // MVP: ignore backend failure
      }
    } else {
      const newItem: MenuItem = {
        id: `m${Date.now()}`,
        ...data,
      };

      setMenu((m) => [newItem, ...m]);
      setShowForm(false);

      try {
        await apiFetch(`/vendors/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId,
            item: newItem,
          }),
        });
      } catch {
        // MVP: ignore backend failure
      }
    }
  }

  /* ======================================================
     DELETE
  ====================================================== */

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;

    setMenu((m) => m.filter((it) => it.id !== id));

    try {
      await apiFetch(`/vendors/menu`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // ignore
    }
  }

  /* ======================================================
     FILTER
  ====================================================== */

  const filtered = menu.filter((m) =>
    [m.name, m.category]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  /* ======================================================
     RENDER
  ====================================================== */

  if (loading) {
    return <div className="p-4">Loading menu...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Menu Management</h2>
        <button
          onClick={openAdd}
          className="px-3 py-2 border rounded"
        >
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <input
            className="border rounded px-3 py-2 w-full mb-3"
            placeholder="Search menu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="bg-white rounded shadow p-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="py-2">{it.name}</td>
                    <td className="py-2">{it.category}</td>
                    <td className="py-2">₹{it.price}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          className="text-sm"
                          onClick={() => openEdit(it)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm text-red-500"
                          onClick={() => handleDelete(it.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-slate-500"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded shadow p-3 text-sm text-slate-500">
          Use the Add button to create items. Edit existing items to
          change price or category.
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">
              {editing ? "Edit Item" : "Add Item"}
            </h3>
            <MenuItemForm
              initial={editing}
              onCancel={() => setShowForm(false)}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}

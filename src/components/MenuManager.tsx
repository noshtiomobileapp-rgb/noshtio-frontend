"use client";

import React, { useEffect, useState } from "react";
import MenuItemForm from "./MenuItemForm";

export default function MenuManager({ vendorId }: { vendorId?: string }) {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!vendorId) {
          setMenu([]);
          return;
        }
        const res = await fetch(`http://localhost:4000/api/vendors/${vendorId}/menu`, { credentials: "include" }).catch(() => null);
        if (res && res.ok) {
          const j = await res.json();
          // plugin: if your menu object is nested, normalize. We expect array in j.categories or top-level
          if (Array.isArray(j.categories)) {
            // flatten categories => items
            const items = j.categories.flatMap((c: any) => (c.items || []).map((it: any) => ({ ...it, category: c.name })));
            setMenu(items);
          } else if (Array.isArray(j)) {
            setMenu(j);
          } else {
            setMenu([]);
          }
        } else {
          setMenu([]);
        }
      } catch (e) {
        setMenu([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [vendorId]);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(item: any) {
    setEditing(item);
    setShowForm(true);
  }

  async function handleSave(data: any) {
    // optimistic UI: create id locally first
    if (editing) {
      // update locally
      setMenu((m) => m.map((it) => (it.id === editing.id ? { ...it, ...data } : it)));
      setShowForm(false);

      // try to persist to server (endpoint may differ)
      try {
        await fetch(`http://localhost:4000/api/vendors/menu`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...data }),
        });
      } catch {
        // ignore backend errors for now
      }
    } else {
      const newItem = { id: `m${Date.now()}`, ...data };
      setMenu((m) => [newItem, ...m]);
      setShowForm(false);

      try {
        await fetch(`http://localhost:4000/api/vendors/menu`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId, item: newItem }),
        });
      } catch {
        // ignore
      }
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setMenu((m) => m.filter((it) => it.id !== id));
    // try backend delete
    fetch(`http://localhost:4000/api/vendors/menu`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => null);
  }

  const filtered = menu.filter((m) => [m.name, m.category].join(" ").toLowerCase().includes(query.toLowerCase()));

  if (loading) return <div className="p-4">Loading menu...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Menu Management</h2>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="px-3 py-2 border rounded">Add Item</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <input className="border rounded px-3 py-2 flex-1" placeholder="Search menu" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="bg-white rounded shadow p-3">
            <div className="overflow-x-auto">
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
                        <div className="flex items-center gap-2">
                          <button className="text-sm" onClick={() => openEdit(it)}>Edit</button>
                          <button className="text-sm text-red-500" onClick={() => handleDelete(it.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td className="py-6 text-center text-slate-500" colSpan={4}>No items found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded shadow p-3">
            <h3 className="text-sm font-medium mb-2">Quick help</h3>
            <div className="text-sm text-slate-500">Use the Add button to create items. Edit existing items to change price or category.</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">{editing ? "Edit Item" : "Add Item"}</h3>
            <MenuItemForm initial={editing} onCancel={() => setShowForm(false)} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
}

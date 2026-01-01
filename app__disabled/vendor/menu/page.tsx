"use client";

import React, { useEffect, useState } from "react";
import { apiFetch, API_BASE } from "@/lib/api";

type Item = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  available?: boolean;
};

type CategoryBlock = {
  categoryName: string;
  items: Item[];
};

export default function VendorMenuPage() {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ vendorId?: string; categories: CategoryBlock[] }>({ categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ category?: string; item?: Item } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [jsonImport, setJsonImport] = useState("");

  useEffect(() => {
    // prefer vendorId from localStorage
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("vendorId");
    if (saved) setVendorId(saved);
  }, []);

  useEffect(() => {
    if (!vendorId) return;
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  async function loadMenu() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/vendors-menu/${vendorId}`);
      // API returns { menu }
      const menuObj = data?.menu ?? data;
      // normalize
      const categories = Array.isArray(menuObj?.categories) ? menuObj.categories : [];
      setMenu({ vendorId: menuObj.vendorId || vendorId!, categories });
      setSelectedCategory(categories.length ? categories[0].categoryName : null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }

  // Add item -> POST /api/vendors-menu/:vendorId/category/item
  async function handleAddItem(categoryName: string, item: Partial<Item>) {
    try {
      await apiFetch(`/api/vendors-menu/${vendorId}/category/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName, item }),
      });
      await loadMenu();
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message || "Add failed");
    }
  }

  // Update item -> PUT /api/vendors-menu/:vendorId/category/item
  async function handleUpdateItem(categoryName: string, itemId: string, updates: Partial<Item>) {
    try {
      await apiFetch(`/api/vendors-menu/${vendorId}/category/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName, itemId, updates }),
      });
      await loadMenu();
      setEditing(null);
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  }

  // Delete -> DELETE /api/vendors-menu/:vendorId/category/item
  async function handleDeleteItem(categoryName: string, itemId: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await apiFetch(`/api/vendors-menu/${vendorId}/category/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName, itemId }),
      });
      await loadMenu();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  }

  // Toggle availability via updateItem
  async function toggleAvailability(categoryName: string, itemId: string, value: boolean) {
    await handleUpdateItem(categoryName, itemId, { available: value });
  }

  // Export JSON
  function exportJSON() {
    const blob = new Blob([JSON.stringify(menu, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `menu-${vendorId || "vendor"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import JSON (expects menu.categories or categories array)
  async function importJSON() {
    let parsed;
    try {
      parsed = JSON.parse(jsonImport);
    } catch (e) {
      alert("Invalid JSON");
      return;
    }
    const payload = parsed.menu ?? parsed;
    const categories = payload.categories ?? payload;
    if (!Array.isArray(categories)) {
      alert("Imported JSON must contain categories array (menu.categories)");
      return;
    }
    try {
      await apiFetch(`/api/vendors-menu/${vendorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu: { vendorId, categories } }),
      });
      setJsonImport("");
      await loadMenu();
      alert("Import successful");
    } catch (err: any) {
      alert(err.message || "Import failed");
    }
  }

  // Add new category
  async function addCategory(name: string) {
    // easiest: add empty category via save (append locally then POST full menu)
    const newCategories = [...menu.categories, { categoryName: name, items: [] }];
    try {
      await apiFetch(`/api/vendors-menu/${vendorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu: { vendorId, categories: newCategories } }),
      });
      await loadMenu();
    } catch (err: any) {
      alert(err.message || "Could not add category");
    }
  }

  // UI helpers
  const categories = menu.categories || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Vendor Menu</h1>
          <p className="text-sm text-gray-500">Professional management — categories, items, import/export.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Vendor ID (or set localStorage.vendorId)"
            value={vendorId ?? ""}
            onChange={(e) => setVendorId(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button onClick={() => { if (vendorId) { localStorage.setItem("vendorId", vendorId); loadMenu(); } }} className="px-3 py-2 bg-blue-600 text-white rounded">Set & Load</button>

          <button onClick={exportJSON} className="px-3 py-2 bg-white border rounded">Export JSON</button>
        </div>
      </header>

      {!vendorId ? (
        <div className="p-4 bg-yellow-50 rounded border text-yellow-800">No vendor selected. Set <code>localStorage.vendorId</code> or enter Vendor ID above then click <strong>Set & Load</strong>.</div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Categories</h3>
                  <button
                    onClick={() => {
                      const name = prompt("New category name");
                      if (name) addCategory(name);
                    }}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    + Add
                  </button>
                </div>

                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c.categoryName}>
                      <button
                        onClick={() => setSelectedCategory(c.categoryName)}
                        className={`w-full text-left px-2 py-2 rounded ${selectedCategory === c.categoryName ? "bg-blue-50 font-medium" : "hover:bg-gray-50"}`}
                      >
                        {c.categoryName} <span className="text-xs text-gray-400">({c.items.length})</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h4 className="text-xs text-gray-500">Import JSON</h4>
                  <textarea className="w-full h-28 border rounded p-2 mt-1" value={jsonImport} onChange={(e) => setJsonImport(e.target.value)} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={importJSON} className="px-3 py-1 bg-green-600 text-white rounded">Import</button>
                    <button onClick={() => setJsonImport("")} className="px-3 py-1 border rounded">Clear</button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{selectedCategory ?? "No category selected"}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddModal(true)} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Item</button>
                    <button onClick={loadMenu} className="px-3 py-1 border rounded">Refresh</button>
                  </div>
                </div>

                {loading ? (
                  <div>Loading…</div>
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : !selectedCategory ? (
                  <div className="text-gray-500">Select a category on the left to view items.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(categories.find((c) => c.categoryName === selectedCategory)?.items || []).map((it) => (
                      <div key={(it as any)._id} className="border p-3 rounded flex gap-3 items-start">
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                          {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-400">No image</div>}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{it.name}</div>
                              {it.description && <div className="text-sm text-gray-500">{it.description}</div>}
                              <div className="text-sm text-gray-600 mt-1">₹{(it.price ?? 0).toFixed(2)}</div>
                            </div>
                            <div className="text-right space-y-2">
                              <label className="flex items-center gap-2 text-xs">
                                <input type="checkbox" checked={!!it.available} onChange={(e) => toggleAvailability(selectedCategory, (it as any)._id, e.target.checked)} />
                                <span>Available</span>
                              </label>

                              <div className="flex gap-2">
                                <button onClick={() => setEditing({ category: selectedCategory!, item: it })} className="px-2 py-1 border rounded text-sm">Edit</button>
                                <button onClick={() => handleDeleteItem(selectedCategory!, (it as any)._id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Add Item Modal */}
          {showAddModal && selectedCategory && (
            <Modal onClose={() => setShowAddModal(false)}>
              <AddEditForm
                initial={{ name: "", price: 0, description: "", image: "", available: true }}
                onSave={(payload) => handleAddItem(selectedCategory, payload)}
                onCancel={() => setShowAddModal(false)}
              />
            </Modal>
          )}

          {/* Edit modal */}
          {editing && editing.category && editing.item && (
            <Modal onClose={() => setEditing(null)}>
              <AddEditForm
                initial={editing.item}
                onSave={(payload) => handleUpdateItem(editing.category!, (editing.item as any)._id, payload)}
                onCancel={() => setEditing(null)}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

/* Small Modal + Form components (inline for single-file simplicity) */

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-4 w-full max-w-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="px-2 py-1">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function AddEditForm({ initial, onSave, onCancel }: { initial: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...initial });
  return (
    <div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1 rounded" value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm">Price</label>
          <input className="w-full border px-2 py-1 rounded" type="number" value={form.price} onChange={(e) => setForm((f: any) => ({ ...f, price: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea className="w-full border px-2 py-1 rounded" value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm">Image URL</label>
          <input className="w-full border px-2 py-1 rounded" value={form.image} onChange={(e) => setForm((f: any) => ({ ...f, image: e.target.value }))} />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => onCancel()} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={() => onSave(form)} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}


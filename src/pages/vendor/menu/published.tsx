"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ============================================================
   Types (MATCH BACKEND Item MODEL)
   ============================================================ */

type PublishedItem = {
  _id: string;
  name: string;
  price: number | null;
  available: boolean;
  category?: string;
  image?: string;
};

type PublishedMenuResponse = {
  success: boolean;
  items: PublishedItem[];
};

/* ============================================================
   Page
   ============================================================ */

export default function PublishedMenuPage() {
  const [items, setItems] = useState<PublishedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------
     Load published menu
     ------------------------------------------------------------ */

  useEffect(() => {
    fetch("/api/vendor/menu/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load published menu");
        return r.json();
      })
      .then((d: PublishedMenuResponse) => {
        setItems(d.items ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* ------------------------------------------------------------
     Availability toggle (optimistic)
     ------------------------------------------------------------ */

  async function toggleAvailability(itemId: string, value: boolean) {
    const prev = items;
    setSavingId(itemId);

    setItems((items) =>
      items.map((i) =>
        i._id === itemId ? { ...i, available: value } : i
      )
    );

    try {
      const res = await fetch(
        `/api/vendor/item/${itemId}/availability`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: value }),
        }
      );

      if (!res.ok) throw new Error("Failed to update availability");
    } catch (e: any) {
      setItems(prev);
      setError(e.message ?? "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  /* ------------------------------------------------------------
     Image upload
     ------------------------------------------------------------ */

  async function uploadImage(itemId: string, file: File) {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingId(itemId);

    try {
      const res = await fetch(
        `/api/vendor/menu/item/${itemId}/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();

      setItems((items) =>
        items.map((i) =>
          i._id === itemId ? { ...i, image: data.image } : i
        )
      );
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploadingId(null);
    }
  }

  /* ------------------------------------------------------------
     Edit helpers
     ------------------------------------------------------------ */

  function startEdit(item: PublishedItem) {
    setEditingId(item._id);
    setEditName(item.name);
    setEditPrice(item.price ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  }

  async function saveEdit(itemId: string) {
    const prev = items;
    setSavingId(itemId);

    setItems((items) =>
      items.map((i) =>
        i._id === itemId
          ? {
              ...i,
              name: editName.trim(),
              price:
                editPrice === "" ? null : Number(editPrice),
            }
          : i
      )
    );

    try {
      const res = await fetch(
        `/api/vendor/item/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName.trim(),
            price:
              editPrice === "" ? null : Number(editPrice),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save item");
      cancelEdit();
    } catch (e: any) {
      setItems(prev);
      setError(e.message ?? "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  /* ------------------------------------------------------------
     UI states
     ------------------------------------------------------------ */

  if (loading) {
    return <div className="p-6">Loading published menu…</div>;
  }

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Published Menu</h1>
        <p className="text-red-600">{error}</p>
        <Link href="/vendor/menu" className="underline">
          Back to Menu
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Published Menu</h1>
        <p className="text-gray-600">No items published yet.</p>
        <Link
          href="/vendor/menu/upload"
          className="border px-4 py-2 rounded inline-block"
        >
          Upload Menu
        </Link>
      </div>
    );
  }

  /* ------------------------------------------------------------
     Render
     ------------------------------------------------------------ */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Published Menu</h1>

        <div className="flex gap-3">
          <Link
            href="/vendor/menu/upload"
            className="border px-4 py-2 rounded"
          >
            Upload New Version
          </Link>
          <Link
            href="/vendor/menu"
            className="border px-4 py-2 rounded"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isEditing = editingId === item._id;

          return (
            <div
              key={item._id}
              className={`border rounded p-4 space-y-3 ${
                !item.available ? "opacity-50" : ""
              }`}
            >
              {/* Image + upload */}
              <div className="flex gap-4 items-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                    No Image
                  </div>
                )}

                <label className="text-sm border px-3 py-1 rounded cursor-pointer">
                  {uploadingId === item._id
                    ? "Uploading…"
                    : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingId === item._id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadImage(item._id, file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Display / Edit */}
              {!isEditing ? (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.price !== null
                        ? `₹${item.price}`
                        : "—"}
                      {item.category ? ` • ${item.category}` : ""}
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => startEdit(item)}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.available}
                        disabled={savingId === item._id}
                        onChange={(e) =>
                          toggleAvailability(
                            item._id,
                            e.target.checked
                          )
                        }
                      />
                      {savingId === item._id
                        ? "Saving…"
                        : "Available"}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="border px-2 py-1 w-full rounded"
                    placeholder="Item name"
                  />

                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) =>
                      setEditPrice(
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                      )
                    }
                    className="border px-2 py-1 w-full rounded"
                    placeholder="Price"
                  />

                  <div className="flex gap-2">
                    <button
                      disabled={savingId === item._id}
                      onClick={() => saveEdit(item._id)}
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="border px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

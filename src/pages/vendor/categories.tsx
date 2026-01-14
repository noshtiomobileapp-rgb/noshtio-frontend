"use client";

import { useEffect, useState } from "react";
import {
  getVendorCategories,
  createCategory,
  updateCategory,
  reorderCategories,
  VendorCategory,
} from "@/lib/http/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ============================================================
   Types
============================================================ */

type Category = {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
  itemCount: number;
};

/* ============================================================
   TEMP: Vendor ID (MVP)
============================================================ */

const VENDOR_ID = "694166c34483971240f58595";

/* ============================================================
   Page
============================================================ */

export default function VendorCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------
     Load categories
  ------------------------------------------------------------ */

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getVendorCategories(VENDOR_ID);

      const normalized: Category[] = res.data
        .map((c: VendorCategory) => ({
          id: c._id,
          name: c.name,
          isVisible: c.isVisible ?? true,
          order: c.order ?? 0,
          itemCount: 0,
        }))
        .sort((a, b) => a.order - b.order);

      setCategories(normalized);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }

  /* ------------------------------------------------------------
     Create category
  ------------------------------------------------------------ */

  async function handleCreate() {
    if (!newName.trim()) return;

    setLoading(true);

    try {
      const res = await createCategory(VENDOR_ID, newName);

      setCategories((prev) =>
        [...prev, {
          id: res.data._id,
          name: res.data.name,
          isVisible: res.data.isVisible ?? true,
          order: res.data.order,
          itemCount: 0,
        }].sort((a, b) => a.order - b.order)
      );

      setNewName("");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------
     Rename category
  ------------------------------------------------------------ */

  async function renameCategory(id: string, name: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name } : c
      )
    );

    await updateCategory(id, { name });
  }

  /* ------------------------------------------------------------
     Toggle visibility
  ------------------------------------------------------------ */

  async function toggleVisibility(
    id: string,
    isVisible: boolean
  ) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isVisible } : c
      )
    );

    await updateCategory(id, { isVisible });
  }

  /* ------------------------------------------------------------
     Reorder categories
  ------------------------------------------------------------ */

  async function moveCategory(
    index: number,
    dir: -1 | 1
  ) {
    const copy = [...categories];
    const target = index + dir;
    if (target < 0 || target >= copy.length) return;

    [copy[index], copy[target]] = [
      copy[target],
      copy[index],
    ];

    const reordered = copy.map((c, i) => ({
      ...c,
      order: i,
    }));

    setCategories(reordered);

    const payload: VendorCategory[] = reordered.map(
      (c) => ({
        _id: c.id,
        name: c.name,
        order: c.order,
        isVisible: c.isVisible,
      })
    );

    await reorderCategories(payload);
  }

  /* ------------------------------------------------------------
     Render
  ------------------------------------------------------------ */

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold">
        Categories
      </h1>

      {/* Create */}
      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newName}
          onChange={(e) =>
            setNewName(e.target.value)
          }
        />
        <Button
          onClick={handleCreate}
          disabled={loading}
        >
          Add
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {categories.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div className="flex flex-col">
              <Input
                className="h-8"
                value={c.name}
                onChange={(e) =>
                  renameCategory(
                    c.id,
                    e.target.value
                  )
                }
              />
              <span className="text-xs text-gray-500">
                {c.itemCount} items
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Reorder */}
              <Button
                size="sm"
                variant="outline"
                disabled={i === 0}
                onClick={() =>
                  moveCategory(i, -1)
                }
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  i === categories.length - 1
                }
                onClick={() =>
                  moveCategory(i, 1)
                }
              >
                ↓
              </Button>

              {/* Visibility */}
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={c.isVisible}
                  onChange={(e) =>
                    toggleVisibility(
                      c.id,
                      e.target.checked
                    )
                  }
                />
                Visible
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

export default function CategorySidebar({
  categories,
  activeId,
  onSelect,
}: {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white p-3 rounded border">
      <h3 className="text-sm font-medium mb-3">Categories</h3>
      <ul className="space-y-2">
        {categories.map((c) => {
          const isActive = activeId === c.id;

          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`w-full text-left px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

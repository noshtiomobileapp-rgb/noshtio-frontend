"use client";

import React, { useState } from "react";
import { assignMenuItem } from "@/lib/api";

/* ------------------------------------------------------------------
   Local view-model types (DO NOT import backend models)
   ------------------------------------------------------------------ */

type MatchInfo = {
  method?: string;
  score?: number;
};

type ReviewMenuItem = {
  _id: string;
  name: string;
  description?: string;
  categoryId?: string;
  match?: MatchInfo;
};

type ReviewCategory = {
  _id: string;
  name: string;
};

type ReviewItemProps = {
  item: ReviewMenuItem;
  categories: ReviewCategory[];
  onAssigned: (itemId: string) => void;
};

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export default function ReviewItem({
  item,
  categories,
  onAssigned,
}: ReviewItemProps) {
  const [selected, setSelected] = useState<string>(item.categoryId ?? "");
  const [persistRule, setPersistRule] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function assign(): Promise<void> {
    if (!selected) {
      alert("Please select a category");
      return;
    }

    setLoading(true);
    try {
      const res = await assignMenuItem(item._id, selected, persistRule);

      if (res?.success) {
        onAssigned(item._id);
      } else {
        alert("Failed to assign item");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 border rounded mb-2 flex justify-between">
      <div>
        <div className="font-medium">{item.name}</div>

        {item.description && (
          <div className="text-sm text-gray-600">
            {item.description}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Match: {item.match?.method ?? "none"}{" "}
          {item.match?.score !== undefined
            ? `(${item.match.score.toFixed(2)})`
            : ""}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <select
          className="border px-2 py-1"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- choose category --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={persistRule}
            onChange={(e) => setPersistRule(e.target.checked)}
          />
          Save mapping rule
        </label>

        <button
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
          onClick={assign}
          disabled={loading}
        >
          {loading ? "Saving..." : "Assign"}
        </button>
      </div>
    </div>
  );
}

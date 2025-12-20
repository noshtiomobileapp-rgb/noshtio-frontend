"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type DraftItem = {
  name: string;
  price: number;
  assignedCategory?: string;
  approved?: boolean;
  rejected?: boolean;

  // STEP 4.3
  isAvailable?: boolean;
};

type DraftCategory = {
  name: string;
  items: DraftItem[];
};

type DraftSnapshot = {
  snapshotId: string;
  categories: DraftCategory[];
};

async function fetchDraft(snapshotId: string): Promise<DraftSnapshot> {
  const res = await fetch(`/api/vendor/menu/draft/${snapshotId}`);
  if (!res.ok) throw new Error("Failed to load draft menu");
  return res.json();
}

async function commitDraft(
  snapshotId: string,
  items: {
    name: string;
    price: number;
    category: string;
    isAvailable: boolean;
  }[]
) {
  const res = await fetch(`/api/vendor/menu/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ snapshotId, approvedItems: items }),
  });

  if (!res.ok) throw new Error("Commit failed");
}

export default function DraftMenuPage() {
  const router = useRouter();
  const { snapshotId } = router.query;

  const [draft, setDraft] = useState<DraftSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!snapshotId || typeof snapshotId !== "string") return;

    fetchDraft(snapshotId)
      .then(setDraft)
      .finally(() => setLoading(false));
  }, [snapshotId]);

  function updateItem(
    catIdx: number,
    itemIdx: number,
    patch: Partial<DraftItem>
  ) {
    setDraft((prev) => {
      if (!prev) return prev;
      const copy = structuredClone(prev);
      Object.assign(copy.categories[catIdx].items[itemIdx], patch);
      return copy;
    });
  }

  function bulkApprove() {
    if (!draft) return;
    setDraft({
      ...draft,
      categories: draft.categories.map((c) => ({
        ...c,
        items: c.items.map((i) => ({
          ...i,
          approved: true,
          rejected: false,
        })),
      })),
    });
  }

  async function commit() {
    if (!draft) return;

    const approved = draft.categories.flatMap((c) =>
      c.items
        .filter((i) => i.approved && i.assignedCategory)
        .map((i) => ({
          name: i.name,
          price: i.price,
          category: i.assignedCategory!,
          isAvailable: i.isAvailable ?? true,
        }))
    );

    if (approved.length === 0) {
      alert("No approved items to commit");
      return;
    }

    setSubmitting(true);
    try {
      await commitDraft(draft.snapshotId, approved);
      router.push("/vendor/menu");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-4">Loading draft…</div>;
  if (!draft) return <div className="p-4">Draft not found</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">OCR Draft Review</h1>
        <button
          onClick={bulkApprove}
          className="text-sm px-3 py-1 border rounded"
        >
          Bulk Approve
        </button>
      </div>

      {draft.categories.map((cat, cIdx) => (
        <div key={cat.name} className="border rounded p-3 space-y-2">
          <h2 className="font-medium">{cat.name}</h2>

          {cat.items.map((item, iIdx) => (
            <div
              key={item.name}
              className="flex items-center gap-2 text-sm"
            >
              <div className="flex-1">
                {item.name} — ₹{item.price}
              </div>

              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={item.isAvailable ?? true}
                  onChange={(e) =>
                    updateItem(cIdx, iIdx, {
                      isAvailable: e.target.checked,
                    })
                  }
                />
                Available
              </label>

              <select
                className="border rounded px-2 py-1"
                value={item.assignedCategory ?? ""}
                onChange={(e) =>
                  updateItem(cIdx, iIdx, {
                    assignedCategory: e.target.value,
                  })
                }
              >
                <option value="">Assign category</option>
                {draft.categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                className={`px-2 py-1 border rounded ${
                  item.approved ? "bg-green-100" : ""
                }`}
                onClick={() =>
                  updateItem(cIdx, iIdx, {
                    approved: true,
                    rejected: false,
                  })
                }
              >
                Approve
              </button>

              <button
                className={`px-2 py-1 border rounded ${
                  item.rejected ? "bg-red-100" : ""
                }`}
                onClick={() =>
                  updateItem(cIdx, iIdx, {
                    rejected: true,
                    approved: false,
                  })
                }
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      ))}

      <div className="pt-4">
        <button
          disabled={submitting}
          onClick={commit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Commit Approved Items
        </button>
      </div>
    </div>
  );
}

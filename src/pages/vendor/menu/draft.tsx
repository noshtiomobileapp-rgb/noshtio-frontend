"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type DraftItem = {
  name: string;
  price: number | null;
  reviewStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
};

type DraftCategory = {
  category: string;
  items: DraftItem[];
};

async function reviewItem(
  snapshotId: string,
  categoryIndex: number,
  itemIndex: number,
  status: "approved" | "rejected",
  rejectionReason?: string
) {
  await fetch(
    `/api/vendor/menu/draft/${snapshotId}/category/${categoryIndex}/item/${itemIndex}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason }),
    }
  );
}

export default function DraftMenuPage() {
  const router = useRouter();
  const { snapshotId } = router.query;
  const [categories, setCategories] = useState<DraftCategory[]>([]);

  useEffect(() => {
    if (!snapshotId) return;
    fetch(`/api/vendor/menu/draft/${snapshotId}`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, [snapshotId]);

  function updateStatus(ci: number, ii: number, status: DraftItem["reviewStatus"], reason?: string) {
    setCategories((prev) => {
      const next = [...prev];
      next[ci].items[ii].reviewStatus = status;
      next[ci].items[ii].rejectionReason = reason ?? null;
      return next;
    });
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Review Menu Draft</h1>

      {categories.map((cat, ci) => (
        <div key={ci} className="border rounded p-4 space-y-3">
          <h2 className="font-medium text-lg">{cat.category}</h2>

          {cat.items.map((item, ii) => (
            <div key={ii} className="flex justify-between items-center border p-2 rounded">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  {item.price ? `₹${item.price}` : "—"}
                </div>
                {item.reviewStatus === "rejected" && (
                  <div className="text-xs text-red-600">
                    {item.rejectionReason}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    reviewItem(snapshotId as string, ci, ii, "approved");
                    updateStatus(ci, ii, "approved");
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    const reason = prompt("Rejection reason?");
                    if (!reason) return;
                    reviewItem(snapshotId as string, ci, ii, "rejected", reason);
                    updateStatus(ci, ii, "rejected", reason);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={async () => {
          await fetch("/api/vendor/menu/commit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ snapshotId }),
          });
          router.push("/vendor/menu/published");
        }}
        className="w-full bg-black text-white py-2 rounded"
      >
        Publish Approved Items
      </button>
    </div>
  );
}

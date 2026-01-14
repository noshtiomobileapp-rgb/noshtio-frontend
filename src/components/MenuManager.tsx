"use client";

/* ============================================================
   Types
============================================================ */

export type MenuItem = {
  _id?: string;
  name: string;
  price?: number | null;
};

type MenuManagerProps = {
  snapshotId: string | null;
  items: MenuItem[];
};

/* ============================================================
   Component
============================================================ */

export default function MenuManager({
  snapshotId,
  items,
}: MenuManagerProps) {
  if (!snapshotId) {
    return (
      <div className="text-slate-500">
        No draft menu found.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-slate-500">
        Menu is empty.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item._id ?? item.name}
          className="border p-3 rounded"
        >
          <div className="font-medium">
            {item.name}
          </div>

          {item.price != null && (
            <div className="text-sm text-slate-500">
              ₹{item.price}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

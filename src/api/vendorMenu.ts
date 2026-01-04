import { vendorFetch } from "@/lib/vendorApi";

/* ============================================================
   TYPES
============================================================ */

export type MenuItem = {
  _id: string;
  name: string;
  price: number | null;
};

export type MenuSnapshot = {
  snapshotId: string;
  items: MenuItem[];
  status: "DRAFT";
};

/* ============================================================
   API — CURRENT DRAFT SNAPSHOT
============================================================ */

export async function getCurrentMenuSnapshot(): Promise<MenuSnapshot | null> {
  const res = await vendorFetch<any>("/api/vendor/menu/current");

  if (!res || !res.snapshotId) {
    return null;
  }

  return {
    snapshotId: res.snapshotId,
    items: res.items || [],
    status: "DRAFT",
  };
}

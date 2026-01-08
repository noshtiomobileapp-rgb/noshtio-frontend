import { apiFetch } from "@/lib/api";

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

type CurrentMenuResponse = {
  snapshotId?: string;
  items?: MenuItem[];
};

export async function getCurrentMenuSnapshot(): Promise<MenuSnapshot | null> {
  const res = (await apiFetch(
    "/api/vendor/menu/current"
  )) as CurrentMenuResponse;

  if (!res || !res.snapshotId) {
    return null;
  }

  return {
    snapshotId: res.snapshotId,
    items: res.items || [],
    status: "DRAFT",
  };
}

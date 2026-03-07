import { apiClient } from "@/lib/apiClient";

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

/* ----------------------------------------
   Get current vendor draft menu
-----------------------------------------*/
export async function getCurrentMenuSnapshot(): Promise<MenuSnapshot | null> {
  const data = await apiClient("/api/vendor/menu/current");

  if (!data || !data.snapshotId) {
    return null;
  }

  return {
    snapshotId: data.snapshotId,
    items: data.items ?? [],
    status: "DRAFT",
  };
}

/* ----------------------------------------
   Upload menu file
-----------------------------------------*/
export async function uploadMenu(formData: FormData) {
  return apiClient("/api/vendor/menu/upload", {
    method: "POST",
    body: formData,
  });
}
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

export async function getCurrentMenuSnapshot(): Promise<MenuSnapshot | null> {
  const data = await apiClient("/api/menu/current");

  if (!data?.snapshotId) {
    return null;
  }

  return {
    snapshotId: data.snapshotId,
    items: data.items || [],
    status: "DRAFT",
  };
}

export async function uploadMenu(formData: FormData) {
  return apiClient("/api/menu/upload", {
    method: "POST",
    body: formData,
    skipJson: true,
  });
}

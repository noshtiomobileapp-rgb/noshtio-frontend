import { apiClient } from "./client";

/* ============================================================
   Vendor Category APIs (MATCH BACKEND ROUTES)
   ============================================================ */

export async function getVendorCategories(vendorId: string) {
  return apiClient(`/vendor/categories?vendorId=${vendorId}`);
}

export async function createCategory(vendorId: string, name: string) {
  return apiClient(`/vendor/categories?vendorId=${vendorId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(
  categoryId: string,
  body: { name?: string; isVisible?: boolean }
) {
  return apiClient(`/vendor/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function reorderCategories(orderedIds: string[]) {
  return apiClient(`/vendor/categories/reorder`, {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
}

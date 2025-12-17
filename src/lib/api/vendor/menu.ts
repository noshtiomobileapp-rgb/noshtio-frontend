// lib/api/vendors/menu.ts

const BASE = "http://localhost:4000/api";

export const VendorMenuAPI = {
  // GET vendor menu
  getMenu: (vendorId: string) =>
    fetch(`${BASE}/vendor/menu/${vendorId}`).then((r) => r.json()),

  // ADD item
  addItem: (vendorId: string, payload: any) =>
    fetch(`${BASE}/vendor/menu/${vendorId}/category/item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((r) => r.json()),

  // UPDATE item
  updateItem: (vendorId: string, payload: any) =>
    fetch(`${BASE}/vendor/menu/${vendorId}/category/item`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((r) => r.json()),

  // DELETE item
  deleteItem: (vendorId: string, payload: any) =>
    fetch(`${BASE}/vendor/menu/${vendorId}/category/item`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((r) => r.json()),

  // GET all categories
  getCategories: () =>
    fetch(`${BASE}/categories`).then((r) => r.json()),

  // CREATE category
  createCategory: (payload: any) =>
    fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((r) => r.json()),

  // DELETE category
  deleteCategory: (id: string) =>
    fetch(`${BASE}/categories/${id}`, {
      method: "DELETE"
    }).then((r) => r.json())
};


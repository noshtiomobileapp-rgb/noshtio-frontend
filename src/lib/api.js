const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export async function getReviewQueue(vendorId) {
  const res = await fetch(`${API}/menu-item/review-queue?vendorId=${vendorId}`);
  return res.json();
}

export async function getVendorCategories(vendorId) {
  const res = await fetch(`${API}/categories?vendorId=${vendorId}`);
  return res.json();
}

export async function assignMenuItem(itemId, categoryId, persistRule = false) {
  const res = await fetch(`${API}/menu-item/${itemId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, persistRule }),
  });
  return res.json();
}

export async function importOCR(vendorId, items) {
  const res = await fetch(`${API}/ocr/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId, items }),
  });
  return res.json();
}

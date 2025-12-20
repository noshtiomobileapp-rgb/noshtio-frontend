
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

/* ------------------------------------------------------
   GENERIC FETCH (optional to use)
------------------------------------------------------- */
export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(opts.headers || {}),
      Accept: "application/json",
    },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    throw new Error(
      body?.error ||
        body?.message ||
        `Request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/* ------------------------------------------------------
   OCR REVIEW QUEUE
------------------------------------------------------- */
export async function getReviewQueue(vendorId: string) {
  return apiFetch(`/menu-item/review-queue?vendorId=${vendorId}`);
}

/* ------------------------------------------------------
   GET CATEGORIES
------------------------------------------------------- */
export async function getVendorCategories(vendorId: string) {
  return apiFetch(`/categories?vendorId=${vendorId}`);
}

/* ------------------------------------------------------
   ASSIGN CATEGORY
------------------------------------------------------- */
export async function assignMenuItem(
  itemId: string,
  categoryId: string,
  persistRule = false
) {
  return apiFetch(`/menu-item/${itemId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, persistRule }),
  });
}

/* ------------------------------------------------------
   IMPORT OCR RESULTS
------------------------------------------------------- */
export async function importOCR(vendorId: string, items: any[]) {
  return apiFetch(`/ocr/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId, items }),
  });
}

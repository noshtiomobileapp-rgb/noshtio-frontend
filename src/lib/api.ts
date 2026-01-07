/* ======================================================
   API BASE URL (FAIL FAST — NO FALLBACKS)
====================================================== */

const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined. This is required for API calls."
    );
  }
  return url;
})();

/* ======================================================
   GENERIC FETCH WRAPPER
====================================================== */

export async function apiFetch(
  path: string,
  opts: RequestInit = {}
) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();

    let body: any;
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

/* ======================================================
   OCR REVIEW QUEUE
====================================================== */

export function getReviewQueue(vendorId: string) {
  if (!vendorId) {
    throw new Error("vendorId is required");
  }

  return apiFetch(`/menu-item/review-queue?vendorId=${vendorId}`);
}

/* ======================================================
   GET VENDOR CATEGORIES
====================================================== */

export function getVendorCategories(vendorId: string) {
  if (!vendorId) {
    throw new Error("vendorId is required");
  }

  return apiFetch(`/categories?vendorId=${vendorId}`);
}

/* ======================================================
   ASSIGN MENU ITEM TO CATEGORY
====================================================== */

export function assignMenuItem(
  itemId: string,
  categoryId: string,
  persistRule = false
) {
  if (!itemId || !categoryId) {
    throw new Error("itemId and categoryId are required");
  }

  return apiFetch(`/menu-item/${itemId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, persistRule }),
  });
}

/* ======================================================
   IMPORT OCR RESULTS
====================================================== */

export function importOCR(
  vendorId: string,
  items: any[]
) {
  if (!vendorId) {
    throw new Error("vendorId is required");
  }

  if (!Array.isArray(items)) {
    throw new Error("items must be an array");
  }

  return apiFetch(`/ocr/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vendorId, items }),
  });
}

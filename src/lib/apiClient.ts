export const apiBase =
  process.env.NEXT_PUBLIC_API_BASE || "";

/* ============================================================
   INTERNAL: BUILD AUTH HEADERS SAFELY
============================================================ */

function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* ============================================================
   API GET
============================================================ */

export async function apiGet(path: string) {
  const res = await fetch(`${apiBase}${path}`, {
    headers: buildAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

/* ============================================================
   API POST
============================================================ */

export async function apiPost(
  path: string,
  body: any
) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

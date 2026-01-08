/* ============================================================
   API CLIENT — OPTION B (COOKIE BASED) — FINAL
   - Uses HttpOnly cookies
   - No Authorization header
   - Works in Local + Vercel Production
============================================================ */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fail fast at build/runtime if env is misconfigured.
 * This prevents silent localhost fallbacks in production.
 */
if (!API_BASE) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined. Check Vercel environment variables."
  );
}

/* ============================================================
   CORE FETCH WRAPPER
============================================================ */

async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    credentials: "include", // 🔒 REQUIRED for cookie-based auth
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!res.ok) {
    let errorMessage = "API request failed";

    try {
      errorMessage = await res.text();
    } catch {
      // ignore parse errors
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

/* ============================================================
   PUBLIC API METHODS
============================================================ */

export function apiGet(path: string) {
  return apiFetch(path, { method: "GET" });
}

export function apiPost(
  path: string,
  body: unknown
) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

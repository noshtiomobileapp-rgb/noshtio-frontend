export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
) {
  const res = await fetch(input, init);

  if (res.status === 401) {
    console.warn("[Auth] Session expired");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    throw new Error("You do not have permission to perform this action.");
  }

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res;
}

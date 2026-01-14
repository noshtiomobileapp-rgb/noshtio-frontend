const API =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export async function assignMenuItem(
  itemId: string,
  categoryId: string,
  persistRule = false
) {
  const res = await fetch(`${API}/menu-item/${itemId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, persistRule }),
  });
  return res.json();
}

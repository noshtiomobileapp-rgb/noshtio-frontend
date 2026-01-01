import { OcrDraftItem } from "@/types/menu";

export async function saveMenuFromDraft(items: OcrDraftItem[]) {
  const res = await fetch("/api/vendor/menu/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error("Failed to save menu");
  }

  return res.json();
}

import { PublicMenuDTO } from "@/contracts/menu.contract";

/* -------------------------------------------------------
   API
------------------------------------------------------- */
const API =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

/* -------------------------------------------------------
   Backend response shapes
------------------------------------------------------- */
export type PublicMenuApiResponse =
  | PublicMenuDTO
  | { success: boolean; menu: PublicMenuDTO };

/* -------------------------------------------------------
   Fetch public menu
------------------------------------------------------- */
export async function fetchPublicMenu(
  restaurantId: string
): Promise<PublicMenuApiResponse> {
  const res = await fetch(`${API}/public/menu/${restaurantId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch public menu");
  }

  return res.json();
}

import { http } from "./http";
import { PublicMenuDTO } from "@/contracts/menu.contract";

/* ============================================================
   PUBLIC MENU API
============================================================ */

/**
 * Canonical implementation
 */
export async function getPublicMenu(
  restaurantId: string
): Promise<PublicMenuDTO> {
  return http<PublicMenuDTO>({
    method: "GET",
    url: "/menu/public",
    params: { restaurantId },
  });
}

/**
 * Backward-compatible alias
 * (used by src/pages/menu.tsx)
 */
export const fetchPublicMenu = getPublicMenu;

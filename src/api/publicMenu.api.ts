// src/api/publicMenu.api.ts
import { http } from "./http";
import { PublicMenuDTO } from "@/contracts/menu.contract";

export function fetchPublicMenu(
  restaurantId: string
): Promise<PublicMenuDTO> {
  return http({
    method: "GET",
    url: "/menu/public",
    params: { restaurantId },
  });
}

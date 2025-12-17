import { http } from "./http";
import { PublicMenuDTO } from "@/contracts/menu.contract";

export const fetchPublicMenu = async (
  restaurantId: string
): Promise<PublicMenuDTO> => {
  const res = await http.get<PublicMenuDTO>(
    `/menu/public/${restaurantId}`
  );
  return res.data;
};

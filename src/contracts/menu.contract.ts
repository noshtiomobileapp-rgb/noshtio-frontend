/* ============================================================
   MENU — FRONTEND API CONTRACT (MVP)
   ============================================================ */

export type ObjectId = string;

/* -----------------------------
   Public Menu Item (Customer)
------------------------------ */
export interface PublicMenuItemDTO {
  _id: ObjectId;
  name: string;
  price: number;
}

/* -----------------------------
   Public Menu Category (Customer)
------------------------------ */
export interface PublicMenuCategoryDTO {
  _id: ObjectId;
  name: string;
  items: PublicMenuItemDTO[];
}

/* -----------------------------
   Public Menu Response (Customer)
------------------------------ */
export interface PublicMenuDTO {
  restaurantId: ObjectId;
  categories: PublicMenuCategoryDTO[];
}

/* -----------------------------
   API Response Wrapper
------------------------------ */
export interface GetPublicMenuResponse {
  success: true;
  data: PublicMenuDTO;
}

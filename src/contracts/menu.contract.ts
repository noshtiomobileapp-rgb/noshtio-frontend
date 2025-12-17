export interface PublicMenuItemDTO {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface PublicMenuCategoryDTO {
  id: string;
  name: string;
  items: PublicMenuItemDTO[];
}

export interface PublicMenuDTO {
  restaurantId: string;
  categories: PublicMenuCategoryDTO[];
}

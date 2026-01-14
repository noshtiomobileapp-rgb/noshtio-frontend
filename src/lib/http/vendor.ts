export interface VendorCategory {
  _id: string;
  name: string;
  order: number;
  isVisible?: boolean;
}

/* ---------------------------------------------------
   Backend-style response wrapper
--------------------------------------------------- */
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getVendorCategories(
  vendorId: string
): Promise<ApiResponse<VendorCategory[]>> {
  return {
    success: true,
    data: [],
  };
}

export async function createCategory(
  vendorId: string,
  name: string
): Promise<ApiResponse<VendorCategory>> {
  return {
    success: true,
    data: {
      _id: "tmp",
      name,
      order: 0,
      isVisible: true,
    },
  };
}

export async function updateCategory(
  id: string,
  payload: Partial<Pick<VendorCategory, "name" | "isVisible">>
): Promise<ApiResponse<null>> {
  return {
    success: true,
    data: null,
  };
}

export async function reorderCategories(
  categories: VendorCategory[]
): Promise<ApiResponse<null>> {
  return {
    success: true,
    data: null,
  };
}

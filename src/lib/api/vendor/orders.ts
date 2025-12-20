import { apiClient } from "../client";

export const VendorOrdersAPI = {
  list: () => apiClient("/vendor/orders"),

  getOrder: (id: string) => apiClient(`/vendor/orders/${id}`),

  updateStatus: (id: string, payload: any) =>
    apiClient(`/vendor/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

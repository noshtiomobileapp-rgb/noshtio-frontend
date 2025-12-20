import { apiClient } from "../client";

export const VendorProfileAPI = {
  getProfile: () => apiClient("/vendor/profile"),

  updateProfile: (payload: any) =>
    apiClient("/vendor/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

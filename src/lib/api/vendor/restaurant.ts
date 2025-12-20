import { apiClient } from "../client";

export const VendorRestaurantAPI = {
  getRestaurant: () => apiClient("/vendor/restaurant"),

  updateRestaurant: (payload: any) =>
    apiClient("/vendor/restaurant", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  setHours: (payload: any) =>
    apiClient("/vendor/restaurant/hours", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

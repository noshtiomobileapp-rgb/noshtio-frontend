import { apiClient } from "@/lib/apiClient";

export async function loginVendor(email: string, password: string) {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutVendor() {
  return apiClient("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiClient("/api/auth/current", {
    method: "GET",
  });
}
import { apiClient } from "../client";

export function vendorLogin(email: string, password: string) {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

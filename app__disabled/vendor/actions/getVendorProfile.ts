import { VendorAPI } from "@/lib/api/vendors";

export default async function getVendorProfile() {
  return await VendorAPI.getProfile();
}


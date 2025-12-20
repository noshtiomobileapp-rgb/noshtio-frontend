"use client";

import { useEffect, useState } from "react";
import VendorDashboardLayout from "@/components/VendorDashboardLayout";

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vendor");
    if (stored) setVendor(JSON.parse(stored));
  }, []);

  if (!vendor)
    return (
      <VendorDashboardLayout>
        <p>Loading Profile...</p>
      </VendorDashboardLayout>
    );

  return (
    <VendorDashboardLayout>
      <div className="bg-white rounded-lg p-6 max-w-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Vendor Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium">{vendor.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Restaurant Name</label>
            <p className="font-medium">{vendor.restaurantName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{vendor.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Mobile</label>
            <p className="font-medium">{vendor.mobile}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Vendor ID</label>
            <p className="font-mono text-xs">{vendor.id}</p>
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}

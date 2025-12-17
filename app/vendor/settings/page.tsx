"use client";

import { useEffect, useState } from "react";
import VendorDashboardLayout from "@/components/VendorDashboardLayout";

export default function VendorSettingsPage() {
  const [vendor, setVendor] = useState<any>(null);

  // fields for future update
  const [restaurantName, setRestaurantName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vendor");
    if (stored) {
      const v = JSON.parse(stored);
      setVendor(v);
      setRestaurantName(v.restaurantName || "");
      setMobile(v.mobile || "");
    }
  }, []);

  const handleSave = () => {
    alert("Settings save API will be added in next phase.");
  };

  if (!vendor)
    return (
      <VendorDashboardLayout>
        <p>Loading Settings...</p>
      </VendorDashboardLayout>
    );

  return (
    <VendorDashboardLayout>
      <div className="bg-white rounded-lg p-6 max-w-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Restaurant Name</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Mobile</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}

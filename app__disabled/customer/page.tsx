"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CustomerHome() {
  const [vendorId, setVendorId] = useState(localStorage.getItem("vendorId") || "");

  const go = () => {
    if (!vendorId) return alert("Enter vendorId (or set localStorage.vendorId)");
    localStorage.setItem("vendorId", vendorId);
    // navigate to restaurant page
    window.location.href = `/customer/restaurant/${vendorId}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Restaurants</h1>

      <p className="mb-4 text-sm text-gray-500">
        Your backend doesn't expose a vendor list yet. For now, paste a vendorId (from backend data) and press Go.
      </p>

      <div className="flex gap-2">
        <input className="flex-1 px-3 py-2 border rounded" value={vendorId} onChange={(e) => setVendorId(e.target.value)} placeholder="Enter vendorId" />
        <button onClick={go} className="px-4 py-2 bg-blue-600 text-white rounded">Go →</button>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Tip: you can set <code>localStorage.setItem("vendorId", "YOUR_ID")</code> in the console and refresh the vendor dashboard.
      </div>
    </div>
  );
}

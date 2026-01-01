"use client";

import React, { useEffect, useState } from "react";
import ReviewItem from "@/components/ReviewItem";
import { getReviewQueue, getVendorCategories } from "@/lib/api";

export default function OCRReviewPage() {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load vendorId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("vendorId");
    setVendorId(id);
  }, []);

  useEffect(() => {
    if (!vendorId) return;

    async function loadData() {
      setLoading(true);

      const q = await getReviewQueue(vendorId);
      const cats = await getVendorCategories(vendorId);

      setItems(q.items || []);
      setCategories(cats || []);

      setLoading(false);
    }

    loadData();
  }, [vendorId]);

  function handleAssigned(itemId: string) {
    setItems((prev) => prev.filter((i) => i._id !== itemId));
  }

  if (!vendorId) {
    return <div className="p-6">Vendor not logged in.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Review OCR Imported Items</h1>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500">No items pending review.</p>
      )}

      {!loading &&
        items.map((item) => (
          <ReviewItem
            key={item._id}
            item={item}
            categories={categories}
            onAssigned={handleAssigned}
          />
        ))}
    </div>
  );
}

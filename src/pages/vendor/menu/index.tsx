"use client";

import { useEffect, useState } from "react";
import VendorLayout from "../_layout"; // WRAPPER FOR SECURITY
import MenuUpload from "@/components/menu/MenuUpload";
import MenuManager from "@/components/MenuManager";
import { apiGet } from "@/lib/apiClient";

type MenuItem = {
  _id?: string;
  name: string;
  price?: number | null;
};

export default function VendorMenuPage() {
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCurrentDraft() {
    try {
      setLoading(true);
      setError("");

      // ✅ FIXED: removed <any>
      const data = await apiGet("/api/vendor/menu/current");

      if (data && data.snapshotId) {
        setSnapshotId(data.snapshotId);
        setItems(data.items ?? []);
      }
    } catch (err: any) {
      if (err.status !== 404) {
        setError(err?.message || "Failed to load current menu");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentDraft();
  }, []);

  function handleUploaded(newSnapshotId: string) {
    setSnapshotId(newSnapshotId);
    loadCurrentDraft();
  }

  return (
    <VendorLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          {snapshotId && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              Draft Active
            </span>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              1. Upload Menu File
            </h2>
            <MenuUpload onUploaded={handleUploaded} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              2. Review & Edit Items
            </h2>
            {loading ? (
              <div className="animate-pulse flex space-y-4 flex-col">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ) : (
              <MenuManager snapshotId={snapshotId} items={items} />
            )}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
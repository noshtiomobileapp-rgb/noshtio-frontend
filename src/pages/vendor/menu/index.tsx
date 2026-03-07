"use client";

import { useEffect, useState } from "react";
import VendorLayout from "../_layout";
import MenuUpload from "@/components/menu/MenuUpload";
import MenuManager from "@/components/MenuManager";
import { apiGet } from "@/lib/apiClient";

export default function VendorMenuPage() {
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCurrentDraft() {
    try {
      setLoading(true);
      const data = await apiGet<any>("/api/vendor/menu/current");

      // FIX: Safe check for data properties
      if (data && data.snapshotId) {
        setSnapshotId(data.snapshotId);
        setItems(data.items || []);
      } else {
        setSnapshotId(null);
        setItems([]);
      }
    } catch (err: any) {
      if (err.status !== 404) setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCurrentDraft(); }, []);

  return (
    <VendorLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <MenuUpload onUploaded={(id) => { setSnapshotId(id); loadCurrentDraft(); }} />
          </div>
          
          <div className="md:col-span-2">
            {loading ? <p>Loading Menu...</p> : <MenuManager snapshotId={snapshotId} items={items} />}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
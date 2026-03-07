"use client";

import { useState } from "react";

type Props = {
  onUploaded?: (snapshotId: string) => void;
};

export default function MenuUpload({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch(
        "https://noshtio-backend.onrender.com/api/vendor/menu/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data?.snapshotId && onUploaded) {
        onUploaded(data.snapshotId);
      }

    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-semibold">Upload Menu</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-3 py-1 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
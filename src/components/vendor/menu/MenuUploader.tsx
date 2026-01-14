"use client";

import { useState } from "react";

type Props = {
  onUploaded: (snapshotId: string) => void;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function MenuUploader({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("menu", file);

      const res = await fetch(
        `${API_BASE}/api/vendor/menu/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      if (!data?.snapshotId) {
        throw new Error("Invalid upload response");
      }

      onUploaded(data.snapshotId);
    } catch {
      setError("Menu upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 border rounded"
      >
        {loading ? "Uploading..." : "Upload Menu"}
      </button>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}

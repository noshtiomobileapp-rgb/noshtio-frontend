"use client";

import { useState } from "react";
import { apiPost } from "@/lib/apiClient";

export default function MenuUpload({
  onUploaded,
}: {
  onUploaded: (snapshotId: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Must match backend multer.single("file")
      formData.append("file", file);

      // ❌ Removed <any> generic (this caused Render build failure)
      const res = await apiPost("/api/vendor/menu/upload", formData);

      if (res && res.snapshotId) {
        onUploaded(res.snapshotId);
        setFile(null);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload menu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <form onSubmit={handleUpload} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload Menu (.txt, .csv, image, or pdf)
        </label>

        <input
          type="file"
          accept=".txt,.csv,image/*,application/pdf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing..." : "Upload Menu"}
        </button>
      </form>
    </div>
  );
}
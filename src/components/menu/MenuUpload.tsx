"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export default function MenuUpload({
  onUploaded,
}: {
  onUploaded: (snapshotId: string) => void;
}) {
  const [file, setFile] = useState<File | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("menu", file);

      const res = await apiClient(
        "/api/menu/upload",
        {
          method: "POST",
          body: formData,
          skipJson: true,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        setError("Upload failed");
        return;
      }

      const data = await res.json();

      if (!data.snapshotId) {
        setError("Invalid server response");
        return;
      }

      onUploaded(data.snapshotId);
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleUpload}
      className="space-y-3"
    >
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ?? null
          )
        }
      />

      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}

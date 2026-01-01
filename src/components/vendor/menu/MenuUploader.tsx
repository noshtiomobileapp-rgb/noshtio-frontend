"use client";

import { useState } from "react";

/* ============================================================
   Types (EXISTING CONTRACT — LOCKED)
============================================================ */

type UploadState =
  | "idle"
  | "uploading"
  | "success"
  | "error";

type MenuUploaderProps = {
  /**
   * REQUIRED BY EXISTING WORKFLOW
   * Called after successful upload
   * Used by parent to manage snapshot lifecycle
   */
  onUploaded: (snapshotId: string) => void;
};

/* ============================================================
   Component
============================================================ */

export default function MenuUploader({
  onUploaded,
}: MenuUploaderProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    null
  );

  async function handleUpload(file: File) {
    setState("uploading");
    setError(null);
    setFileName(file.name);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(
        "/api/vendor/menu/upload",
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        throw new Error(
          "Menu upload failed. Please try again."
        );
      }

      const json: {
        snapshotId?: string;
      } = await res.json();

      if (!json.snapshotId) {
        throw new Error(
          "Upload succeeded but snapshotId missing"
        );
      }

      setState("success");

      /**
       * CRITICAL:
       * Preserve snapshot-driven workflow
       */
      onUploaded(json.snapshotId);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unexpected error during upload"
      );
      setState("error");
    }
  }

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <div className="font-medium">
        Upload Menu
      </div>

      {/* IDLE */}
      {state === "idle" && (
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) =>
            e.target.files &&
            handleUpload(e.target.files[0])
          }
        />
      )}

      {/* UPLOADING */}
      {state === "uploading" && (
        <div className="text-sm text-gray-600">
          Uploading
          {fileName ? ` "${fileName}"` : ""}…
        </div>
      )}

      {/* SUCCESS */}
      {state === "success" && (
        <div className="text-green-600 text-sm">
          Menu uploaded successfully.
        </div>
      )}

      {/* ERROR */}
      {state === "error" && (
        <div className="text-red-600 text-sm space-y-1">
          <div>{error}</div>
          <button
            className="underline"
            onClick={() => {
              setState("idle");
              setError(null);
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

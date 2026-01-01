"use client";

export default function MenuUploadStatus({
  loading,
  error,
}: {
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Processing menu…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return null;
}

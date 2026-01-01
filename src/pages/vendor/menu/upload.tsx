"use client";

import { useRouter } from "next/router";
import MenuUploader from "@/components/vendor/menu/MenuUploader";

export default function UploadMenuPage() {
  const router = useRouter();

  function handleUploaded(snapshotId: string) {
    router.push(`/vendor/menu/draft?snapshotId=${snapshotId}`);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload Menu</h1>

      <p className="text-gray-600">
        Upload a PDF or image. You can review the menu before publishing.
      </p>

      <MenuUploader onUploaded={handleUploaded} />
    </div>
  );
}

"use client";

import { useState } from "react";

export default function MenuUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("menu", file);

    setLoading(true);

    try {
      const res = await fetch(
        "https://noshtio-backend.onrender.com/api/vendor/menu/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data?.items) {
        setItems(data.items);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Upload Menu</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      <div style={{ marginTop: 20 }}>
        {items.map((item, i) => (
          <div key={i}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
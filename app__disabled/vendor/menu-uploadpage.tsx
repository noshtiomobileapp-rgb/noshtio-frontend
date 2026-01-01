"use client";
import React, { useState } from "react";

export default function MenuUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [mode, setMode] = useState<"idle"|"review">("idle");
  const [loading, setLoading] = useState(false);

  // Upload to backend OCR
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("menu", file);

    const res = await fetch("http://localhost:4000/api/menu", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) return alert("OCR failed");

    setOcrText(data.text || "");

    // Simple text → item splitter
    const split = (data.text || "").split(/\d+\s/).filter(Boolean);

    const extracted = split.map((s: string) => {
      const parts = s.trim().split(" ");
      const price = parts.pop();
      return {
        name: parts.join(" "),
        price: price || "",
        category: "General",
        description: ""
      };
    });

    setItems(extracted);
    setMode("review");
  };

  // Bulk Save
  const handleSave = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:4000/api/menu/bulk-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId: "123", // TODO: replace with authenticated vendor ID
        items
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) return alert("Save failed");

    alert("Menu saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>OCR Menu Upload</h1>

      {/* UPLOAD SECTION */}
      {mode === "idle" && (
        <>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <br /><br />

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload & Extract"}
          </button>
        </>
      )}

      {/* REVIEW SECTION */}
      {mode === "review" && (
        <>
          <h2>OCR Extracted Text</h2>
          <textarea
            value={ocrText}
            rows={6}
            style={{ width: "100%" }}
            readOnly
          />

          <h2>Review & Edit Items</h2>

          {items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 20, background: "#f5f5f5", padding: 10 }}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].name = e.target.value;
                  setItems(updated);
                }}
                placeholder="Name"
                style={{ width: "40%", marginRight: 10 }}
              />

              <input
                type="text"
                value={item.price}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].price = e.target.value;
                  setItems(updated);
                }}
                placeholder="Price"
                style={{ width: "20%", marginRight: 10 }}
              />

              <input
                type="text"
                value={item.category}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].category = e.target.value;
                  setItems(updated);
                }}
                placeholder="Category"
                style={{ width: "20%", marginRight: 10 }}
              />

              <input
                type="text"
                value={item.description}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].description = e.target.value;
                  setItems(updated);
                }}
                placeholder="Description"
                style={{ width: "80%", marginTop: 8 }}
              />
            </div>
          ))}

          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All Items"}
          </button>
        </>
      )}
    </div>
  );
}

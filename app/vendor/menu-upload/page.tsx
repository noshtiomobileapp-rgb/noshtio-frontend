"use client";

import React, { useState, useEffect } from "react";
import VendorDashboardLayout from "@/components/VendorDashboardLayout";

export default function MenuUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [mode, setMode] = useState<"idle" | "review">("idle");
  const [loading, setLoading] = useState(false);

  // 🔥 Get vendorId dynamically
  const [vendorId, setVendorId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vendor");
    if (stored) {
      const v = JSON.parse(stored);
      setVendorId(v.id); // correct vendor id
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("menu", file);

    try {
      const res = await fetch("http://localhost:4000/api/menu", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) return alert("OCR failed!");

      setOcrText(data.text || "");

      // 🔥 Improved OCR parsing
      const lines = (data.text || "")
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

      const parsedItems = lines.map((line: string) => {
        // Extract price at end
        const priceMatch = line.match(/(\d+)\s*$/);
        const price = priceMatch ? priceMatch[1] : "";

        const name = line.replace(/\d+\s*$/, "").trim();

        return {
          name,
          price,
          raw_price: price,
          category: "Uncategorized",
          description: "",
          variants: [],
        };
      });

      setItems(parsedItems);
      setMode("review");
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleSave = async () => {
    if (!vendorId) return alert("Vendor ID missing!");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/menu/bulk-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          raw_ocr: ocrText,
          items,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) return alert("Save failed!");

      alert("Menu saved successfully!");

      // 🔥 Redirect to the REAL menu manager
      window.location.href = "/vendor/menu";
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Save error. Check server logs.");
    }
  };

  return (
    <VendorDashboardLayout>
      <h1 className="text-2xl font-bold mb-4">📄 Upload Menu (OCR)</h1>

      {mode === "idle" && (
        <>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <br />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Processing..." : "Upload & Extract"}
          </button>
        </>
      )}

      {mode === "review" && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">OCR Extracted Text</h2>

          <textarea
            value={ocrText}
            readOnly
            rows={6}
            className="w-full p-2 border rounded mb-6"
          />

          <h2 className="text-xl font-semibold mb-3">Edit Extracted Items</h2>

          {items.map((item, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="flex gap-3 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx].name = e.target.value;
                    setItems(updated);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Item name"
                />

                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx].price = e.target.value;
                    setItems(updated);
                  }}
                  className="w-24 p-2 border rounded"
                  placeholder="Price"
                />

                <select
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx].category = e.target.value;
                    setItems(updated);
                  }}
                  className="p-2 border rounded"
                >
                  <option>Uncategorized</option>
                  <option>Starter</option>
                  <option>Main Course</option>
                  <option>Chinese</option>
                  <option>Beverages</option>
                  <option>Indian</option>
                  <option>Snacks</option>
                </select>
              </div>

              <input
                type="text"
                value={item.description}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].description = e.target.value;
                  setItems(updated);
                }}
                className="w-full p-2 border rounded"
                placeholder="Description"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save Menu"}
          </button>
        </>
      )}
    </VendorDashboardLayout>
  );
}

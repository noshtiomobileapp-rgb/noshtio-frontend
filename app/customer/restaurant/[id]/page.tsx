"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Item = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  available?: boolean;
  category?: string;
};

export default function RestaurantPage() {
  const params: any = useParams();
  const vendorId = params?.id;

  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [categories, setCategories] = useState<{ categoryName: string; items: Item[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    (async function load() {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/vendors-menu/${vendorId}`);
        const menu = data?.menu ?? data;
        const cats = Array.isArray(menu.categories) ? menu.categories : [];
        // sanitize
        const cleaned = cats.map((c: any) => ({
          categoryName: c.categoryName,
          items: Array.isArray(c.items) ? c.items.filter((it) => it && it._id) : [],
        }));
        setCategories(cleaned);
        setRestaurantName(menu.vendorName || `Vendor ${vendorId}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  if (loading) return <div className="p-6">Loading menu…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{restaurantName}</h1>

      {categories.length === 0 ? (
        <div className="text-gray-500">No menu items found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.categoryName}><a href={`#cat-${c.categoryName}`} className="text-sm text-gray-600 hover:text-gray-900">{c.categoryName}</a></li>
              ))}
            </ul>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            {categories.map((c) => (
              <section key={c.categoryName} id={`cat-${c.categoryName}`}>
                <h2 className="text-xl font-semibold mb-3">{c.categoryName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {c.items.map((it) => (
                    <div key={it._id} className="border rounded p-3 bg-white">
                      <div className="h-36 w-full bg-gray-100 rounded overflow-hidden mb-3 flex items-center justify-center">
                        {it.image ? <img src={it.image} className="w-full h-full object-cover" alt={it.name} /> : <div className="text-sm text-gray-400">No image</div>}
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          {it.description && <div className="text-sm text-gray-500">{it.description}</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{(it.price ?? 0).toFixed(2)}</div>
                          <div className={`text-xs ${it.available ? "text-green-600" : "text-red-600"}`}>{it.available ? "Available" : "Not available"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      )}
    </div>
  );
}


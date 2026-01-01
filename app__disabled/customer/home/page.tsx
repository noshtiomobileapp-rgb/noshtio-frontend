"use client";

import React, { useEffect, useState } from "react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import RestaurantCard from "@/components/customer/RestaurantCard";

/**
 * Customer Home (Professional look)
 * - Hero with search
 * - Featured horizontal scroller
 * - Grid of restaurants
 *
 * Replace the mock fetches with your real API endpoints.
 */

export default function CustomerHomePage() {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    // TODO: replace with real API call
    const mockRestaurants = Array.from({ length: 8 }).map((_, i) => ({
      id: `r${i + 1}`,
      name: `Swamya's Bhukkhaar ${i + 1}`,
      subtitle: "North Indian • Fast service",
      rating: (4 + Math.random()).toFixed(1),
      minOrder: 80 + i * 10,
      deliveryTime: 20 + i * 3,
      cover: `/images/restaurant-${(i % 4) + 1}.jpg`,
    }));
    setRestaurants(mockRestaurants);
    setFeatured(mockRestaurants.slice(0, 4));
  }, []);

  const filtered = restaurants.filter((r) =>
    (r.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <CustomerLayout>
      <section className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">
                Find great food nearby
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Curated restaurants, accurate menus and fast delivery.
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines or dishes"
                  className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* featured */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Featured</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {featured.map((r) => (
              <div key={r.id} className="min-w-[260px]">
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        </div>

        {/* restaurants grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">All Restaurants</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}

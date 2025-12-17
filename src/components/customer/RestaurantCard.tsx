"use client";

import React from "react";
import Link from "next/link";

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <Link href={`/customer/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer">
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.cover || '/images/placeholder.jpg'})` }} />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{restaurant.subtitle}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-slate-600">{restaurant.rating} ⭐</div>
            <div className="text-sm text-slate-600">₹{restaurant.minOrder} min</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

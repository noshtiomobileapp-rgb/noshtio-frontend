// components/TopNav.tsx
"use client";

import React from "react";

interface TopNavProps {
  vendor?: any;
  onToggleMobile?: () => void;
  onLogout?: () => void;
}

export default function TopNav({ vendor, onToggleMobile = () => {}, onLogout = () => {} }: TopNavProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={onToggleMobile} aria-label="open menu">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="text-lg font-semibold">{vendor?.restaurantName || vendor?.name || "Vendor"}</div>
          <div className="hidden md:flex items-center ml-4 text-sm text-slate-500">Vendor Dashboard</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
            <input className="px-3 py-2 outline-none w-64" placeholder="Search orders, items or customers" />
            <button className="px-3 py-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" />
              </svg>
            </button>
          </div>

          <button className="p-2 rounded-md hover:bg-gray-100" title="Notifications">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
            </svg>
          </button>

          <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white text-sm">
              {vendor?.name ? vendor.name.charAt(0).toUpperCase() : "V"}
            </div>
            <div className="text-sm">
              <div className="font-medium">Owner</div>
              <div className="text-xs text-slate-500">{vendor?.name || "—"}</div>
            </div>
            <button className="ml-3 text-sm text-red-500" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

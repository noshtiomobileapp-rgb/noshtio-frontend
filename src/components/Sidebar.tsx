// components/Sidebar.tsx
"use client";

import React from "react";

type NavKey = "dashboard" | "orders" | "menu" | "profile";

interface SidebarProps {
  vendor?: any;
  active?: NavKey;
  onNavigate?: (k: NavKey) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  vendor,
  active = "dashboard",
  onNavigate = () => {},
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const items: { key: NavKey; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Orders" },
    { key: "menu", label: "Menu Management" },
    { key: "profile", label: "Profile & Settings" },
  ];

  return (
    <aside
      className={`bg-white border-r w-72 p-4 md:block ${
        mobileOpen ? "block absolute z-30 inset-0 w-64" : "hidden md:block"
      }`}
    >
      <div className="mb-6">
        <div className="text-sm text-slate-500">Signed in as</div>
        <div className="font-semibold text-lg">{vendor?.name || "Vendor"}</div>
        {vendor?.restaurantName && (
          <div className="text-sm text-slate-400">{vendor.restaurantName}</div>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            className={`w-full text-left px-3 py-2 rounded-md ${
              active === it.key ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 text-xs text-slate-500">
        Tip: Use the Menu tab to manage items quickly.
      </div>

      <div className="mt-6 text-xs text-slate-400">v1.0</div>
    </aside>
  );
}

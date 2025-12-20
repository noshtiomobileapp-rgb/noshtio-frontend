"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------
   Navigation Config (SINGLE SOURCE OF TRUTH)
------------------------------------------------------------------- */

const NAV_ITEMS = [
  { label: "Overview", path: "/vendor" },
  { label: "Orders", path: "/vendor/orders" },
  { label: "Menu", path: "/vendor/menu" },
  { label: "Categories", path: "/vendor/categories" },
  { label: "Analytics", path: "/vendor/analytics" },
  { label: "Sessions", path: "/vendor/sessions" },
  { label: "Settings", path: "/vendor/settings" },
];

/* ------------------------------------------------------------------
   Layout Component
------------------------------------------------------------------- */

export default function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ============================================================
          Sidebar (Desktop)
      ============================================================ */}
      <aside className="hidden md:flex md:w-64 bg-white border-r flex-col">
        <div className="h-14 px-4 flex items-center font-semibold border-b">
          Vendor Panel
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.path ||
              (item.path !== "/vendor" &&
                pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  active
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ============================================================
          Main Content
      ============================================================ */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* ============================================================
          Bottom Navigation (Mobile)
      ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around text-xs">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.path ||
            (item.path !== "/vendor" &&
              pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 py-2 text-center ${
                active ? "text-black font-medium" : "text-gray-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

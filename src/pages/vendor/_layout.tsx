"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* ============================================================
   Navigation Config
============================================================ */

const NAV_ITEMS = [
  { label: "Overview", path: "/vendor" },
  { label: "Orders", path: "/vendor/orders" },
  { label: "Menu", path: "/vendor/menu" },
  { label: "Analytics", path: "/vendor/analytics" },
];

function getUserFromToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  function isActive(path: string) {
    return (
      pathname === path ||
      (path !== "/vendor" && pathname.startsWith(path))
    );
  }

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "VENDOR") {
      router.replace("/unauthorized");
      return;
    }

    if (!user.tenantId) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg">
            Vendor Dashboard
          </span>

          <nav className="hidden md:flex gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={
                  isActive(item.path)
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
        {children}
      </main>

      <nav className="md:hidden sticky bottom-0 border-t bg-white">
        <div className="grid grid-cols-4 text-xs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={
                isActive(item.path)
                  ? "py-2 text-center text-blue-600 font-medium"
                  : "py-2 text-center text-gray-500"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

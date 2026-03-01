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

/* ============================================================
   Helper: Safe Token Decoder with Expiry Check
============================================================ */
function getValidUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Check if token is expired (JWT exp is in seconds)
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem("token"); // Clean up expired token
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Use status instead of just "ready"
  const [status, setStatus] = useState<"loading" | "authorized">("loading");

  function isActive(path: string) {
    return pathname === path || (path !== "/vendor" && pathname.startsWith(path));
  }

  useEffect(() => {
    const user = getValidUser();

    // 1. Check Auth
    if (!user) {
      router.replace("/login");
      return;
    }

    // 2. Check Role (Matches your backend "VENDOR" requirement)
    if (user.role !== "VENDOR") {
      router.replace("/unauthorized");
      return;
    }

    // 3. Check Tenant (Critical for Menu Upload)
    if (!user.tenantId && !user.id) {
      router.replace("/login");
      return;
    }

    setStatus("authorized");
  }, [pathname, router]); // Re-run check on every navigation

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-gray-800">Vendor Panel</span>

          <nav className="hidden md:flex gap-8 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={
                  isActive(item.path)
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-5 mt-5"
                    : "text-gray-500 hover:text-gray-900 transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <button 
            onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
            className="text-xs text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <nav className="md:hidden sticky bottom-0 border-t bg-white shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(item.path) ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
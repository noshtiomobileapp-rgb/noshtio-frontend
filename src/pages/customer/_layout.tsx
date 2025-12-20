"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useCartStore } from "@/store/cart-store";
import { useSessionStore } from "@/store/session.store";
import { text } from "@/styles/tokens";

type CustomerDashboardProps = {
  children: ReactNode;
};

export default function CustomerDashboard({
  children,
}: CustomerDashboardProps) {
  const router = useRouter();
  const path = router.pathname;

  const totalQty = useCartStore((s) => s.totalQty());
  const initSession = useSessionStore((s) => s.initSession);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b flex flex-col items-center justify-center leading-tight">
        <span className="font-semibold text-gray-900">
          Restaurant
        </span>
        <span className="text-xs text-gray-500">
          Table Order
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-3 py-4 pb-24">
        {children}
      </main>

      {/* Bottom Tabs (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around h-14">
          <Tab
            href="/customer/menu"
            label="Menu"
            active={path === "/customer/menu"}
          />

          <Tab
            href="/customer/cart"
            label={
              <span className="flex items-center gap-1">
                Cart
                {totalQty > 0 && (
                  <span className="ml-1 bg-black text-white text-xs rounded-full px-2">
                    {totalQty}
                  </span>
                )}
              </span>
            }
            active={path === "/customer/cart"}
          />

          <Tab
            href="/customer/status"
            label="Orders"
            active={path.startsWith("/customer/status")}
          />
        </div>
      </nav>
    </div>
  );
}

type TabProps = {
  href: string;
  label: ReactNode;
  active?: boolean;
};

function Tab({ href, label, active }: TabProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-full text-xs ${
        active ? "text-black font-semibold" : "text-gray-500"
      }`}
    >
      {label}
    </Link>
  );
}

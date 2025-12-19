"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type CustomerDashboardProps = {
  children: ReactNode;
};

export default function CustomerDashboard({
  children,
}: CustomerDashboardProps) {
  const router = useRouter();
  const path = router.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b flex items-center justify-center font-semibold">
        QRestro
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
            label="Cart"
            active={path === "/customer/cart"}
          />
          <Tab
            label="Orders"
            disabled
          />
        </div>
      </nav>
    </div>
  );
}

type TabProps = {
  href?: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
};

function Tab({ href, label, active, disabled }: TabProps) {
  if (disabled) {
    return (
      <div className="flex flex-col items-center justify-center text-xs text-gray-400 w-full">
        {label}
      </div>
    );
  }

  return (
    <Link
      href={href!}
      className={`flex flex-col items-center justify-center w-full text-xs ${
        active
          ? "text-black font-semibold"
          : "text-gray-500"
      }`}
    >
      {label}
    </Link>
  );
}

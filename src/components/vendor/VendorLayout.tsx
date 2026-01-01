"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

/* ============================================================
   TYPES (SHARED WITH SIDEBAR)
============================================================ */

export type NavKey = "dashboard" | "orders" | "menu" | "profile";

/* ============================================================
   VENDOR LAYOUT
============================================================ */

type Props = {
  vendor: any;
  active?: NavKey;
  onNavigate: (key: NavKey) => void;
  children: ReactNode;
};

export default function VendorLayout({
  vendor,
  active,
  onNavigate,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar
        vendor={vendor}
        active={active}
        onNavigate={onNavigate}
      />

      <div className="flex-1">
        <TopNav vendor={vendor} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

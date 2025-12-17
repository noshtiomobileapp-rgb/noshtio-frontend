"use client";

import React from "react";
import Link from "next/link";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">Qrestro</Link>

          <nav className="flex items-center gap-4">
            <Link href="/customer/home" className="text-sm text-slate-700">Home</Link>
            <Link href="/customer/orders" className="text-sm text-slate-700">Orders</Link>
            <Link href="/customer/cart" className="text-sm text-slate-700">Cart</Link>
            <Link href="/customer/profile" className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm">Sign in</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Qrestro — Built for demos
        </div>
      </footer>
    </div>
  );
}

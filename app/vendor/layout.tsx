"use client";

import React from "react";

/**
 * Vendor Root Layout
 *
 * This layout wraps all vendor-related pages:
 * - /vendor/login
 * - /vendor/dashboard
 * - /vendor/menu
 * - /vendor/orders
 * - /vendor/profile
 *
 * IMPORTANT:
 * This layout intentionally contains NO imports from old dashboard components
 * because those files were archived. This ensures the vendor app loads cleanly.
 */

export default function VendorRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  );
}

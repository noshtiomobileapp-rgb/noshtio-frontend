"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DashboardCards from "@/components/DashboardCards";
import OrdersTable from "@/components/OrdersTable";
import MenuManager from "@/components/MenuManager";
import ProfileSettings from "@/components/ProfileSettings";

type NavKey = "dashboard" | "orders" | "menu" | "profile";

export default function VendorDashboardPage() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVendor() {
      try {
        const res = await fetch("http://localhost:4000/api/vendors/me", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Unable to load vendor data");

        setVendor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVendor();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!vendor) return <p className="p-6">Vendor not logged in.</p>;

  return (
    <div className="min-h-screen bg-neutral-50 flex">

      {/* Sidebar MUST receive ONLY vendor */}
      <Sidebar
        vendor={vendor}
        active={active}
        onNavigate={setActive}
      />

      <div className="flex-1">

        {/* TopNav MUST receive ONLY vendor */}
        <TopNav vendor={vendor} />

        <main className="p-6">

          {/* DashboardCards MUST receive ONLY vendor */}
          {active === "dashboard" && <DashboardCards vendor={vendor} />}

          {active === "orders" && (
            <OrdersTable />
          )}

          {active === "menu" && (
            <MenuManager vendorId={vendor._id} />
          )}

          {active === "profile" && (
            <ProfileSettings vendor={vendor} />
          )}

        </main>
      </div>
    </div>
  );
}

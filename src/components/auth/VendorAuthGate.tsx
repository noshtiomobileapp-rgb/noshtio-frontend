"use client";

import { useEffect, useState } from "react";

/* ============================================================
   VENDOR AUTH GATE (CLIENT-SIDE)
============================================================ */

export default function VendorAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.assign("/vendor/login");
      return;
    }

    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";

export default function VendorAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/vendor/login");
      return;
    }
    setAllowed(true);
  }, []);

  if (!allowed) {
    return null; // ⛔ nothing inside executes
  }

  return <>{children}</>;
}

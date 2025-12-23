import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Vendor root entry point (MVP)
 *
 * Rule:
 * Vendors must land on Orders, not Overview.
 * Overview is secondary and can live at /vendor/overview later.
 */
export default function VendorIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/vendor/orders");
  }, [router]);

  return null;
}

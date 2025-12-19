"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CustomerIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/customer/menu");
  }, [router]);

  return null;
}

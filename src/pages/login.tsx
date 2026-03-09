"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/vendor/login");
  }, [router]);

  return null;
}
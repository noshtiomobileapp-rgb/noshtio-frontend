import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Frontend middleware
 * - NO authentication logic
 * - Backend is source of truth
 * - Only route passthrough / redirects (if ever needed)
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*"],
};

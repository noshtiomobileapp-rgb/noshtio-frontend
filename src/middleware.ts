import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow auth pages
  if (
    pathname.startsWith("/vendor/login") ||
    pathname.startsWith("/vendor/register")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/vendor/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*"],
};

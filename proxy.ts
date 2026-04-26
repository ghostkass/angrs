import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = [
  "/dashboard",
  "/members",
  "/contributions",
  "/documents",
  "/social-operations",
  "/roles",
  "/api-docs",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (isProtected && !request.cookies.get(AUTH_COOKIE_NAME)?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|uploads).*)"],
};

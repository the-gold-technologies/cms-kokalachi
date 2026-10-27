import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const currentUrl = new URL(req.url);

  // 1. API routes check their own access: an admin session, or the website's shared secret.
  // The website calls the API server-to-server only, so no CORS handling is needed.
  if (nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Public Pages
  const isPublicRoute =
    ["/login", "/register"].includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/templates/");

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", currentUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", currentUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|templates/).*)"],
};

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

function getAllowedOrigin(): string {
  return (process.env.ALLOWED_ORIGIN || "").trim();
}

function resolveMatchingOrigin(incomingOrigin: string | null, requestOrigin: string): string | null {
  if (!incomingOrigin) return null;
  const configuredOrigin = getAllowedOrigin();

  // Allow the single configured origin from env
  if (configuredOrigin && (configuredOrigin === "*" || configuredOrigin === incomingOrigin)) {
    return incomingOrigin;
  }

  // Allow same-origin requests from the CMS dashboard itself
  if (incomingOrigin === requestOrigin) {
    return incomingOrigin;
  }

  return null;
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const currentUrl = new URL(req.url);
  const rawOrigin = req.headers.get("origin");
  const matchingOrigin = resolveMatchingOrigin(rawOrigin, currentUrl.origin);

  // 1. API CORS Handling
  if (nextUrl.pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      if (rawOrigin && !matchingOrigin) {
        return new NextResponse(null, { status: 403 });
      }

      return new NextResponse(null, {
        status: 200,
        headers: {
          ...(matchingOrigin ? { "Access-Control-Allow-Origin": matchingOrigin } : {}),
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          ...(matchingOrigin ? { "Access-Control-Allow-Credentials": "true" } : {}),
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = NextResponse.next();
    if (matchingOrigin) {
      response.headers.set("Access-Control-Allow-Origin", matchingOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return response;
  }

  // 2. Auth Routes & Public Pages
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute =
    ["/login", "/register", "/robots.txt", "/sitemap.xml"].includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/templates/");

  if (isApiAuthRoute) return NextResponse.next();

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", currentUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", currentUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|templates/).*)",
  ],
};

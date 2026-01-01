import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
// import { getAuth } from "@/lib/better-auth/auth"; // Removed to avoid Mongoose in Edge

const GUEST_COOKIE_NAME = "signalist_guest_session";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const guestCookie = request.cookies.get(GUEST_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  // If accessing admin routes, ensure session exists
  // Detailed role verification is handled in admin/layout.tsx (Server Component)
  if (isAdminRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow guest access to non-admin routes
  // We no longer redirect to sign-in for missing session on public routes
  // The root layout will handle creating a "guest" user object

  const response = NextResponse.next();

  // If a user authenticates after being a guest, clear the guest cookie
  if (sessionCookie && guestCookie) {
    response.cookies.set(GUEST_COOKIE_NAME, "", {
      path: "/",
      expires: new Date(0),
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)",
  ],
};

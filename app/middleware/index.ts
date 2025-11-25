import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/better-auth/auth";

const GUEST_COOKIE_NAME = 'signalist_guest_session';

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const guestCookie = request.cookies.get(GUEST_COOKIE_NAME);
    const { pathname } = request.nextUrl;

    // Check if this is an admin route
    const isAdminRoute = pathname.startsWith('/admin');

    // If accessing admin routes, verify admin role
    if (isAdminRoute && sessionCookie) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });

            const userRole = (session?.user as any)?.role;

            if (userRole !== 'admin') {
                // Non-admin trying to access admin routes
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            console.error('Middleware auth error:', error);
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    // Existing auth logic for non-admin routes
    if (!isAdminRoute && !sessionCookie && !guestCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const response = NextResponse.next();

    // If a user authenticates after being a guest, clear the guest cookie
    if (sessionCookie && guestCookie) {
        response.cookies.set(GUEST_COOKIE_NAME, '', {
            path: '/',
            expires: new Date(0),
        });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};
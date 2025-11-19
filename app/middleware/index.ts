import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const GUEST_COOKIE_NAME = 'signalist_guest_session';

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const guestCookie = request.cookies.get(GUEST_COOKIE_NAME);

    if (!sessionCookie && !guestCookie) {
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
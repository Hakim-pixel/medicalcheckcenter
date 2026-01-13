import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("session")?.value;
    const session = token ? await verifyToken(token) : null;

    // 1. Redirect to /login if accessing protected route without session
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 2. Redirect to /dashboard if accessing auth route with session
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // 3. Role-based access control (Basic)
    // We can expand this for specifics e.g., /dashboard/users only for ADMIN
    if (pathname.startsWith("/dashboard/users")) {
        if (session?.role !== "ADMIN") {
            // You could redirect to a 403 page or just back to dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};

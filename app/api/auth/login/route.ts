import { signToken } from "@/lib/auth";
import { loginToLaravel } from "@/lib/api";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Call Laravel API
        const data = await loginToLaravel({
            username: body.username,
            password: body.password
        });

        if (!data || !data.access_token) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create Next.js Session with Laravel Token
        const sessionPayload = {
            user: data.user,
            accessToken: data.access_token,
            role: data.user.role // Ensure role is available for middleware/sidebar
        };

        const token = await signToken(sessionPayload);
        const cookieStore = await cookies();

        // 1 Day Expiry
        cookieStore.set({
            name: "session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return NextResponse.json({ user: data.user });
    } catch (error: any) {
        // Return detailed error in development to help debugging
        const payload: any = { message: error?.message || "Internal error" };
        if (process.env.NODE_ENV !== 'production') payload.stack = error?.stack;
        return NextResponse.json(payload, { status: 500 });
    }
}

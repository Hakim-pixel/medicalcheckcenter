import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "super-secret-key-change-this-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return null;
    return await verifyToken(session.value);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Extend expiration
    const parsed = await verifyToken(session);
    if (!parsed) return;

    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await signToken(parsed),
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return res;
}

"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function logout() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (sessionCookie) {
        try {
            // Attempt to logout from backend
            // We need to decode the JWE to get the access token if needed, 
            // seeing how getSession works in lib/auth.ts might be useful but we can try to rely on just clearing the cookie if the backend doesn't Strictly need the token for logout or if we assume the token is in the cookie payload.
            // Actually, `lib/auth.ts` handles the sensitive token extraction. 
            // Let's just clear the cookie first. If we want to be thorough, we should call backend logout.

            // For now, let's just clear the cookie to allow immediate sign out.
            // Ideally we should also invalidate the token on the backend.

            // Re-reading logic: lib/api.ts fetches session to get token. 
            // Since this is a server action, we can't easily reuse `fetchFromLaravel` because it uses `getSession` which uses `cookies()` which works here too.

            // Let's try to do it properly:
            const { getSession } = await import("@/lib/auth")
            const session = await getSession()

            if (session?.accessToken) {
                await fetch(`${API_URL}/logout`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${session.accessToken}`,
                        "Accept": "application/json"
                    }
                })
            }
        } catch (e) {
            console.error("Logout error:", e)
        }
    }

    // Always clear cookie and redirect
    cookieStore.delete("session")
    redirect("/login")
}

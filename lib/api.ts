import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Normalize API base so callers can append `/login`, `/kunjungan` etc.
const API_BASE = (() => {
    try {
        const raw = API_URL || "";
        // remove trailing slashes
        const trimmed = raw.replace(/\/+$/, "");
        // ensure it ends with /api
        return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    } catch (e) {
        return API_URL;
    }
})();

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function fetchFromLaravel(endpoint: string, method: RequestMethod = "GET", body?: any) {
    const session = await getSession();
    const token = session?.accessToken;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // If we have a Next session token for the logged-in user, use it.
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Server-only service token (do NOT prefix with NEXT_PUBLIC_). This lets
    // server-side fetches authenticate via a secret stored in Vercel (or local
    // env) without exposing the token to the browser. Only attach when running
    // on the server to avoid leaking the secret.
    try {
        const isServer = typeof window === 'undefined';
        if (isServer) {
            // Access env var only on server side. Use API_SERVICE_TOKEN in Vercel
            // environment (do NOT add NEXT_PUBLIC_ prefix).
            const serviceToken = process.env.API_SERVICE_TOKEN;
            if (serviceToken) headers['Authorization'] = `Bearer ${serviceToken}`;
        }
    } catch (e) {
        // ignore in client build
    }

    try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        });

        if (res.status === 401) {
            // Handle unauthorized - maybe return a specific error code
            return null;
        }

        if (!res.ok) {
            console.error(`Laravel API Error [${endpoint}]:`, res.statusText);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error("Laravel API Connection Error:", e);
        return null;
    }
}

export async function loginToLaravel(credentials: any) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
            cache: 'no-store'
        });

        if (!res.ok) return null;

        // Read as text first to guard against non-JSON warnings/errors injected by PHP
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('loginToLaravel: response not JSON:', text);
            return null;
        }
    } catch (e) {
        return null;
    }
}

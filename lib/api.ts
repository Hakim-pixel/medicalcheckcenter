import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function fetchFromLaravel(endpoint: string, method: RequestMethod = "GET", body?: any) {
    const session = await getSession();
    const token = session?.accessToken;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
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

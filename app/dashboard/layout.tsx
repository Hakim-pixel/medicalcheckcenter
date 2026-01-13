import DashboardClientLayout from "@/components/DashboardClientLayout"
import { getSession } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In a real app, verify session here
    // For now, read cookie locally or assume logged in
    // We'll decode the cookie to determine role for the Sidebar
    const session = await getSession();
    const role = (session?.role as "ADMIN" | "DOKTER" | "PETUGAS_RM" | "MANAJER") || "ADMIN";

    return <DashboardClientLayout role={role}>{children}</DashboardClientLayout>
}

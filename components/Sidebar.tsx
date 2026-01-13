"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    CreditCard,
    Users,
    FileText,
    LayoutDashboard,
    Stethoscope,
    Pill,
    Syringe,
    Settings,
    LogOut,
    Building,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/actions"

// Define menu items for each role
// In a real app, role would come from a session hook
type Role = "ADMIN" | "DOKTER" | "PETUGAS_RM" | "MANAJER"

const MENUS: Record<Role, { label: string; href: string; icon: any }[]> = {
    ADMIN: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Dokter", href: "/dashboard/dokter", icon: Stethoscope },
        { label: "Poliklinik", href: "/dashboard/poli", icon: Building },
        { label: "Obat", href: "/dashboard/obat", icon: Pill },
        { label: "Tindakan", href: "/dashboard/tindakan", icon: Syringe },
        { label: "User Management", href: "/dashboard/users", icon: Users },
        { label: "System Health", href: "/dashboard/settings", icon: Settings },
    ],
    DOKTER: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Jadwal", href: "/dashboard/jadwal", icon: FileText },
        { label: "Pemeriksaan", href: "/dashboard/pemeriksaan", icon: Stethoscope },
    ],
    PETUGAS_RM: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Pendaftaran", href: "/dashboard/pendaftaran", icon: FileText },
        { label: "Pasien", href: "/dashboard/pasien", icon: Users },
    ],
    MANAJER: [
        { label: "Executive Dashboard", href: "/dashboard/executive", icon: LayoutDashboard },
        { label: "Laporan", href: "/dashboard/laporan", icon: FileText },
    ],
    // For other roles, if you want Settings, add it here.
}

interface SidebarProps {
    role?: Role;
    onClose?: () => void;
}

export function Sidebar({ role = "ADMIN", onClose }: SidebarProps) {
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const items = MENUS[role] || MENUS.ADMIN

    return (
        <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    MedRecordSys
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "text-blue-400" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        console.log("Logout clicked");
                        startTransition(() => {
                            logout()
                                .then(() => console.log("Logout action completed"))
                                .catch((err) => console.error("Logout failed", err));
                        });
                    }}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
                        isPending && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <LogOut size={18} />
                    {isPending ? "Signing Out..." : "Sign Out"}
                </button>
            </div>
        </div>
    )
}

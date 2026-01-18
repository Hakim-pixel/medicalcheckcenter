"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Menu, X } from "lucide-react"

export default function DashboardClientLayout({
    children,
    role
}: {
    children: React.ReactNode
    role: "ADMIN" | "DOKTER" | "PETUGAS_RM" | "MANAJER"
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const sidebarRef = useRef<HTMLDivElement | null>(null)

    // Manage body scroll and focus when mobile menu is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden"
            // focus first focusable element inside sidebar when opened
            setTimeout(() => {
                const el = sidebarRef.current?.querySelector<HTMLElement>("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])")
                el?.focus()
            }, 50)
        } else {
            document.body.style.overflow = previousOverflow
        }

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isMobileMenuOpen])

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Wrapper */}
            <div
                ref={sidebarRef}
                className={`fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                role={isMobileMenuOpen ? "dialog" : undefined}
                aria-modal={isMobileMenuOpen ? true : undefined}
                aria-label={isMobileMenuOpen ? "Sidebar navigation" : undefined}
            >
                <Sidebar role={role} onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center h-16 px-4 border-b border-slate-200 bg-white shrink-0">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-semibold text-slate-900">Klinik Lopang</span>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

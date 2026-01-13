"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Correct import for App Router
import { Lock, User as UserIcon, Loader2, Stethoscope, ChevronRight } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // Temporary: Simulate login for now until API is ready
            // In real implementation, this will fetch /api/auth/login
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                throw new Error("Invalid credentials")
            }

            const data = await res.json()

            // Redirect based on role
            // For now, just go to dashboard
            router.push("/dashboard")

        } catch (err) {
            setError("Username or password incorrect.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-slate-50">
            {/* Left Side - Hero / Image */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 text-white max-w-lg p-12">
                    <div className="mb-6 inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                        <Stethoscope size={48} className="text-blue-100" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Sistem Rekam <br />
                        <span className="text-blue-200">Medis Digital</span>
                    </h1>
                    <p className="text-xl text-blue-100/80 mb-8 leading-relaxed">
                        Platform terintegrasi untuk manajemen pelayanan kesehatan yang efisien, akurat, dan aman.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="text-3xl font-bold mb-1">15k+</div>
                            <div className="text-sm text-blue-200">Pasien Terdaftar</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="text-3xl font-bold mb-1">99.9%</div>
                            <div className="text-sm text-blue-200">Uptime Layanan</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang Kembali</h2>
                        <p className="text-slate-500">Silahkan login untuk mengakses sistem</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <UserIcon size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Masukkan username anda"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Masukkan password anda"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Masuk Sekarang
                                    <ChevronRight size={18} className="opacity-80" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            © 2025 Sistem Rekam Medis. Dilindungi Undang-undang.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

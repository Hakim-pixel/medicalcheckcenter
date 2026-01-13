import { cookies } from "next/headers"
import { Users, FileText, Activity } from "lucide-react"
import { fetchFromLaravel } from "@/lib/api"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    let user = { role: "ADMIN", name: "User" }

    if (session) {
        try {
            user = JSON.parse(session.value)
        } catch (e) { }
    }

    const stats = await fetchFromLaravel("/dashboard/stats");

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">
                    Selamat datang kembali, <span className="font-semibold text-blue-600">{user.name}</span> ({user.role})
                </p>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Total Pasien</div>
                        <div className="text-2xl font-bold text-slate-900">{stats?.total_pasien || 0}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Kunjungan Hari Ini</div>
                        <div className="text-2xl font-bold text-slate-900">{stats?.kunjungan_hari_ini || 0}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Tindakan Selesai</div>
                        <div className="text-2xl font-bold text-slate-900">{stats?.tindakan_selesai || 0}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png"
                    alt="Illustration"
                    className="w-48 h-48 mb-6 opacity-50 grayscale"
                />
                <h3 className="text-xl font-semibold text-slate-900">Pilih menu di sebelah kiri</h3>
                <p className="text-slate-500 max-w-md mt-2">
                    Gunakan sidebar navigasi untuk mengakses fitur {user.role === 'ADMIN' ? 'manajemen data' : 'layanan medis'} sesuai dengan hak akses anda.
                </p>
            </div>
        </div>
    )
}

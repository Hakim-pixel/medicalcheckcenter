import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { fetchFromLaravel } from "@/lib/api";

export default async function ExecutiveDashboard() {
    // 1. Stats Cards Data
    const pasienRes = await fetchFromLaravel('/pasien')
    const pasien = Array.isArray(pasienRes) ? pasienRes : []
    const totalPasien = pasien.length

    const kunjunganRes = await fetchFromLaravel('/kunjungan')
    const kunjungans = Array.isArray(kunjunganRes) ? kunjunganRes : []

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const visitsToday = kunjungans.filter((k: any) => new Date(k.tgl_kunjungan).getTime() >= startOfDay.getTime()).length

    const resepRes = await fetchFromLaravel('/resep')
    const resep = Array.isArray(resepRes) ? resepRes : []
    const obatRes = await fetchFromLaravel('/obat')
    const obats = Array.isArray(obatRes) ? obatRes : []

    // Build map of obat by id for price lookup
    const obatMap: Record<string, any> = {}
    obats.forEach((o: any) => { obatMap[o.id] = o })

    const revenueObat = resep.reduce((acc: number, curr: any) => acc + ((curr.jumlah || 0) * ((obatMap[curr.obatId]?.harga) || 0)), 0)

    const tpRes = await fetchFromLaravel('/tindakan-pasien')
    const tp = Array.isArray(tpRes) ? tpRes : []
    const revenueTindakan = tp.reduce((acc: number, curr: any) => acc + (curr.biaya || 0), 0)

    const totalRevenue = revenueObat + revenueTindakan

    const rmsRes = await fetchFromLaravel('/rekam-medis')
    const rms = Array.isArray(rmsRes) ? rmsRes : []
    const diagnosisCounts: Record<string, number> = {}
    rms.forEach((rm: any) => {
        const diag = rm.diagnosa || 'Unspecified'
        diagnosisCounts[diag] = (diagnosisCounts[diag] || 0) + 1
    })

    const topDiagnoses = Object.entries(diagnosisCounts).sort(([, a], [, b]) => b - a).slice(0, 5)

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
                    <p className="text-slate-500">Ringkasan kinerja operasional & finansial</p>
                </div>
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{totalPasien.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Pasien Terdaftar</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{visitsToday}</div>
                    <div className="text-sm text-slate-500">Kunjungan Hari Ini</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Est. Revenue</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">Rp {totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Pendapatan (Obat + Tindakan)</div>
                </div>
            </div>

            {/* Top Diagnoses Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-slate-400" />
                        Diagnosa Terbanyak
                    </h3>
                    <div className="space-y-4">
                        {topDiagnoses.length === 0 ? (
                            <p className="text-slate-400 text-sm italic">Belum ada data diagnosa.</p>
                        ) : (
                            topDiagnoses.map(([name, count], idx) => (
                                <div key={name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{name}</span>
                                        <span className="text-slate-500">{count} Kasus</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(count / topDiagnoses[0][1]) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold mb-2">Laporan Bulanan</h3>
                    <p className="text-slate-400 mb-6 max-w-sm">Unduh laporan lengkap aktivitas rumah sakit dalam format PDF atau Excel.</p>
                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition">
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
}

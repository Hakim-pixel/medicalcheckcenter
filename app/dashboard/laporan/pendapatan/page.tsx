import { Activity, Banknote } from "lucide-react";
import { fetchFromLaravel } from "@/lib/api";

export default async function LaporanPendapatanPage() {
    // Aggregate procedure revenue
    const proceduresRes = await fetchFromLaravel('/tindakan')
    const procedures = Array.isArray(proceduresRes) ? proceduresRes : []

    // Fetch tindakan pasien (transactions) to aggregate revenue
    const tpRes = await fetchFromLaravel('/tindakan-pasien')
    const tp = Array.isArray(tpRes) ? tpRes : []

    const report = procedures.map((proc: any) => {
        const tindakanPasien = tp.filter((t: any) => t.tindakanId === proc.id)
        const frequency = tindakanPasien.length;
        const revenue = tindakanPasien.reduce((acc: number, cur: any) => acc + (cur.biaya || 0), 0);
        return {
            ...proc,
            frequency,
            revenue
        };
    }).sort((a: any, b: any) => b.revenue - a.revenue);

    const totalRevenue = report.reduce((acc: number, cur: any) => acc + cur.revenue, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Pendapatan Jasa Medis</h1>
                    <p className="text-slate-500">Analisa pendapatan dari tindakan medis</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-xs opacity-80 block">Total Pendapatan Jasa</span>
                        <span className="font-bold text-lg">Rp {totalRevenue.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2">
                        <a href="/api/export/pendapatan" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export Pendapatan</a>
                        <a href="/api/export/pasien" className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800">Export Pasien</a>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Nama Tindakan</th>
                                <th className="px-6 py-3 text-right">Tarif Saat Ini</th>
                                <th className="px-6 py-3 text-center">Frekuensi</th>
                                <th className="px-6 py-3 text-right">Total Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {report.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <Activity size={16} className="text-indigo-500" />
                                        {item.nama_tindakan}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-500">Rp {item.tarif.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{item.frequency}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                                        Rp {item.revenue.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

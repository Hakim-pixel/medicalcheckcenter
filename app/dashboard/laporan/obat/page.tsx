import { Pill, TrendingDown } from "lucide-react";
import { fetchFromLaravel } from "@/lib/api";

export default async function LaporanObatPage() {
    // Aggregate medicine usage from Resep
    const obatsRes = await fetchFromLaravel('/obat')
    const obats = Array.isArray(obatsRes) ? obatsRes : []

    const resepsRes = await fetchFromLaravel('/resep')
    const reseps = Array.isArray(resepsRes) ? resepsRes : []

    const report = obats.map((obat: any) => {
        const itemResep = reseps.filter((r: any) => r.obatId === obat.id)
        const totalSold = itemResep.reduce((acc: number, cur: any) => acc + (cur.jumlah || 0), 0)
        const revenue = totalSold * (obat.harga || 0)
        return {
            ...obat,
            totalSold,
            revenue
        }
    }).sort((a: any, b: any) => b.totalSold - a.totalSold);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Penggunaan Obat</h1>
                    <p className="text-slate-500">Analisa stok dan penjualan obat</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Nama Obat</th>
                                <th className="px-6 py-3">Jenis</th>
                                <th className="px-6 py-3 text-right">Harga Satuan</th>
                                <th className="px-6 py-3 text-center">Terjual</th>
                                <th className="px-6 py-3 text-center">Sisa Stok</th>
                                <th className="px-6 py-3 text-right">Estimasi Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {report.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <Pill size={16} className="text-blue-500" />
                                        {item.nama_obat}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{item.jenis}</td>
                                    <td className="px-6 py-4 text-right font-mono">Rp {item.harga.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center font-bold text-blue-600">{item.totalSold}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.stok < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.stok}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-green-700">
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

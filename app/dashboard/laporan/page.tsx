import { Printer } from "lucide-react";
import Link from 'next/link';
import { fetchFromLaravel } from "@/lib/api";
import ExportButton from "./ExportButton";

export default async function LaporanPage() {
    const res = await fetchFromLaravel('/kunjungan')
    const visits = Array.isArray(res) ? res : []

    // Calculate Total Cost per visit helper
    function calculateTotal(visit: any) {
        if (!visit.rekamMedis) return 0;

        const obatCost = visit.rekamMedis.resep.reduce((acc: number, cur: any) =>
            acc + (cur.jumlah * cur.obat.harga), 0);

        const tindakanCost = visit.rekamMedis.tindakan.reduce((acc: number, cur: any) =>
            acc + cur.biaya, 0);

        return obatCost + tindakanCost;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Laporan & Arsip</h1>
                    <p className="text-slate-500">Rekapitulasi kunjungan dan pendapatan</p>
                </div>
                <ExportButton data={visits} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">No. RM</th>
                                <th className="px-6 py-3">Pasien</th>
                                <th className="px-6 py-3">Dokter / Poli</th>
                                <th className="px-6 py-3">Diagnosa</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Total Biaya</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visits.map(visit => {
                                const total = calculateTotal(visit);
                                return (
                                    <tr key={visit.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {new Date(visit.tgl_kunjungan).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs">{new Date(visit.tgl_kunjungan).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{visit.pasien.no_rm}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{visit.pasien.nama}</td>
                                        <td className="px-6 py-4">
                                            <div>{visit.dokter.nama}</div>
                                            <div className="text-xs text-slate-500">{visit.dokter.poliklinik.nama_poli}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                                            {visit.rekamMedis?.diagnosa || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${visit.status === 'SELESAI' ? 'bg-green-100 text-green-700' :
                                                    visit.status === 'DIPERIKSA' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }
                                     `}>
                                                {visit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium">
                                            {total > 0 ? `Rp ${total.toLocaleString()}` : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {visit.rekamMedis && (
                                                <Link
                                                    href={`/print/rekam-medis/${visit.rekamMedis.id}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition text-xs font-semibold"
                                                >
                                                    <Printer size={14} /> Cetak
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

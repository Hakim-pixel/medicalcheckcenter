import { PlayCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { fetchFromLaravel } from "@/lib/api"

// Fetch queues from Laravel API and filter
async function getQueues() {
    const res = await fetchFromLaravel("/kunjungan")
    const list = Array.isArray(res) ? res : []
    // Keep only ANTRIAN or DIPERIKSA
    const filtered = list.filter((k: any) => k.status === 'ANTRIAN' || k.status === 'DIPERIKSA')
    // Ensure nested pasien and dokter exist (depending on API shape)
    return filtered.sort((a: any, b: any) => new Date(a.tgl_kunjungan).getTime() - new Date(b.tgl_kunjungan).getTime())
}

export default async function PemeriksaanPage() {
    const queues = await getQueues()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pemeriksaan Dokter</h1>
                    <p className="text-slate-500">Daftar pasien yang menunggu pemeriksaan</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queues.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Tidak ada antrian pasien saat ini.</p>
                    </div>
                ) : (
                    queues.map((q: any) => (
                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                    {q.pasien.no_rm}
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                   ${q.status === 'ANTRIAN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {q.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900">{q.pasien.nama}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock size={14} />
                                    {new Date(q.tgl_kunjungan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <div className="space-y-2 mb-6 flex-1">
                                <div className="text-sm">
                                    <span className="text-slate-400 block text-xs uppercase tracking-wider">Keluhan</span>
                                    <p className="text-slate-700 line-clamp-2">{q.keluhan_awal}</p>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-400 block text-xs uppercase tracking-wider">Dokter</span>
                                    <p className="text-slate-700">{q.dokter.nama}</p>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/pemeriksaan/${q.id}`}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <PlayCircle size={18} />
                                Mulai Periksa
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

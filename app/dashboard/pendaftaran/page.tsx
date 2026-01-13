import { Plus, Search, Calendar, User, UserPlus } from "lucide-react"
import { redirect } from "next/navigation"
import { fetchFromLaravel } from "@/lib/api"
import { revalidatePath } from "next/cache"

async function getTodayVisits() {
    const today = new Date().toISOString().split('T')[0]
    const res = await fetchFromLaravel(`/kunjungan?date=${today}`)
    return Array.isArray(res) ? res : []
}

async function getDoctors() {
    const res = await fetchFromLaravel("/dokter")
    return Array.isArray(res) ? res : []
}

async function getPatients() {
    // Note: The API currently returns all patients, we might want to implement pagination or search later
    const res = await fetchFromLaravel("/pasien")
    return Array.isArray(res) ? res : []
}

export default async function PendaftaranPage() {
    const visits = await getTodayVisits()
    const doctors = await getDoctors()
    const patients = await getPatients()

    async function createVisit(formData: FormData) {
        "use server"

        const pasienId = formData.get("pasienId") as string
        const dokterId = formData.get("dokterId") as string
        const keluhan = formData.get("keluhan") as string

        if (!pasienId || !dokterId) return

        await fetchFromLaravel("/kunjungan", "POST", {
            pasienId,
            dokterId,
            keluhan_awal: keluhan
        })

        revalidatePath("/dashboard/pendaftaran")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pendaftaran & Kunjungan</h1>
                    <p className="text-slate-500">Kelola antrian dan pendaftaran pasien hari ini</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registration Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-blue-600" />
                            Kunjungan Baru
                        </h2>

                        <form action={createVisit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Pasien</label>
                                <select name="pasienId" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Cari Pasien --</option>
                                    {patients.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.no_rm} - {p.nama}</option>
                                    ))}
                                </select>
                                <div className="mt-1 text-right">
                                    <a href="/dashboard/pasien" className="text-xs text-blue-600 hover:underline">+ Pasien Baru</a>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Dokter/Poli</label>
                                <select name="dokterId" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Pilih Dokter --</option>
                                    {doctors.map((d: any) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nama} {d.poliklinik ? `(${d.poliklinik.nama_poli})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Keluhan Awal</label>
                                <textarea name="keluhan" rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Demam, batuk pilek..."></textarea>
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Daftarkan ke Antrian
                            </button>
                        </form>
                    </div>
                </div>

                {/* Visit List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600" />
                                Antrian Hari Ini
                            </h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{visits.length} Pasien</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3">No. RM / Nama</th>
                                        <th className="px-6 py-3">Dokter / Poli</th>
                                        <th className="px-6 py-3">Keluhan</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visits.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                                Belum ada kunjungan hari ini
                                            </td>
                                        </tr>
                                    ) : (
                                        visits.map((visit: any) => (
                                            <tr key={visit.id} className="bg-white hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{visit.pasien ? visit.pasien.nama : 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">{visit.pasien ? visit.pasien.no_rm : '-'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-900">{visit.dokter ? visit.dokter.nama : 'Unknown'}</div>
                                                    {visit.dokter && visit.dokter.poliklinik && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                                                            {visit.dokter.poliklinik.nama_poli}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {visit.keluhan_awal || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                            ${visit.status === 'ANTRIAN' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            visit.status === 'DIPERIKSA' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-green-50 text-green-700 border-green-200'}`}>
                                                        {visit.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

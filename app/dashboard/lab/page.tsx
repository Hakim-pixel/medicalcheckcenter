import { FlaskConical, Save } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function saveLab(formData: FormData) {
    "use server";
    const rekamMedisId = formData.get("rekamMedisId") as string;
    const hasil_lab = formData.get("hasil_lab") as string;
    const keterangan = formData.get("keterangan") as string;

    if (!rekamMedisId || !hasil_lab) return;

    // Post lab result to Laravel API which should create the lab record
    await fetchFromLaravel('/laboratorium', 'POST', {
        rekamMedisId,
        hasil_lab,
        keterangan
    });

    revalidatePath("/dashboard/lab");
}

export default async function LabPage() {
    // Find visits that have a medical record (examined by doctor)
    // but potentially don't have lab results yet? Or show all.
    // We'll show visits from today/recent that have rekamMedis.

    const all = await fetchFromLaravel('/kunjungan')
    const list = Array.isArray(all) ? all : []
    const visits = list
        .filter((v: any) => (v.status === 'DIPERIKSA' || v.status === 'SELESAI') && v.rekamMedis)
        .map((v: any) => v)
        .sort((a: any, b: any) => new Date(b.tgl_kunjungan).getTime() - new Date(a.tgl_kunjungan).getTime())
        .slice(0, 20)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Laboratorium</h1>
                    <p className="text-slate-500">Input hasil pemeriksaan laboratorium pasien</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Waktu</th>
                                <th className="px-6 py-3">Pasien</th>
                                <th className="px-6 py-3">Dokter</th>
                                <th className="px-6 py-3">Status Lab</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visits.map((visit: any) => {
                                const hasLab = visit.rekamMedis?.laboratorium && visit.rekamMedis.laboratorium.length > 0;
                                return (
                                    <tr key={visit.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(visit.tgl_kunjungan).toLocaleDateString()}
                                            <div className="text-xs">{new Date(visit.tgl_kunjungan).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {visit.pasien.nama}
                                            <div className="text-xs text-slate-500 font-mono">{visit.pasien.no_rm}</div>
                                        </td>
                                        <td className="px-6 py-4">{visit.dokter.nama}</td>
                                        <td className="px-6 py-4">
                                            {hasLab ? (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Terisi</span>
                                            ) : (
                                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold">Belum Ada</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!hasLab && visit.rekamMedis && (
                                                <details className="group relative">
                                                    <summary className="list-none cursor-pointer text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                                                        <FlaskConical size={16} /> Input Hasil
                                                    </summary>
                                                    <div className="absolute right-0 top-6 w-80 bg-white p-4 rounded-xl shadow-xl border border-slate-200 z-10">
                                                        <form action={saveLab} className="space-y-3">
                                                            <input type="hidden" name="rekamMedisId" value={visit.rekamMedis.id} />
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-700 block mb-1">Hasil Lab</label>
                                                                <textarea name="hasil_lab" rows={3} className="w-full text-sm border border-slate-300 rounded p-2" placeholder="Contoh: Hb 12, Leukosit 8000..." required></textarea>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-700 block mb-1">Keterangan</label>
                                                                <input name="keterangan" className="w-full text-sm border border-slate-300 rounded p-2" placeholder="Catatan tambahan..." />
                                                            </div>
                                                            <button className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                                                                <Save size={14} /> Simpan Hasil
                                                            </button>
                                                        </form>
                                                    </div>
                                                </details>
                                            )}
                                            {hasLab && (
                                                <div className="text-xs text-slate-600 max-w-xs truncate">
                                                    {visit.rekamMedis?.laboratorium[0].hasil_lab}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {visits.length === 0 && <div className="p-8 text-center text-slate-400">Belum ada data pemeriksaan dokter untuk diinput lab.</div>}
            </div>
        </div>
    );
}

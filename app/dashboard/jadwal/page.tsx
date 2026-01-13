import { Calendar, Trash2, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createJadwal(formData: FormData) {
    "use server";

    const dokterId = formData.get("dokterId") as string;
    const hari = formData.get("hari") as string;
    const jam_mulai = formData.get("jam_mulai") as string;
    const jam_selesai = formData.get("jam_selesai") as string;

    if (!dokterId) return;

        await fetchFromLaravel('/jadwal', 'POST', {
            dokterId,
            hari,
            jam_mulai,
            jam_selesai
        });

    revalidatePath("/dashboard/jadwal");
}

async function deleteJadwal(id: string) {
    "use server";
        await fetchFromLaravel(`/jadwal/${id}`, 'DELETE');
    revalidatePath("/dashboard/jadwal");
}

export default async function JadwalPage() {
    const schedulesRes = await fetchFromLaravel('/jadwal');
    const schedules = Array.isArray(schedulesRes) ? schedulesRes : [];

    const doktersRes = await fetchFromLaravel('/dokter');
    const dokters = Array.isArray(doktersRes) ? doktersRes : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Jadwal Praktik Dokter</h1>
                    <p className="text-slate-500">Atur jadwal ketersediaan dokter</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600" />
                            Tambah Jadwal
                        </h2>

                        <form action={createJadwal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Dokter</label>
                                <select name="dokterId" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required>
                                    <option value="">-- Dokter --</option>
                                    {dokters.map(d => (
                                        <option key={d.id} value={d.id}>{d.nama} ({d.poliklinik?.nama_poli ?? '-'})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
                                <select name="hari" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required>
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                    <option value="Sabtu">Sabtu</option>
                                    <option value="Minggu">Minggu</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mulai</label>
                                    <input name="jam_mulai" type="time" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Selesai</label>
                                    <input name="jam_selesai" type="time" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Simpan Jadwal
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {schedules.map((s: any) => (
                        <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 text-center">
                                    <div className="font-bold text-slate-900 bg-slate-100 rounded-lg py-1">{s.hari}</div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{s.dokter?.nama ?? '-'}</h3>
                                    <div className="text-xs text-slate-500">{s.dokter?.poliklinik?.nama_poli ?? '-'}</div>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    <Clock size={14} />
                                    {s.jam_mulai} - {s.jam_selesai}
                                </div>
                            </div>
                            <form action={deleteJadwal.bind(null, s.id)}>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    ))}
                    {schedules.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            Belum ada jadwal tersimpan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

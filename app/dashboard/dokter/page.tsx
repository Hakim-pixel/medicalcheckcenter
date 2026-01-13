import { UserPlus, Stethoscope, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createDokter(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const spesialisasi = formData.get("spesialisasi") as string;
    const no_telp = formData.get("no_telp") as string;
    const poliklinikId = formData.get("poliklinikId") as string;
    const userId = formData.get("userId") as string || null;

    await fetchFromLaravel("/dokter", "POST", {
        nama,
        spesialisasi,
        no_telp,
        poliklinikId,
        userId: userId === "none" ? null : userId
    });

    revalidatePath("/dashboard/dokter");
}

async function deleteDokter(id: string) {
    "use server";
    try {
        await fetchFromLaravel(`/dokter/${id}`, "DELETE");
        revalidatePath("/dashboard/dokter");
    } catch (e) {
        console.error(e);
    }
}

export default async function DokterPage() {
    const dokters = await fetchFromLaravel("/dokter") || [];
    const polis = await fetchFromLaravel("/poli") || [];
    const allUsers = await fetchFromLaravel("/users") || [];

    // Filter users related loop
    const linkedUserIds = Array.isArray(dokters) ? dokters.map((d: any) => d.userId).filter(Boolean) : [];

    // Filter users locally since API returns all
    const availableUsers = Array.isArray(allUsers) ? allUsers.filter((u: any) =>
        u.role === "DOKTER" && !linkedUserIds.includes(u.id)
    ) : [];

    const dokterList = Array.isArray(dokters) ? dokters : [];
    const poliList = Array.isArray(polis) ? polis : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Dokter</h1>
                    <p className="text-slate-500">Kelola data dokter dan penugasan poliklinik</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-blue-600" />
                            Tambah Dokter
                        </h2>

                        <form action={createDokter} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Dokter</label>
                                <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="dr. Budi Santoso" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Spesialisasi</label>
                                <input name="spesialisasi" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Umum / Anak / Gigi" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Poliklinik</label>
                                <select name="poliklinikId" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required>
                                    <option value="">-- Pilih Poli --</option>
                                    {poliList.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.nama_poli}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Link User Login (Opsional)</label>
                                <select name="userId" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                    <option value="none">-- Tidak ada / Manual --</option>
                                    {availableUsers.map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.username} - {u.nama}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-400 mt-1">Hanya menampilkan user role 'DOKTER' yang belum terdaftar.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                                <input name="no_telp" type="tel" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Simpan Data
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4">
                        {dokterList.map((dokter: any) => (
                            <div key={dokter.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{dokter.nama}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">{dokter.spesialisasi}</span>
                                            <span>•</span>
                                            <span className="text-blue-600 font-medium">{dokter.poliklinik?.nama_poli || 'No Poli'}</span>
                                        </div>
                                        {dokter.user && (
                                            <div className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 inline-block px-2 rounded">
                                                Linked Account: @{dokter.user.username}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <form action={deleteDokter.bind(null, dokter.id)}>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {dokterList.length === 0 && (
                            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                Belum ada data dokter.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

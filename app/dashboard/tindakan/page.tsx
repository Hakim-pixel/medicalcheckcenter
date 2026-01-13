// Force revalidation
import { Syringe, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createTindakan(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const tarif = parseFloat(formData.get("tarif") as string);

    await fetchFromLaravel("/tindakan", "POST", {
        nama_tindakan: nama,
        tarif
    });

    revalidatePath("/dashboard/tindakan");
}

async function deleteTindakan(id: string) {
    "use server";
    await fetchFromLaravel(`/tindakan/${id}`, "DELETE");
    revalidatePath("/dashboard/tindakan");
}

export default async function TindakanPage() {
    const response = await fetchFromLaravel("/tindakan");
    const tindakans = Array.isArray(response) ? response : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Tindakan Medis</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="font-semibold text-lg mb-4">Tambah Tindakan</h2>
                    <form action={createTindakan} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Tindakan</label>
                            <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tarif (Rp)</label>
                            <input name="tarif" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" required />
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Simpan</button>
                    </form>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Nama Tindakan</th>
                                    <th className="px-6 py-3">Tarif</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tindakans.map((t: any) => (
                                    <tr key={t.id}>
                                        <td className="px-6 py-3 font-medium">{t.nama_tindakan}</td>
                                        <td className="px-6 py-3">Rp {t.tarif.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            <form action={deleteTindakan.bind(null, t.id)}>
                                                <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {tindakans.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                            Belum ada tindakan medis
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

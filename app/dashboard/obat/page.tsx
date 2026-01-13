import { Pill, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createObat(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const jenis = formData.get("jenis") as string;
    const stok = parseInt(formData.get("stok") as string);
    const harga = parseFloat(formData.get("harga") as string);

    await fetchFromLaravel("/obat", "POST", {
        nama_obat: nama,
        jenis,
        stok,
        harga
    });

    revalidatePath("/dashboard/obat");
}

async function deleteObat(id: string) {
    "use server";
    await fetchFromLaravel(`/obat/${id}`, "DELETE");
    revalidatePath("/dashboard/obat");
}

export default async function ObatPage() {
    const obats = await fetchFromLaravel("/obat") || [];
    const obatList = Array.isArray(obats) ? obats : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Obat</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="font-semibold text-lg mb-4">Tambah Obat</h2>
                    <form action={createObat} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Obat</label>
                            <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
                            <input name="jenis" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Tablet/Syrup" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Stok</label>
                                <input name="stok" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Harga</label>
                                <input name="harga" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" required />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Simpan</button>
                    </form>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Nama Obat</th>
                                    <th className="px-6 py-3">Jenis</th>
                                    <th className="px-6 py-3">Stok</th>
                                    <th className="px-6 py-3">Harga</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {obatList.map((o: any) => (
                                    <tr key={o.id}>
                                        <td className="px-6 py-3 font-medium">{o.nama_obat}</td>
                                        <td className="px-6 py-3">{o.jenis}</td>
                                        <td className="px-6 py-3">{o.stok}</td>
                                        <td className="px-6 py-3">Rp {o.harga.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            <form action={deleteObat.bind(null, o.id)}>
                                                <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {obatList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            Belum ada data obat
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

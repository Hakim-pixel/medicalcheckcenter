import { Building, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createPoli(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const lokasi = formData.get("lokasi") as string;

    if (!nama) return;

    await fetchFromLaravel("/poli", "POST", {
        nama_poli: nama,
        lokasi
    });

    revalidatePath("/dashboard/poli");
}

async function deletePoli(id: string) {
    "use server";
    await fetchFromLaravel(`/poli/${id}`, "DELETE");
    revalidatePath("/dashboard/poli");
}

export default async function PoliPage() {
    const response = await fetchFromLaravel("/poli");
    const polis = Array.isArray(response) ? response : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Poliklinik</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="font-semibold text-lg mb-4">Tambah Poliklinik</h2>
                    <form action={createPoli} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Poli</label>
                            <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Poli Umum" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                            <input name="lokasi" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Lantai 1" />
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Simpan</button>
                    </form>
                </div>

                <div className="md:col-span-2 grid gap-4">
                    {polis.map((poli: any) => (
                        <div key={poli.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <Building size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{poli.nama_poli}</h3>
                                    <p className="text-sm text-slate-500">{poli.lokasi || "Lokasi belum set"}</p>
                                </div>
                            </div>
                            <form action={deletePoli.bind(null, poli.id)}>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    ))}
                    {polis.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            Belum ada data poliklinik
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

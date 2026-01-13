import { User, Search, UserPlus } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

async function createPasien(formData: FormData) {
    "use server";

    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    const tgl_lahir = formData.get("tgl_lahir") as string;
    const jk = formData.get("jenis_kelamin") as string;
    const alamat = formData.get("alamat") as string;

    const res = await fetchFromLaravel("/pasien", "POST", {
        nik,
        nama,
        tgl_lahir,
        jenis_kelamin: jk,
        alamat
    });

    if (res) {
        revalidatePath("/dashboard/pasien");
    }
}

export default async function PasienPage({ searchParams }: { searchParams: { q: string } }) {
    // Await searchParams for Next.js 15+ compatibility
    const params = await searchParams; // Wait for promise if it is one, or just value
    const q = params?.q || '';

    // Fetch patients from Laravel
    // Assuming Laravel endpoint accepts ?q=... search param if implemented, or we filter client side
    // For now, let's just fetch all or whatever the index returns. 
    // If we passed ?search=q to laravel it would be better.
    // Let's assume Laravel endpoint assumes standard index for now.
    const pasiens = await fetchFromLaravel(`/pasien?search=${q}`) || [];

    // Ensure pasiens is an array (Laravel might return wrapped in 'data' properties if paginated)
    // If it returns { data: [...] }, we need to handle that.
    const pasienList = Array.isArray(pasiens) ? pasiens : (pasiens.data || []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Pasien</h1>
                    <p className="text-slate-500">Database pasien terdaftar</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Pasien Baru */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-blue-600" />
                            Registrasi Pasien Baru
                        </h2>
                        <form action={createPasien} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                                <input name="nik" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                                <input name="tgl_lahir" type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                                <select name="jenis_kelamin" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                    <option value="LAKI_LAKI">Laki-laki</option>
                                    <option value="PEREMPUAN">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                                <textarea name="alamat" rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required></textarea>
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Simpan Data Pasien</button>
                        </form>
                    </div>
                </div>

                {/* List Pasien */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100">
                            <form className="relative">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input
                                    name="q"
                                    defaultValue={q}
                                    type="text"
                                    placeholder="Cari nama, NIK, atau No. RM..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </form>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">No. RM</th>
                                        <th className="px-6 py-3">Pasien</th>
                                        <th className="px-6 py-3">Lahir / Usia</th>
                                        <th className="px-6 py-3">Alamat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pasienList.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-mono font-bold text-blue-600">{p.no_rm}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{p.nama}</div>
                                                <div className="text-xs text-slate-500">NIK: {p.nik}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{new Date(p.tgl_lahir).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-slate-500">
                                                {p.alamat}
                                            </td>
                                        </tr>
                                    ))}
                                    {pasienList.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                {q ? 'Data tidak ditemukan' : 'Belum ada data pasien'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

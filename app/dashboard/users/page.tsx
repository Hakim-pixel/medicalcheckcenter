// Force revalidation
import { UserPlus, Trash2, Pencil } from "lucide-react";
import { revalidatePath } from "next/cache";
import { fetchFromLaravel } from "@/lib/api";

// --- Server Actions ---

async function createUser(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!nama || !username || !password || !role) return;

    await fetchFromLaravel("/users", "POST", {
        nama,
        username,
        password,
        role
    });

    revalidatePath("/dashboard/users");
}

async function deleteUser(id: string) {
    "use server";
    await fetchFromLaravel(`/users/${id}`, "DELETE");
    revalidatePath("/dashboard/users");
}

// --- Page Component ---

export default async function UsersPage() {
    const users = await fetchFromLaravel("/users") || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen User (Admin)</h1>
                    <p className="text-slate-500">Kelola pengguna dan hak akses sistem</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create User Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-blue-600" />
                            Tambah User Baru
                        </h2>

                        <form action={createUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input name="nama" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="John Doe" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <input name="username" type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="johndoe" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input name="password" type="password" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="******" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select name="role" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="DOKTER">DOKTER</option>
                                    <option value="PETUGAS_RM">PETUGAS_RM</option>
                                    <option value="MANAJER">MANAJER</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Simpan User
                            </button>
                        </form>
                    </div>
                </div>

                {/* User List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Dibuat</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Array.isArray(users) && users.map((user: any) => (
                                        <tr key={user.id} className="bg-white hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{user.nama}</div>
                                                <div className="text-xs text-slate-500">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold
                          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'DOKTER' ? 'bg-blue-100 text-blue-700' :
                                                            user.role === 'MANAJER' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-green-100 text-green-700'
                                                    }
                        `}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(user.created_at || user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={deleteUser.bind(null, user.id)}>
                                                    <button className="text-red-600 hover:text-red-800 text-xs font-bold">
                                                        Hapus
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!Array.isArray(users) || users.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                Tidak ada user
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

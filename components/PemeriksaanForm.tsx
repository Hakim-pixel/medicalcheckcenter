"use client";

import { useState } from "react";
import { Plus, Trash2, Save, ShoppingBag, Syringe } from "lucide-react";
import { useRouter } from "next/navigation";

// Define types for props
type Props = {
    kunjunganId: string;
    pasien: any;
    obats: any[];
    tindakans: any[];
    saveAction: (formData: any) => Promise<void>;
};

export default function PemeriksaanForm({ kunjunganId, pasien, obats, tindakans, saveAction }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [diagnosa, setDiagnosa] = useState("");
    const [catatan, setCatatan] = useState("");

    // Dynamic Lists
    const [resepList, setResepList] = useState<{ obatId: string; jumlah: number; aturan: string }[]>([]);
    const [tindakanList, setTindakanList] = useState<{ tindakanId: string; keterangan: string }[]>([]);

    const addResep = () => {
        setResepList([...resepList, { obatId: "", jumlah: 1, aturan: "3x1 Sesudah Makan" }]);
    };

    const removeResep = (index: number) => {
        const newList = [...resepList];
        newList.splice(index, 1);
        setResepList(newList);
    };

    const updateResep = (index: number, field: string, value: any) => {
        const newList: any = [...resepList];
        newList[index][field] = value;
        setResepList(newList);
    };

    const addTindakan = () => {
        setTindakanList([...tindakanList, { tindakanId: "", keterangan: "" }]);
    };

    const removeTindakan = (index: number) => {
        const newList = [...tindakanList];
        newList.splice(index, 1);
        setTindakanList(newList);
    };

    const updateTindakan = (index: number, field: string, value: any) => {
        const newList: any = [...tindakanList];
        newList[index][field] = value;
        setTindakanList(newList);
    };

    const handleSubmit = async () => {
        if (!diagnosa) {
            alert("Diagnosa harus diisi!");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                kunjunganId,
                diagnosa,
                catatan,
                resep: resepList.filter(r => r.obatId),
                tindakan: tindakanList.filter(t => t.tindakanId)
            };

            await saveAction(payload);
            router.push("/dashboard/pemeriksaan");
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan pemeriksaan.");
        } finally {
            setLoading(false);
        }
    };

    // Format date without relying on runtime locale to avoid server/client hydration mismatch.
    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";

        // If ISO-like date (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS), split and format as DD/MM/YYYY
        const iso = dateStr.split("T")[0];
        const parts = iso.split("-");
        if (parts.length >= 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }

        // Fallback: try creating a Date and return YYYY-MM-DD to be deterministic
        try {
            const d = new Date(dateStr);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const da = String(d.getDate()).padStart(2, "0");
            return `${da}/${m}/${y}`;
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Patient Info & Main Assessment */}
            <div className="lg:col-span-2 space-y-8">
                {/* Patient Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{pasien.nama}</h2>
                            <div className="text-blue-100 font-mono mt-1">{pasien.no_rm}</div>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <span className="text-sm font-semibold opacity-90 block">Tgl Lahir</span>
                            <div className="font-bold">{formatDate(pasien.tgl_lahir)}</div>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-blue-100">
                        <div className="bg-white/10 p-3 rounded-lg">
                            <span className="block opacity-70 text-xs uppercase mb-1">Jenis Kelamin</span>
                            {pasien.jenis_kelamin}
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                            <span className="block opacity-70 text-xs uppercase mb-1">Alamat</span>
                            <span className="truncate block">{pasien.alamat}</span>
                        </div>
                    </div>
                </div>

                {/* Assessment Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Save size={20} className="text-blue-600" />
                        Pemeriksaan Medis (SOAP)
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Subjective / Anamnesa</label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={4}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
                                placeholder="Keluhan pasien, riwayat penyakit..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnosa Utama (Assessment)</label>
                            <input
                                value={diagnosa}
                                onChange={(e) => setDiagnosa(e.target.value)}
                                type="text"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium"
                                placeholder="Contoh: Hipertensi, ISPA..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Actions (Resep & Tindakan) */}
            <div className="space-y-6">
                {/* Resep */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-emerald-600" />
                            Resep Obat
                        </h3>
                        <button onClick={addResep} className="p-1 hover:bg-slate-100 rounded-full text-blue-600">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {resepList.map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group">
                                <button onClick={() => removeResep(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>

                                <div className="space-y-2 pr-6">
                                    <select
                                        className="w-full p-2 bg-white border border-slate-200 rounded text-sm"
                                        value={item.obatId}
                                        onChange={(e) => updateResep(idx, 'obatId', e.target.value)}
                                    >
                                        <option value="">-- Pilih Obat --</option>
                                        {obats.map(o => (
                                            <option key={o.id} value={o.id}>{o.nama_obat} (Stok: {o.stok})</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            className="w-20 p-2 bg-white border border-slate-200 rounded text-sm"
                                            placeholder="Jml"
                                            value={item.jumlah}
                                            onChange={(e) => updateResep(idx, 'jumlah', parseInt(e.target.value))}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 p-2 bg-white border border-slate-200 rounded text-sm"
                                            placeholder="Aturan Pakai"
                                            value={item.aturan}
                                            onChange={(e) => updateResep(idx, 'aturan', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {resepList.length === 0 && <div className="text-sm text-slate-400 text-center py-4 italic">Belum ada resep</div>}
                    </div>
                </div>

                {/* Tindakan */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Syringe size={18} className="text-purple-600" />
                            Tindakan
                        </h3>
                        <button onClick={addTindakan} className="p-1 hover:bg-slate-100 rounded-full text-blue-600">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {tindakanList.map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group">
                                <button onClick={() => removeTindakan(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>

                                <div className="space-y-2 pr-6">
                                    <select
                                        className="w-full p-2 bg-white border border-slate-200 rounded text-sm"
                                        value={item.tindakanId}
                                        onChange={(e) => updateTindakan(idx, 'tindakanId', e.target.value)}
                                    >
                                        <option value="">-- Pilih Tindakan --</option>
                                        {tindakans.map(t => (
                                            <option key={t.id} value={t.id}>{t.nama_tindakan} - {t.tarif}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-white border border-slate-200 rounded text-sm"
                                        placeholder="Keterangan tambahan..."
                                        value={item.keterangan}
                                        onChange={(e) => updateTindakan(idx, 'keterangan', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                        {tindakanList.length === 0 && <div className="text-sm text-slate-400 text-center py-4 italic">Belum ada tindakan</div>}
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2"
                >
                    {loading ? "Menyimpan..." : "Simpan & Selesai"}
                </button>
            </div>
        </div>
    );
}

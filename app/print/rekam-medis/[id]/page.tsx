import { notFound } from "next/navigation";
import { fetchFromLaravel } from "@/lib/api";

export default async function PrintRekamMedisPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // id is rekamMedisId or kunjunganId? Let's assume KunjunganId for easier access or RekamMedisId.
    // The link will likely pass RekamMedis ID.

    const rm = await fetchFromLaravel(`/rekam-medis/${params.id}`)
    if (!rm) return notFound();

    const { kunjungan, resep, tindakan, laboratorium } = rm;
    const { pasien, dokter } = kunjungan || {};

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white text-slate-900 print:p-0">
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase">Klinik Sehat Sejahtera</h1>
                <p className="text-sm">Jl. Kesehatan No. 123, Kota Sehat</p>
                <p className="text-sm">Telp: (021) 555-1234 | Email: info@kliniksehat.com</p>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Rekam Medis Pasien</h2>
                    <table className="text-sm">
                        <tbody>
                            <tr><td className="w-24 font-semibold">Tgl. Periksa</td><td>: {new Date(rm.tgl_periksa).toLocaleDateString()}</td></tr>
                            <tr><td className="font-semibold">No. RM</td><td>: {pasien.no_rm}</td></tr>
                            <tr><td className="font-semibold">Nama Pasien</td><td>: {pasien.nama}</td></tr>
                            <tr><td className="font-semibold">Tgl. Lahir</td><td>: {new Date(pasien.tgl_lahir).toLocaleDateString()}</td></tr>
                            <tr><td className="font-semibold">Alamat</td><td>: {pasien.alamat}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">{dokter.nama}</div>
                    <div className="text-sm text-slate-600">{dokter.poliklinik.nama_poli}</div>
                    <div className="text-xs text-slate-500 mt-1">SIP: {dokter.sip || "-"}</div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Diagnosa */}
                <section>
                    <h3 className="font-bold border-b border-slate-300 mb-2 uppercase text-sm">Hasil Pemeriksaan</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                            <span className="font-semibold">Keluhan:</span> {kunjungan.keluhan_awal}
                        </div>
                        <div>
                            <span className="font-semibold">Diagnosa:</span>
                            <p className="whitespace-pre-wrap mt-1 pl-4 border-l-2 border-slate-200">{rm.diagnosa}</p>
                        </div>
                        {rm.catatan && (
                            <div>
                                <span className="font-semibold">Catatan Dokter:</span>
                                <p className="whitespace-pre-wrap mt-1 pl-4 border-l-2 border-slate-200">{rm.catatan}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Resep */}
                {resep.length > 0 && (
                    <section>
                        <h3 className="font-bold border-b border-slate-300 mb-2 uppercase text-sm">Resep Obat</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {resep.map((r: any) => (
                                <li key={r.id}>
                                    <span className="font-medium">{r.obat.nama_obat}</span> ({r.jumlah}) - <span className="italic text-slate-600">{r.aturan_pakai}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Tindakan */}
                {tindakan.length > 0 && (
                    <section>
                        <h3 className="font-bold border-b border-slate-300 mb-2 uppercase text-sm">Tindakan Medis</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {tindakan.map((t: any) => (
                                <li key={t.id}>
                                    {t.tindakan.nama_tindakan} {t.keterangan ? `(${t.keterangan})` : ''}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Laboratorium */}
                {laboratorium.length > 0 && (
                    <section>
                        <h3 className="font-bold border-b border-slate-300 mb-2 uppercase text-sm">Hasil Laboratorium</h3>
                        {laboratorium.map((lab: any) => (
                            <div key={lab.id} className="text-sm bg-slate-50 p-2 rounded print:bg-transparent print:p-0">
                                <div className="font-mono whitespace-pre-wrap">{lab.hasil_lab}</div>
                                {lab.keterangan && <div className="text-xs text-slate-500 mt-1">Ket: {lab.keterangan}</div>}
                            </div>
                        ))}
                    </section>
                )}
            </div>

            <div className="mt-12 flex justify-end print:mt-16">
                <div className="text-center w-48">
                    <p className="text-sm mb-16">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="font-bold border-b border-slate-900 pb-1">{dokter.nama}</p>
                    <p className="text-xs text-slate-500">Dokter Pemeriksa</p>
                </div>
            </div>

            <script
                dangerouslySetInnerHTML={{
                    __html: `window.print();`,
                }}
            />
        </div>
    );
}

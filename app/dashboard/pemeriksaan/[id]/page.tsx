import { notFound, redirect } from "next/navigation";
import PemeriksaanForm from "@/components/PemeriksaanForm";
import { fetchFromLaravel } from "@/lib/api";

type Params = {
    params: Promise<{ id: string }>;
}

export default async function PemeriksaanDetailPage(props: Params) {
    const params = await props.params;
    const { id } = params;

    const kunjungan = await (async () => {
        const res = await fetchFromLaravel(`/kunjungan/${id}`)
        return res || null
    })();

    if (!kunjungan) return notFound();

    const obats = await (async () => {
        const r = await fetchFromLaravel('/obat')
        return Array.isArray(r) ? r.filter((o: any) => (o.stok ?? 0) > 0) : []
    })();

    const tindakans = await (async () => {
        const r = await fetchFromLaravel('/tindakan')
        return Array.isArray(r) ? r : []
    })();

    // Server Action
    async function savePemeriksaan(data: any) {
        "use server";

        // Send full payload to Laravel which should handle creating rekam medis, resep, tindakan, and updating kunjungan
        await fetchFromLaravel('/rekam-medis', 'POST', {
            kunjunganId: id,
            diagnosa: data.diagnosa,
            catatan: data.catatan,
            resep: data.resep || [],
            tindakan: data.tindakan || []
        });

        // Redirect handled in client
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Pemeriksaan Medis</h1>
            <PemeriksaanForm
                kunjunganId={id}
                pasien={kunjungan.pasien}
                obats={obats}
                tindakans={tindakans}
                saveAction={savePemeriksaan}
            />
        </div>
    );
}

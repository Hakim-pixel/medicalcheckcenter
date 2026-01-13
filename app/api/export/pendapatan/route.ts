import { fetchFromLaravel } from "@/lib/api";

function toCSV(rows: Record<string, any>[]) {
    if (!rows || rows.length === 0) return "";
    const keys = Object.keys(rows[0]);
    const escape = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        if (s.includes('"') || s.includes(',') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    };
    const header = keys.join(",");
    const lines = rows.map(r => keys.map(k => escape(r[k])).join(","));
    return [header, ...lines].join("\n");
}

export async function GET() {
    try {
        const proceduresRes = await fetchFromLaravel('/tindakan');
        const procedures = Array.isArray(proceduresRes) ? proceduresRes : [];

        const tpRes = await fetchFromLaravel('/tindakan-pasien');
        const tp = Array.isArray(tpRes) ? tpRes : [];

        const report = procedures.map((proc: any) => {
            const tindakanPasien = tp.filter((t: any) => t.tindakanId === proc.id);
            const frequency = tindakanPasien.length;
            const revenue = tindakanPasien.reduce((acc: number, cur: any) => acc + (cur.biaya || 0), 0);
            return {
                id: proc.id,
                nama_tindakan: proc.nama_tindakan || proc.nama || '',
                tarif: proc.tarif || proc.tarif || 0,
                frequency,
                revenue
            };
        }).sort((a: any, b: any) => b.revenue - a.revenue);

        const csv = toCSV(report);
        return new Response(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="pendapatan.csv"'
            }
        });
    } catch (e: any) {
        return new Response('Error generating CSV: ' + (e?.message || e), { status: 500 });
    }
}

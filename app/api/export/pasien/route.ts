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
        const pasienRes = await fetchFromLaravel('/pasien');
        const pasien = Array.isArray(pasienRes) ? pasienRes : [];

        // pick common fields and flatten nested objects if present
        const rows = pasien.map((p: any) => ({
            id: p.id,
            no_rm: p.no_rm,
            nama: p.nama,
            nik: p.nik || '',
            tgl_lahir: p.tgl_lahir || '',
            jenis_kelamin: p.jenis_kelamin || '',
            alamat: p.alamat || '',
            created_at: p.created_at || ''
        }));

        const csv = toCSV(rows);
        return new Response(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="pasien.csv"'
            }
        });
    } catch (e: any) {
        return new Response('Error generating CSV: ' + (e?.message || e), { status: 500 });
    }
}

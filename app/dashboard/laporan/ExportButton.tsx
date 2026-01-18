"use client";

import { Download } from "lucide-react";

interface ExportButtonProps {
    data: any[];
    className?: string;
    children?: React.ReactNode;
}

export default function ExportButton({ data, className, children }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert("Tidak ada data untuk diexport");
            return;
        }

        // Helper to escape CSV fields
        const escapeCsv = (str: any) => {
            if (str === null || str === undefined) return "";
            const stringValue = String(str);
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Define headers
        const headers = [
            "Tanggal",
            "Waktu",
            "No RM",
            "Nama Pasien",
            "Dokter",
            "Poliklinik",
            "Diagnosa",
            "Status",
            "Biaya Obat",
            "Biaya Tindakan",
            "Total Biaya"
        ];

        // Map data to rows
        const rows = data.map(visit => {
            // Calculate costs
            const obatCost = visit.rekamMedis?.resep?.reduce((acc: number, cur: any) =>
                acc + (cur.jumlah * cur.obat.harga), 0) || 0;

            const tindakanCost = visit.rekamMedis?.tindakan?.reduce((acc: number, cur: any) =>
                acc + cur.biaya, 0) || 0;

            return [
                new Date(visit.tgl_kunjungan).toLocaleDateString("id-ID"),
                new Date(visit.tgl_kunjungan).toLocaleTimeString("id-ID"),
                visit.pasien?.no_rm || "-",
                visit.pasien?.nama || "-",
                visit.dokter?.nama || "-",
                visit.dokter?.poliklinik?.nama_poli || "-",
                visit.rekamMedis?.diagnosa || "-",
                visit.status,
                obatCost,
                tindakanCost,
                obatCost + tindakanCost
            ].map(escapeCsv).join(",");
        });

        // Combine headers and rows
        const csvContent = [headers.join(","), ...rows].join("\n");

        // Create blob and download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `laporan_kunjungan_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className={className || "flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"}
        >
            {children || (
                <>
                    <Download size={16} />
                    Export CSV
                </>
            )}
        </button>
    );
}

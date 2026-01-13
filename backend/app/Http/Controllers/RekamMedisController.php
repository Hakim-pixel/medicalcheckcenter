<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RekamMedisController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'kunjunganId' => 'required|exists:kunjungans,id',
            'diagnosa' => 'required',
            'catatan' => 'nullable',
            'resep' => 'array',
            'resep.*.obatId' => 'required|exists:obats,id',
            'resep.*.jumlah' => 'required|numeric',
            'resep.*.aturan_pakai' => 'required',
            'tindakan' => 'array',
            'tindakan.*.tindakanId' => 'required|exists:tindakans,id',
        ]);

        DB::beginTransaction();
        try {
            $rekamMedisId = Str::uuid();

            // 1. Create Rekam Medis
            DB::table('rekam_medis')->insert([
                'id' => $rekamMedisId,
                'kunjunganId' => $data['kunjunganId'],
                'diagnosa' => $data['diagnosa'],
                'catatan' => $data['catatan'] ?? null,
                'tgl_periksa' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Insert Resep & Update Stok
            if (!empty($data['resep'])) {
                foreach ($data['resep'] as $item) {
                    DB::table('reseps')->insert([
                        'id' => Str::uuid(),
                        'rekamMedisId' => $rekamMedisId,
                        'obatId' => $item['obatId'],
                        'jumlah' => $item['jumlah'],
                        'aturan_pakai' => $item['aturan_pakai'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // Decrease stock
                    DB::table('obats')->where('id', $item['obatId'])->decrement('stok', $item['jumlah']);
                }
            }

            // 3. Insert Tindakan
            if (!empty($data['tindakan'])) {
                foreach ($data['tindakan'] as $item) {
                    $tarif = DB::table('tindakans')->where('id', $item['tindakanId'])->value('tarif');
                    DB::table('tindakan_pasiens')->insert([
                        'id' => Str::uuid(),
                        'rekamMedisId' => $rekamMedisId,
                        'tindakanId' => $item['tindakanId'],
                        'biaya' => $tarif,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            // 4. Update Kunjungan Status
            DB::table('kunjungans')->where('id', $data['kunjunganId'])->update(['status' => 'SELESAI', 'updated_at' => now()]);

            DB::commit();
            return response()->json(['message' => 'Rekam Medis saved', 'id' => $rekamMedisId]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // For Lab Input
    public function storeLab(Request $request)
    {
        $data = $request->validate([
            'rekamMedisId' => 'required|exists:rekam_medis,id',
            'hasil_lab' => 'required',
            'keterangan' => 'nullable'
        ]);

        DB::table('laboratoriums')->insert([
            'id' => Str::uuid(),
            'rekamMedisId' => $data['rekamMedisId'],
            'hasil_lab' => $data['hasil_lab'],
            'keterangan' => $data['keterangan'],
            'tgl_lab' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Lab result saved']);
    }

    // List all rekam medis with relations (used by reports)
    public function index()
    {
        $rms = DB::table('rekam_medis')->orderBy('tgl_periksa', 'desc')->get();
        $out = [];
        foreach ($rms as $rm) {
            $reseps = DB::table('reseps')
                ->where('reseps.rekamMedisId', $rm->id)
                ->join('obats', 'reseps.obatId', '=', 'obats.id')
                ->select('reseps.*', 'obats.nama_obat as obat_nama', 'obats.harga as obat_harga')
                ->get();

            $tindakan = DB::table('tindakan_pasiens')
                ->where('tindakan_pasiens.rekamMedisId', $rm->id)
                ->join('tindakans', 'tindakan_pasiens.tindakanId', '=', 'tindakans.id')
                ->select('tindakan_pasiens.*', 'tindakans.nama_tindakan', 'tindakans.tarif')
                ->get();

            $lab = DB::table('laboratoriums')->where('rekamMedisId', $rm->id)->get();

            $kunjungan = DB::table('kunjungans')->where('id', $rm->kunjunganId)->first();

            $out[] = array_merge((array) $rm, [
                'resep' => $reseps,
                'tindakan' => $tindakan,
                'laboratorium' => $lab,
                'kunjungan' => $kunjungan,
            ]);
        }

        return response()->json($out);
    }

    // Show a single rekam medis with relations (for print)
    public function show($id)
    {
        $rm = DB::table('rekam_medis')->where('id', $id)->first();
        if (! $rm) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $reseps = DB::table('reseps')
            ->where('reseps.rekamMedisId', $id)
            ->join('obats', 'reseps.obatId', '=', 'obats.id')
            ->select('reseps.*', 'obats.nama_obat as obat_nama', 'obats.harga as obat_harga')
            ->get();

        $tindakan = DB::table('tindakan_pasiens')
            ->where('tindakan_pasiens.rekamMedisId', $id)
            ->join('tindakans', 'tindakan_pasiens.tindakanId', '=', 'tindakans.id')
            ->select('tindakan_pasiens.*', 'tindakans.nama_tindakan', 'tindakans.tarif')
            ->get();

        $lab = DB::table('laboratoriums')->where('rekamMedisId', $id)->get();
        $kunjungan = DB::table('kunjungans')->where('id', $rm->kunjunganId)->first();

        $payload = array_merge((array) $rm, [
            'resep' => $reseps,
            'tindakan' => $tindakan,
            'laboratorium' => $lab,
            'kunjungan' => $kunjungan,
        ]);

        return response()->json($payload);
    }

    // Return all reseps (used by reporting pages)
    public function reseps()
    {
        $reseps = DB::table('reseps')
            ->join('obats', 'reseps.obatId', '=', 'obats.id')
            ->select('reseps.*', 'obats.nama_obat as obat_nama', 'obats.harga')
            ->get();

        return response()->json($reseps);
    }

    // Return tindakan_pasiens entries with tindakan meta (used by reporting)
    public function tindakanPasiens()
    {
        $tp = DB::table('tindakan_pasiens')
            ->join('tindakans', 'tindakan_pasiens.tindakanId', '=', 'tindakans.id')
            ->select('tindakan_pasiens.*', 'tindakans.nama_tindakan', 'tindakans.tarif as biaya')
            ->get();

        return response()->json($tp);
    }
}

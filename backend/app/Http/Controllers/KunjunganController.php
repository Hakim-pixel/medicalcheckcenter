<?php

namespace App\Http\Controllers;

use App\Models\Kunjungan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class KunjunganController extends Controller
{
    public function index(Request $request)
    {
        $query = Kunjungan::with([
            'pasien',
            'dokter.poliklinik',
            'rekamMedis.resep.obat',
            'rekamMedis.tindakan'
        ]);

        if ($request->has('date')) {
            $query->whereDate('tgl_kunjungan', $request->date);
        } else {
            // Default to today if desired, or all? 
            // The frontend usually asks for specific filtering.
            // Let's just return what is asked.
        }

        // If frontend specifically asks for today's visits via logic, they might pass date param.
        // The original code filtered for today.

        return response()->json($query->orderBy('tgl_kunjungan', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasienId' => 'required|exists:pasiens,id',
            'dokterId' => 'required|exists:dokters,id',
            'keluhan_awal' => 'nullable',
        ]);

        $kunjungan = new Kunjungan();
        $kunjungan->id = Str::uuid();
        $kunjungan->pasienId = $validated['pasienId'];
        $kunjungan->dokterId = $validated['dokterId'];
        $kunjungan->keluhan_awal = $validated['keluhan_awal'] ?? null;
        $kunjungan->tgl_kunjungan = now();
        $kunjungan->status = 'ANTRIAN';
        $kunjungan->save();

        return response()->json(['message' => 'Kunjungan registered', 'visit' => $kunjungan], 201);
    }

    // Show single kunjungan (with pasien, dokter and optional rekam medis + relations)
    public function show($id)
    {
        $kunjungan = Kunjungan::with(['pasien', 'dokter.poliklinik'])->where('id', $id)->first();
        if (!$kunjungan) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Try to attach rekam medis if exists
        $rm = DB::table('rekam_medis')->where('kunjunganId', $id)->first();
        if ($rm) {
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

            $payload = array_merge((array) $kunjungan->toArray(), [
                'rekamMedis' => array_merge((array) $rm, [
                    'resep' => $reseps,
                    'tindakan' => $tindakan,
                    'laboratorium' => $lab,
                ])
            ]);

            return response()->json($payload);
        }

        return response()->json($kunjungan);
    }
}

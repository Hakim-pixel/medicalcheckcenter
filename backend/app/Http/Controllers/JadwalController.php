<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalDokter;
use Illuminate\Support\Str;

class JadwalController extends Controller
{
    public function index()
    {
        // include dokter and its poliklinik so frontend can read dokter.poliklinik.nama_poli
        $jadwals = JadwalDokter::with('dokter.poliklinik')->get();
        return response()->json($jadwals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dokterId' => 'required|uuid',
            'hari' => 'required|string',
            'jam_mulai' => 'required|string',
            'jam_selesai' => 'required|string',
        ]);

        $jadwal = JadwalDokter::create(array_merge($validated, ['id' => (string) Str::uuid()]));

        // return created jadwal with related dokter and poliklinik for immediate UI use
        $jadwalWith = JadwalDokter::with('dokter.poliklinik')->where('id', $jadwal->id)->first();
        return response()->json($jadwalWith, 201);
    }

    public function destroy($id)
    {
        $jadwal = JadwalDokter::find($id);
        if (!$jadwal) {
            return response()->json(['message' => 'Not found'], 404);
        }
        try {
            $jadwal->delete();
            return response()->json(null, 204);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json(['message' => 'Tidak bisa menghapus jadwal karena masih ada antrian terkait.'], 409);
        }
    }
}

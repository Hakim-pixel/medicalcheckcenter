<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PoliklinikController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('polikliniks')->orderBy('nama_poli')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_poli' => 'required',
            'lokasi' => 'nullable'
        ]);

        $id = Str::uuid();
        DB::table('polikliniks')->insert([
            'id' => $id,
            'nama_poli' => $validated['nama_poli'],
            'lokasi' => $validated['lokasi'],
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Poliklinik created', 'id' => $id], 201);
    }

    public function destroy($id)
    {
        try {
            $deleted = DB::table('polikliniks')->where('id', $id)->delete();
            if ($deleted === 0) {
                return response()->json(['message' => 'Poliklinik not found'], 404);
            }
            return response()->json(['message' => 'Poliklinik deleted']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') { // Integrity constraint violation
                return response()->json(['message' => 'Data Poliklinik ini sedang digunakan oleh Dokter dan tidak bisa dihapus.'], 409);
            }
            return response()->json(['message' => 'Terjadi kesalahan server'], 500);
        }
    }
}

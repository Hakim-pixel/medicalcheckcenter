<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TindakanController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('tindakans')->orderBy('nama_tindakan')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_tindakan' => 'required',
            'tarif' => 'required|numeric'
        ]);

        $id = Str::uuid();
        DB::table('tindakans')->insert([
            'id' => $id,
            'nama_tindakan' => $validated['nama_tindakan'],
            'tarif' => $validated['tarif'],
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Tindakan created', 'id' => $id], 201);
    }

    public function destroy($id)
    {
        try {
            $deleted = DB::table('tindakans')->where('id', $id)->delete();
            if ($deleted === 0) {
                return response()->json(['message' => 'Tindakan not found'], 404);
            }
            return response()->json(['message' => 'Tindakan deleted']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json(['message' => 'Tindakan ini sudah digunakan dalam rekam medis pasien dan tidak bisa dihapus.'], 409);
            }
            return response()->json(['message' => 'Terjadi kesalahan server'], 500);
        }
    }
}

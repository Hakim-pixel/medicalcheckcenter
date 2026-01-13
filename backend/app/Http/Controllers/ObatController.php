<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ObatController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('obats')->orderBy('nama_obat')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat' => 'required',
            'jenis' => 'nullable',
            'stok' => 'required|integer',
            'harga' => 'required|numeric'
        ]);

        $id = Str::uuid();
        DB::table('obats')->insert([
            'id' => $id,
            'nama_obat' => $validated['nama_obat'],
            'jenis' => $validated['jenis'],
            'stok' => $validated['stok'],
            'harga' => $validated['harga'],
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Obat created', 'id' => $id], 201);
    }

    public function destroy($id)
    {
        DB::table('obats')->where('id', $id)->delete();
        return response()->json(['message' => 'Obat deleted']);
    }
}

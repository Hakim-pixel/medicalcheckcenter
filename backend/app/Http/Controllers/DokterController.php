<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dokter; // Using Model for relation loading convenience
use Illuminate\Support\Str;

class DokterController extends Controller
{
    public function index()
    {
        // Equivalent to: Dokters::with(['poliklinik', 'user'])->get()
        return response()->json(Dokter::with(['poliklinik', 'user'])->orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'spesialisasi' => 'required',
            'poliklinikId' => 'required',
            'userId' => 'nullable',
            'no_telp' => 'nullable'
        ]);

        $dokter = new Dokter();
        $dokter->id = Str::uuid();
        $dokter->nama = $validated['nama'];
        $dokter->spesialisasi = $validated['spesialisasi'];
        $dokter->poliklinikId = $validated['poliklinikId'];
        $dokter->userId = $validated['userId'] ?? null;
        $dokter->no_telp = $validated['no_telp'];
        $dokter->save();

        return response()->json($dokter, 201);
    }

    public function destroy($id)
    {
        $dokter = Dokter::find($id);
        if ($dokter) {
            $dokter->delete();
        }
        return response()->json(['message' => 'Dokter deleted']);
    }
}

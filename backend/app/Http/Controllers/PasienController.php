<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasienController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('pasiens');
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%")
                ->orWhere('no_rm', 'like', "%{$search}%");
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required',
            // make no_rm optional; if not provided we'll generate it server-side
            'no_rm' => 'nullable|unique:pasiens,no_rm',
            'nik' => 'nullable|unique:pasiens,nik',
            'tgl_lahir' => 'required|date',
            'jenis_kelamin' => 'required',
            'alamat' => 'required',
            'agama' => 'nullable',
            'nama_kk' => 'nullable',
            'hubungan_kk' => 'nullable',
            'pekerjaan' => 'nullable',
            'no_telp' => 'nullable',
        ]);

        $data['id'] = Str::uuid();
        // generate no_rm if not provided: RM-<year>-<sequence>
        if (empty($data['no_rm'])) {
            $year = date('Y');
            $count = DB::table('pasiens')->whereYear('created_at', $year)->count();
            $seq = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            $data['no_rm'] = "RM-{$year}-{$seq}";
            // ensure uniqueness in rare race conditions
            while (DB::table('pasiens')->where('no_rm', $data['no_rm'])->exists()) {
                $count++;
                $seq = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
                $data['no_rm'] = "RM-{$year}-{$seq}";
            }
        }
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('pasiens')->insert($data);

        return response()->json(['message' => 'Pasien created', 'id' => $data['id']]);
    }

    public function show($id)
    {
        $pasien = DB::table('pasiens')->where('id', $id)->first();
        return $pasien ? response()->json($pasien) : response()->json(['message' => 'Not found'], 404);
    }
}

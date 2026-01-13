<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pasien;
use App\Models\Kunjungan;
use App\Models\RekamMedis;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_pasien' => Pasien::count(),
            'kunjungan_hari_ini' => Kunjungan::whereDate('tgl_kunjungan', now())->count(),
            'tindakan_selesai' => Kunjungan::where('status', 'SELESAI')->count(), // Proxy for treatments
        ]);
    }
}

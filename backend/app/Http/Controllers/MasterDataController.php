<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MasterDataController extends Controller
{
    public function getPoli()
    {
        return response()->json(DB::table('polikliniks')->get());
    }

    public function getObat()
    {
        return response()->json(DB::table('obats')->get());
    }

    public function getTindakan()
    {
        return response()->json(DB::table('tindakans')->get());
    }

    public function getDokter()
    {
        return response()->json(DB::table('dokters')
            ->join('polikliniks', 'dokters.poliklinikId', '=', 'polikliniks.id')
            ->select('dokters.*', 'polikliniks.nama_poli')
            ->get());
    }
}

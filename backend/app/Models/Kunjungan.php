<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kunjungan extends Model
{
    use HasFactory;

    protected $table = 'kunjungans';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'pasienId',
        'dokterId',
        'tgl_kunjungan',
        'keluhan_awal',
        'diagnosa',
        'status'
    ];

    public function pasien()
    {
        return $this->belongsTo(Pasien::class, 'pasienId');
    }

    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'dokterId');
    }

    public function rekamMedis()
    {
        return $this->hasOne(RekamMedis::class, 'kunjunganId');
    }
}

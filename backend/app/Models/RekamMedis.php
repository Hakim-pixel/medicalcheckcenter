<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekamMedis extends Model
{
    use HasFactory;

    protected $table = 'rekam_medis';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'kunjunganId',
        'diagnosa',
        'catatan',
        'tgl_periksa'
    ];

    public function kunjungan()
    {
        return $this->belongsTo(Kunjungan::class, 'kunjunganId');
    }

    public function resep()
    {
        return $this->hasMany(Resep::class, 'rekamMedisId');
    }

    public function tindakan()
    {
        return $this->hasMany(TindakanPasien::class, 'rekamMedisId');
    }

    public function laboratorium()
    {
        return $this->hasMany(Laboratorium::class, 'rekamMedisId');
    }
}

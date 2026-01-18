<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TindakanPasien extends Model
{
    use HasFactory;

    protected $table = 'tindakan_pasiens';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'rekamMedisId',
        'tindakanId',
        'keterangan',
        'biaya'
    ];

    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedis::class, 'rekamMedisId');
    }

    public function tindakanMaster()
    {
        return $this->belongsTo(Tindakan::class, 'tindakanId');
    }
}

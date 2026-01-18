<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resep extends Model
{
    use HasFactory;

    protected $table = 'reseps';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'rekamMedisId',
        'obatId',
        'jumlah',
        'aturan_pakai'
    ];

    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedis::class, 'rekamMedisId');
    }

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'obatId');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laboratorium extends Model
{
    use HasFactory;

    protected $table = 'laboratoriums';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'rekamMedisId',
        'hasil_lab',
        'keterangan',
        'tgl_lab'
    ];

    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedis::class, 'rekamMedisId');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    use HasFactory;

    protected $table = 'pasiens';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'no_rm',
        'nama',
        'nik',
        'tgl_lahir',
        'jenis_kelamin',
        'alamat',
        'agama',
        'no_telp'
    ];
}

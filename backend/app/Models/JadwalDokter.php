<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JadwalDokter extends Model
{
    use HasFactory;

    protected $table = 'jadwal_dokters';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'dokterId',
        'hari',
        'jam_mulai',
        'jam_selesai',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'dokterId');
    }
}

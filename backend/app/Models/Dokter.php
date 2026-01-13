<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dokter extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    // Define table if not plural of model name, but 'dokters' is correct default.
    // protected $table = 'dokters';

    public function poliklinik()
    {
        return $this->belongsTo(Poliklinik::class, 'poliklinikId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}

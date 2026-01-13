<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('polikliniks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_poli');
            $table->string('lokasi')->nullable();
            $table->timestamps();
        });

        Schema::create('dokters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama');
            $table->string('spesialisasi');
            $table->string('sip')->nullable();
            $table->string('no_telp')->nullable();
            $table->foreignUuid('poliklinikId')->constrained('polikliniks');
            $table->string('userId')->nullable()->unique(); // Link to User ID (UUID)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokters');
        Schema::dropIfExists('polikliniks');
    }
};

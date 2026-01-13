<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasiens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('no_rm')->unique();
            $table->string('nama');
            $table->string('nik')->nullable()->unique();
            $table->date('tgl_lahir');
            $table->string('jenis_kelamin');
            $table->string('agama')->nullable();
            $table->string('nama_kk')->nullable();
            $table->string('hubungan_kk')->nullable();
            $table->text('alamat');
            $table->string('no_telp')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->timestamps();
        });

        Schema::create('obats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_obat');
            $table->string('jenis')->nullable();
            $table->integer('stok');
            $table->decimal('harga', 15, 2);
            $table->timestamps();
        });

        Schema::create('tindakans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_tindakan');
            $table->decimal('tarif', 15, 2);
            $table->timestamps();
        });
        
        Schema::create('jadwal_dokters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('dokterId')->constrained('dokters')->cascadeOnDelete();
            $table->string('hari');
            $table->string('jam_mulai');
            $table->string('jam_selesai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_dokters');
        Schema::dropIfExists('tindakans');
        Schema::dropIfExists('obats');
        Schema::dropIfExists('pasiens');
    }
};

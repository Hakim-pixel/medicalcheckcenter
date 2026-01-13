<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kunjungans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->dateTime('tgl_kunjungan')->useCurrent();
            $table->foreignUuid('pasienId')->constrained('pasiens');
            $table->foreignUuid('dokterId')->constrained('dokters');
            $table->text('keluhan_awal')->nullable();
            $table->string('status')->default('ANTRIAN'); // ANTRIAN, DIPERIKSA, SELESAI
            $table->timestamps();
        });

        Schema::create('rekam_medis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('kunjunganId')->unique()->constrained('kunjungans')->cascadeOnDelete();
            $table->text('diagnosa');
            $table->text('catatan')->nullable();
            $table->dateTime('tgl_periksa')->useCurrent();
            $table->timestamps();
        });

        Schema::create('reseps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rekamMedisId')->constrained('rekam_medis')->cascadeOnDelete();
            $table->foreignUuid('obatId')->constrained('obats');
            $table->integer('jumlah');
            $table->string('aturan_pakai');
            $table->timestamps();
        });

        Schema::create('tindakan_pasiens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rekamMedisId')->constrained('rekam_medis')->cascadeOnDelete();
            $table->foreignUuid('tindakanId')->constrained('tindakans');
            $table->string('keterangan')->nullable();
            $table->decimal('biaya', 15, 2);
            $table->timestamps();
        });

        Schema::create('laboratoriums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rekamMedisId')->constrained('rekam_medis')->cascadeOnDelete();
            $table->text('hasil_lab');
            $table->string('keterangan')->nullable();
            $table->dateTime('tgl_lab')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laboratoriums');
        Schema::dropIfExists('tindakan_pasiens');
        Schema::dropIfExists('reseps');
        Schema::dropIfExists('rekam_medis');
        Schema::dropIfExists('kunjungans');
    }
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $existingAdmin = DB::table('users')->where('username', 'admin')->first();
        if ($existingAdmin) {
            $adminId = $existingAdmin->id;
        } else {
            $adminId = Str::uuid();
            DB::table('users')->insert([
                'id' => $adminId,
                'nama' => 'Administrator',
                'username' => 'admin',
                'password' => Hash::make('admin'),
                'role' => 'ADMIN',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $existingPetugas = DB::table('users')->where('username', 'petugas')->first();
        if ($existingPetugas) {
            $petugasId = $existingPetugas->id;
        } else {
            $petugasId = Str::uuid();
            DB::table('users')->insert([
                'id' => $petugasId,
                'nama' => 'Petugas Pendaftaran',
                'username' => 'petugas',
                'password' => Hash::make('petugas'),
                'role' => 'PETUGAS_RM',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $existingManajer = DB::table('users')->where('username', 'manajer')->first();
        if ($existingManajer) {
            $manajerId = $existingManajer->id;
        } else {
            $manajerId = Str::uuid();
            DB::table('users')->insert([
                'id' => $manajerId,
                'nama' => 'Bapak Manajer',
                'username' => 'manajer',
                'password' => Hash::make('manajer'),
                'role' => 'MANAJER',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $existingDrBudiUser = DB::table('users')->where('username', 'drbudi')->first();
        if ($existingDrBudiUser) {
            $drBudiUserId = $existingDrBudiUser->id;
        } else {
            $drBudiUserId = Str::uuid();
            DB::table('users')->insert([
                'id' => $drBudiUserId,
                'nama' => 'dr. Budi Santoso',
                'username' => 'drbudi',
                'password' => Hash::make('drbudi'),
                'role' => 'DOKTER',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 2. Poliklinik
        $existingPoli = DB::table('polikliniks')->where('nama_poli', 'Poli Umum')->first();
        if ($existingPoli) {
            $poliUmumId = $existingPoli->id;
        } else {
            $poliUmumId = Str::uuid();
            DB::table('polikliniks')->insert([
                'id' => $poliUmumId,
                'nama_poli' => 'Poli Umum',
                'lokasi' => 'Lantai 1',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 3. Dokter Profile
        $existingDr = DB::table('dokters')->where('sip', '123/SIP/2024')->first();
        if ($existingDr) {
            $drBudiId = $existingDr->id;
        } else {
            $drBudiId = Str::uuid();
            DB::table('dokters')->insert([
                'id' => $drBudiId,
                'nama' => 'dr. Budi Santoso',
                'spesialisasi' => 'Umum',
                'sip' => '123/SIP/2024',
                'poliklinikId' => $poliUmumId,
                'userId' => $drBudiUserId,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 4. Obat
        // Obat - insert if not exists; capture id for Paracetamol
        $existingParacetamol = DB::table('obats')->where('nama_obat', 'Paracetamol 500mg')->first();
        if ($existingParacetamol) {
            $obatId = $existingParacetamol->id;
        } else {
            $obatId = Str::uuid();
            DB::table('obats')->insert([
                ['id' => $obatId, 'nama_obat' => 'Paracetamol 500mg', 'jenis' => 'Tablet', 'stok' => 100, 'harga' => 5000, 'created_at' => now(), 'updated_at' => now()]
            ]);
        }

        $otherObats = [
            ['nama_obat' => 'Amoxicillin 500mg', 'jenis' => 'Kapsul', 'stok' => 50, 'harga' => 10000],
            ['nama_obat' => 'Vitamin C', 'jenis' => 'Tablet', 'stok' => 200, 'harga' => 2000],
        ];
        foreach ($otherObats as $o) {
            if (!DB::table('obats')->where('nama_obat', $o['nama_obat'])->exists()) {
                DB::table('obats')->insert([
                    'id' => Str::uuid(),
                    'nama_obat' => $o['nama_obat'],
                    'jenis' => $o['jenis'],
                    'stok' => $o['stok'],
                    'harga' => $o['harga'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // 5. Tindakan
        // Tindakan - insert if not exists and capture Konsultasi id
        $existingKonsultasi = DB::table('tindakans')->where('nama_tindakan', 'Konsultasi Umum')->first();
        if ($existingKonsultasi) {
            $konsultasiId = $existingKonsultasi->id;
        } else {
            $konsultasiId = Str::uuid();
            DB::table('tindakans')->insert([
                'id' => $konsultasiId,
                'nama_tindakan' => 'Konsultasi Umum',
                'tarif' => 30000,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        if (!DB::table('tindakans')->where('nama_tindakan', 'Suntik Vitamin')->exists()) {
            DB::table('tindakans')->insert([
                'id' => Str::uuid(),
                'nama_tindakan' => 'Suntik Vitamin',
                'tarif' => 50000,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 6. Pasien
        $existingPasien = DB::table('pasiens')->where('no_rm', 'RM-2024-001')->first();
        if ($existingPasien) {
            $pasienId = $existingPasien->id;
        } else {
            $pasienId = Str::uuid();
            DB::table('pasiens')->insert([
                'id' => $pasienId,
                'no_rm' => 'RM-2024-001',
                'nama' => 'Ani Suryani',
                'tgl_lahir' => '1990-05-15',
                'jenis_kelamin' => 'PEREMPUAN',
                'alamat' => 'Jl. Mawar No. 10',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 7. Kunjungan (Selesai)
        $existingKunjungan = DB::table('kunjungans')
            ->where('pasienId', $pasienId)
            ->where('dokterId', $drBudiId)
            ->where('status', 'SELESAI')
            ->where('keluhan_awal', 'Demam tinggi')
            ->first();
        if ($existingKunjungan) {
            $kunjunganId = $existingKunjungan->id;
        } else {
            $kunjunganId = Str::uuid();
            DB::table('kunjungans')->insert([
                'id' => $kunjunganId,
                'pasienId' => $pasienId,
                'dokterId' => $drBudiId,
                'tgl_kunjungan' => now()->subHours(2),
                'keluhan_awal' => 'Demam tinggi',
                'status' => 'SELESAI',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 8. Rekam Medis
        $existingRm = DB::table('rekam_medis')->where('kunjunganId', $kunjunganId)->first();
        if ($existingRm) {
            $rmId = $existingRm->id;
        } else {
            $rmId = Str::uuid();
            DB::table('rekam_medis')->insert([
                'id' => $rmId,
                'kunjunganId' => $kunjunganId,
                'diagnosa' => 'Febris ec. Viral Infection',
                'catatan' => 'Istirahat cukup',
                'tgl_periksa' => now()->subHour(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Resep
        if (!DB::table('reseps')->where('rekamMedisId', $rmId)->where('obatId', $obatId)->exists()) {
            DB::table('reseps')->insert([
                'id' => Str::uuid(),
                'rekamMedisId' => $rmId,
                'obatId' => $obatId,
                'jumlah' => 10,
                'aturan_pakai' => '3x1 sesudah makan',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Tindakan Pasien
        if (!DB::table('tindakan_pasiens')->where('rekamMedisId', $rmId)->where('tindakanId', $konsultasiId)->exists()) {
            DB::table('tindakan_pasiens')->insert([
                'id' => Str::uuid(),
                'rekamMedisId' => $rmId,
                'tindakanId' => $konsultasiId,
                'biaya' => 30000,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Lab
        if (!DB::table('laboratoriums')->where('rekamMedisId', $rmId)->where('hasil_lab', 'Leukosit: 12.000 (Tinggi)')->exists()) {
            DB::table('laboratoriums')->insert([
                'id' => Str::uuid(),
                'rekamMedisId' => $rmId,
                'hasil_lab' => 'Leukosit: 12.000 (Tinggi)',
                'keterangan' => 'Indikasi infeksi',
                'tgl_lab' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}

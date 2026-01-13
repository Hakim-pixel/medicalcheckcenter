<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\KunjunganController;
use App\Http\Controllers\RekamMedisController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PoliklinikController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\TindakanController;
use App\Http\Controllers\DokterController;
use App\Http\Controllers\JadwalController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Allow fetching a single kunjungan without auth for server-side rendering and public pages.
// Keep other kunjungan routes protected.
Route::get('/kunjungan/{id}', [KunjunganController::class, 'show']);

// Temporary debug route (only for local development) to list kunjungans without auth.
// Remove this before deploying to production.
if (env('APP_ENV') === 'local') {
    Route::get('/debug/kunjungan', function () {
        return response()->json(\App\Models\Kunjungan::with(['pasien','dokter.poliklinik'])->orderBy('tgl_kunjungan','desc')->get());
    });
}

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Master Data Resources
    Route::get('/poli', [PoliklinikController::class, 'index']);
    Route::post('/poli', [PoliklinikController::class, 'store']);
    Route::delete('/poli/{id}', [PoliklinikController::class, 'destroy']);

    Route::get('/obat', [ObatController::class, 'index']);
    Route::post('/obat', [ObatController::class, 'store']);
    Route::delete('/obat/{id}', [ObatController::class, 'destroy']);

    Route::get('/tindakan', [TindakanController::class, 'index']);
    Route::post('/tindakan', [TindakanController::class, 'store']);
    Route::delete('/tindakan/{id}', [TindakanController::class, 'destroy']);

    Route::get('/dokter', [DokterController::class, 'index']);
    Route::post('/dokter', [DokterController::class, 'store']);
    Route::delete('/dokter/{id}', [DokterController::class, 'destroy']);

    // Pasien
    Route::get('/pasien', [PasienController::class, 'index']);
    Route::post('/pasien', [PasienController::class, 'store']);
    Route::get('/pasien/{id}', [PasienController::class, 'show']);

    // Kunjungan
    Route::get('/kunjungan', [KunjunganController::class, 'index']);
    Route::post('/kunjungan', [KunjunganController::class, 'store']);

    // Rekam Medis
    Route::post('/rekam-medis', [RekamMedisController::class, 'store']);
    // list and show rekam medis for reports/print
    Route::get('/rekam-medis', [RekamMedisController::class, 'index']);
    Route::get('/rekam-medis/{id}', [RekamMedisController::class, 'show']);

    // Resep & Tindakan (aggregates used in reports)
    Route::get('/resep', [RekamMedisController::class, 'reseps']);
    Route::get('/tindakan-pasien', [RekamMedisController::class, 'tindakanPasiens']);
    Route::post('/lab', [RekamMedisController::class, 'storeLab']);

    // Jadwal Dokter (scheduling)
    Route::get('/jadwal', [JadwalController::class, 'index']);
    Route::post('/jadwal', [JadwalController::class, 'store']);
    Route::delete('/jadwal/{id}', [JadwalController::class, 'destroy']);
});

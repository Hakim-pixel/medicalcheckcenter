<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change tokenable_id to varchar(36) to support UUID primary keys
        DB::statement("ALTER TABLE `personal_access_tokens` MODIFY `tokenable_id` VARCHAR(36) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to unsigned big integer (may fail if data is non-numeric)
        DB::statement("ALTER TABLE `personal_access_tokens` MODIFY `tokenable_id` BIGINT UNSIGNED NOT NULL");
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Xóa các môn học bị trùng tên, chỉ giữ lại môn có ID nhỏ nhất
        $duplicates = DB::table('subjects')
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            $toKeep = DB::table('subjects')
                ->where('name', $duplicate->name)
                ->orderBy('id')
                ->first();

            DB::table('subjects')
                ->where('name', $duplicate->name)
                ->where('id', '>', $toKeep->id)
                ->delete();
        }

        // Thêm unique index cho cột name nếu chưa có
        Schema::table('subjects', function (Blueprint $table) {
            $indexes = DB::select("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='subjects'");
            $indexNames = array_column($indexes, 'name');

            if (!in_array('subjects_name_unique', $indexNames)) {
                $table->unique('name', 'subjects_name_unique');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $indexes = DB::select("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='subjects'");
            $indexNames = array_column($indexes, 'name');

            if (in_array('subjects_name_unique', $indexNames)) {
                $table->dropUnique('subjects_name_unique');
            }
        });
    }
};
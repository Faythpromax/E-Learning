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
        // Sử dụng Transaction để đảm bảo an toàn dữ liệu
        DB::transaction(function () {
            // 1. Xóa các môn học bị trùng tên, chỉ giữ lại môn có ID nhỏ nhất
            DB::statement('
                DELETE s1 FROM subjects s1
                INNER JOIN subjects s2 ON s1.name = s2.name
                WHERE s1.id > s2.id
            ');

            // 2. Kiểm tra nếu chưa có unique index thì mới thêm vào để tránh lỗi trùng lặp index
            Schema::table('subjects', function (Blueprint $table) {
                // Lấy danh sách index hiện tại của bảng
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('subjects');
                
                if (!array_key_exists('subjects_name_unique', $indexes)) {
                    $table->unique('name', 'subjects_name_unique');
                }
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            // Kiểm tra xem index có tồn tại không trước khi drop để tránh crash khi rollback
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexes = $sm->listTableIndexes('subjects');

            if (array_key_exists('subjects_name_unique', $indexes)) {
                $table->dropUnique('subjects_name_unique');
            }
        });
    }
};
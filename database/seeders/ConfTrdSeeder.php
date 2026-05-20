<?php

namespace Database\Seeders;

use App\Models\ConfTrd;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfTrdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ConfTrd::truncate();

        $data = [
            [
                'id' => 3,
                'conf_mask_trd_id' => 1,
                'dependency_code' => 'B13',
                'dependency_name' => 'E8',
                'unity_admin' => 'E7',
                'has_regional' => '0',
                'regional' => null,
                'init_data' => 'B13',
                'code_trd' => 'B',
                'series_sub_series_t_doc' => 'E',
                'items_year_gestion' => 'H',
                'items_year_central' => 'I',
                'items_dispo_final_ct' => 'L',
                'items_dispo_final_e' => 'J',
                'items_dispo_final_s' => 'K',
                'items_dispo_final_md' => 'M',
                'items_pro_subseries' => 'N',
                'conf_days_term' => '1',
                'days_conf_days_term' => '15',
                'Has_standard' => '0',
                'item_standard' => null,
                'Has_support' => '1',
                'item_support_p' => 'F',
                'item_support_e' => 'G',
                'item_support_o' => null,
                'creado_por_id' => 1,
                'created_at' => '2025-01-09 19:25:47',
                'updated_at' => '2025-01-09 19:25:47',
                'deleted_at' => null,
                'serie' => 'C',
                'subserie' => 'D',
            ]
        ];

        foreach ($data as $registry) {
            ConfTrd::create([
                'id' => $registry['id'],
                'conf_mask_trd_id' => $registry['conf_mask_trd_id'],
                'dependency_code' => $registry['dependency_code'],
                'dependency_name' => $registry['dependency_name'],
                'unity_admin' => $registry['unity_admin'],
                'has_regional' => $registry['has_regional'],
                'regional' => $registry['regional'],
                'init_data' => $registry['init_data'],
                'code_trd' => $registry['code_trd'],
                'series_sub_series_t_doc' => $registry['series_sub_series_t_doc'],
                'items_year_gestion' => $registry['items_year_gestion'],
                'items_year_central' => $registry['items_year_central'],
                'items_dispo_final_ct' => $registry['items_dispo_final_ct'],
                'items_dispo_final_e' => $registry['items_dispo_final_e'],
                'items_dispo_final_s' => $registry['items_dispo_final_s'],
                'items_dispo_final_md' => $registry['items_dispo_final_md'],
                'items_pro_subseries' => $registry['items_pro_subseries'],
                'conf_days_term' => $registry['conf_days_term'],
                'days_conf_days_term' => $registry['days_conf_days_term'],
                'Has_standard' => $registry['Has_standard'],
                'item_standard' => $registry['item_standard'],
                'Has_support' => $registry['Has_support'],
                'item_support_p' => $registry['item_support_p'],
                'item_support_e' => $registry['item_support_e'],
                'item_support_o' => $registry['item_support_o'],
                'creado_por_id' => $registry['creado_por_id'],
                'created_at' => $registry['created_at'],
                'updated_at' => $registry['updated_at'],
                'deleted_at' => $registry['deleted_at'],
                'serie' => $registry['serie'],
                'subserie' => $registry['subserie'],
            ]);
        }
    }
}

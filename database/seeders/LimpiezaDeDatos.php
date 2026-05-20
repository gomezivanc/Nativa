<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LimpiezaDeDatos extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Iniciando limpieza de datos transaccionales...');

        // Desactivar verificacion de FKs para truncar sin restricciones
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        // ============================================================
        // 1. LOGS Y ACTIVITY (sin dependencias criticas)
        // ============================================================
        $this->truncate('activity_log');
        $this->truncate('log_user_login');
        $this->truncate('filing_logs');

        // ============================================================
        // 2. EMAILS Y COMUNICACIONES
        // ============================================================
        $this->truncate('filing_email_attaches');
        $this->truncate('filing_email_tos');
        $this->truncate('filing_emails');
        $this->truncate('response_emails');
        $this->truncate('response_templates');
        $this->truncate('received_emails');
        // $this->truncate('sender_recipients');

        // ============================================================
        // 3. DISTRIBUCION Y ENVIOS
        // ============================================================
        $this->truncate('distribution_shipping_filings');
        $this->truncate('distribution_units');
        $this->truncate('dependency_templates');

        // ============================================================
        // 4. DOCUMENTOS Y RESPUESTAS DE RADICADOS
        // ============================================================
        $this->truncate('charge_doc_filings');
        $this->truncate('charges');
        $this->truncate('copy_filing');
        $this->truncate('filed_departure');
        $this->truncate('signed_filings');
        $this->truncate('signatories');
        // $this->truncate('filing_acknowledgments');

        // ============================================================
        // 5. EXPEDIENTES - DETALLES HIJOS
        // ============================================================
        $this->truncate('exp_files_files');
        $this->truncate('exp_files_accesses');
        $this->truncate('exp_files_dependencies');
        $this->truncate('exp_files_file_segments');
        $this->truncate('exp_filings_file_segments');
        $this->truncate('expediente_indices');
        $this->truncate('indices');
        $this->truncate('exp_files_referencecrusades');

        // ============================================================
        // 6. PRESTAMOS DOCUMENTALES
        // ============================================================
        $this->truncate('documentary_loans_exps');
        $this->truncate('documentary_loans');
        $this->truncate('historic_loans_exps');
        $this->truncate('historic_loans');

        // ============================================================
        // 7. RETENCION Y TIPO DOCUMENTAL
        // ============================================================
        $this->truncate('retencion_indices');
        $this->truncate('retencion_tipo_documental');
        $this->truncate('retencion');

        // ============================================================
        // 8. WORKFLOWS
        // ============================================================
        $this->truncate('filing_workflows');
        $this->truncate('workflow_edges');
        $this->truncate('workflow_nodes');
        $this->truncate('workflows');

        // ============================================================
        // 9. RADICADOS - RELACIONES
        // ============================================================
        $this->truncate('associated_filings');
        $this->truncate('cancellation_request_filings');
        $this->truncate('solicitudes');
        $this->truncate('filing_exp_files');

        // ============================================================
        // 10. RADICADOS Y EXPEDIENTES PRINCIPALES
        // ============================================================
        $this->truncate('filings');
        $this->truncate('exp_files');

        // ============================================================
        // 11. TERCEROS Y OTROS
        // ============================================================
        $this->truncate('thirds');
        $this->truncate('dependency_historics');
        $this->truncate('user_interoperabilities');
        $this->truncate('satisfaction_survey_responses');
        $this->truncate('tenants');
        $this->truncate('domains');

        // ============================================================
        // 12. CONFIGURACIONES Y CATALOGOS DINAMICOS
        // ============================================================
        $this->truncate('accumulated_funds');
        $this->truncate('payroll_management');
        $this->truncate('radication_labels');
        // $this->truncate('types_filings'); -- Revisar esto Para E y S

        // ============================================================
        // 3. DEPENDENCIAS
        // ============================================================
        $this->truncate('g_d_dependencies');
        $this->truncate('users_groups_dependencies');

        // Reactivar verificacion de FKs
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');

        $this->command->info('Limpieza de datos completada exitosamente.');
    }

    /**
     * Trunca una tabla y muestra confirmacion.
     */
    private function truncate(string $table): void
    {
        DB::table($table)->truncate();
        $this->command->info("  → {$table} limpiada.");
    }
}

<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(AplicativosCentralizadoSeed::class);
        $this->call(TipoDocumentosSeeder::class);
        $this->call(UserSeed::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(RolSeeder::class);
        $this->call(ModelHasRolesSeeder::class);
        $this->call(MenusTableSeeder::class);
        $this->call(PermisosSeed::class);
        $this->call(ConfMaskTrdsTableSeeder::class);
        $this->call(DepartamentoSeeder::class);
        $this->call(CiudadSeeder::class);
        $this->call(ConfServicesProvidersTableSeeder::class);
        $this->call(ExpFilesClasificationsTableSeeder::class);
        $this->call(TypeAnnexesTableSeeder::class);
        $this->call(ExpFilesTypeDocsTableSeeder::class);
        $this->call(ExpFilesSupportTypeTableSeeder::class);
        $this->call(FilingStructureSeeder::class);
        $this->call(PrioritySeeder::class);
        $this->call(RegionalSeeder::class);
        $this->call(DependencySeeder::class);
        $this->call(ReceptionMediumSeeder::class);
        $this->call(TypesBodySeeder::class);
        $this->call(ConfTrdSeeder::class);
        $this->call(ExpFileTypeControlSeeder::class);
        $this->call(TypePersonSeeder::class);
        $this->call(TypeDocumentaryLoansSeeder::class);
        $this->call(TypeLoanSeeder::class);
        $this->call(TypeRequirementsSeeder::class);

        // $this->call(TypeAmountSeeder::class);
        // $this->call(TypeConciliationSeeder::class);
        // $this->call(ProcessInstanceSeeder::class);
        // $this->call(ProcessResultsSeeder::class);

        // $this->call(PdaAcceptRequestSeeder::class);
        // $this->call(PdaReclamationSeeder::class);
        // $this->call(PdaSentenceUnificationSeeder::class);
        // $this->call(PdaTypeSentenceUnificationSeeder::class);
        // $this->call(PdaExistResourceSeeder::class);

        // $this->call(PdaExhaustionSeeder::class);

        // $this->call(PdaJurisdictionCorrespondSeeder::class);
        // $this->call(PdaProbabilitiesSeeder::class);
        // $this->call(PdaComiteRepetitionSeeder::class);

        // $this->call(ComitteeDecitionSeeder::class);

        // $this->call(PersonsTypeSeeder::class);
    }
}

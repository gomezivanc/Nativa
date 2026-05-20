<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Filesystem\Filesystem;

class MakeModelWithRepository extends Command
{
    protected $signature = 'make:model-repo {name} {--m|migration} {--c|controller} {--r|repository} {--s|seeder}';
    protected $description = 'Crea un modelo con migración, controlador y repositorio';

    public function handle()
    {
        $name = $this->argument('name');
        // Crear el modelo con migración y controlador
        $command = "make:model {$name}";
        if ($this->option('migration')) {
            $command .= " -m";
        }
        if ($this->option('controller')) {
            $command .= " -c";
        }
        Artisan::call($command);
        $this->info("Modelo {$name} creado correctamente.");

        // Crear el repositorio si se usa -r
        if ($this->option('repository')) {
            $this->createRepository($name);
        }

        if ($this->option('controller')) {
            $this->addCodeToController($name);
        }
        if ($this->option('seeder')) {
            $this->createSeeder($name);
            $this->addCodeToSeeder($name);
        }
    }

    private function createRepository($name)
    {
        $repositoryPath = app_path("Repositories/{$name}Repository.php");

        if (file_exists($repositoryPath)) {
            $this->error("El repositorio {$name}Repository ya existe.");
            return;
        }

        (new Filesystem)->ensureDirectoryExists(app_path('Repositories'));

        $stub = <<<EOT
        <?php

            namespace App\Repositories;

            use App\Models\\{$name};
            use Illuminate\Database\Eloquent\Collection;
            use Illuminate\Pagination\LengthAwarePaginator;

            class {$name}Repository extends BaseRepository
            {
                public function __construct({$name} \$modelo)
                {
                    parent::__construct(\$modelo);
                }

                public function list(\$request = [], \$with = [], \$withCount = [], \$select = ['*'], \$idsIsNotAllowed = [], \$roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
                {
                    \$data = \$this->model->select(\$select)
                        ->with(\$with)
                        ->withCount(\$withCount)
                        ->where(function (\$query) use (\$request) {
                            if (!empty(\$request['name'])) {
                                \$query->where('name', 'like', '%' . \$request['name'] . '%');
                            }
                            if (!empty(\$request['created_at_init'])) {
                                \$query->orWhere('created_at', '>=', \$request['created_at_init']);
                            }
                            if (!empty(\$request['created_at_end'])) {
                                \$query->orWhere('created_at', '<=', \$request['created_at_end']);
                            }
                        });

                    if (!empty(\$request['active'])) {
                        if (\$request['active'] == "false") {
                            \$data->onlyTrashed();
                        }
                    }

                    if (empty(\$request['typeData'])) {
                        \$data = \$data->paginate(\$request['perPage'] ?? 10);
                    } else {
                        \$data = \$data->get();
                    }

                    return \$data;
                }
            }
        EOT;

        file_put_contents($repositoryPath, $stub);
        $this->info("Repositorio {$name}Repository creado en app/Repositories/");
    }

    private function addCodeToController($name)
    {
        $controllerPath = app_path("Http/Controllers/{$name}Controller.php");

        if (!file_exists($controllerPath)) {
            // Crear el controlador con Artisan
            Artisan::call("make:controller {$name}Controller");

            // Verificar si se creó correctamente
            if (file_exists($controllerPath)) {
                $this->info("El controlador {$name}Controller ha sido creado exitosamente.");
            } else {
                $this->error("No se pudo crear el controlador {$name}Controller.");
            }
        }

        // Abrir el archivo del controlador
        $controllerContent = file_get_contents($controllerPath);

        $nameLower = lcfirst($name);
        // Definir el código a insertar
        $insertCode = <<<EOT
            public function __construct(private {$name}Repository \${$nameLower}Repository)
            {
            }

            function index(Request \$request) {
                return Inertia::render("Configuration/{$nameLower}/Index",[
                ]);
            }

            function create(Request \$request) {

                return Inertia::render("Configuration/{$nameLower}/Create");
            }

            // store - update
            function store(Request \$request) {
                if(empty(\$request['id'])) {
                    \$request['creado_por_id'] = Auth::user()->id;
                }
                \$data = \$this->{$nameLower}Repository->storeGeneral(\$request->all());
                return response()->json(\$data);
            }

            function list(Request \$request) {
                \$data = \$this->{$nameLower}Repository->list(\$request->all(),[]);

                return response()->json(\$data);
            }

            function edit(String \$id) {
                return Inertia::render("Configuration/$nameLower/Create",compact('id'));
            }

            function show(String \$id) {
                \$object = \$this->{$nameLower}Repository->find(\$id);
                return response()->json(\$object);
            }

            function destroy(String \$id) {
                \$object = \$this->{$nameLower}Repository->find(\$id);
                \$object->delete();
                return response()->json(\$object);
            }

            function export(Request \$request) {
                \$type = \$request->type;
                \$data = \$this->{$nameLower}Repository->all(hidden: ['created_at','updated_at','deleted_at','id']);
                return \$this->{$nameLower}Repository->export(\$type,\$data->toArray(),'Excel.Export.generalExport','');
            }
        EOT;

        // Reemplazar el comentario // con el bloque de código
        $controllerContent = str_replace('//', $insertCode, $controllerContent, $count);

        // Verificar si el comentario fue encontrado y reemplazado
        if ($count > 0) {
            // Escribir el contenido actualizado en el archivo del controlador
            file_put_contents($controllerPath, $controllerContent);
            $this->info("Líneas agregadas correctamente en {$name}Controller.");
        } else {
            $this->error("No se encontró el comentario // en el controlador {$name}Controller.");
        }
    }
    protected function createSeeder($name)
    {
        $seederName = "{$name}Seeder";
        Artisan::call('make:seeder', ['name' => $seederName]);
        $this->info("Seeder {$seederName} creado correctamente.");
    }
    private function addCodeToSeeder($name)
    {
        $seederPath = database_path("seeders/{$name}Seeder.php");
        // dd($seederPath);
        if (!file_exists($seederPath)) {
            $this->error("El seeders {$name}Seeder no existe.");
            return;
        }

        // Abrir el archivo del controlador
        $seederContent = file_get_contents($seederPath);

        $nameLower = lcfirst($name);
        // Definir el código a insertar
        $insertCode = <<<EOT
            {$name}::truncate();

        \$data = [
                ['id' => 1, 'name_en' => 'High', 'name_es' => 'Alto'],
                ['id' => 2, 'name_en' => 'Medium', 'name_es' => 'Medio'],
                ['id' => 3, 'name_en' => 'Low', 'name_es' => 'Bajo'],
            ];

            foreach (\$data as \$registry) {
                {$name}::create([
                    'id' => \$registry ['id'],
                    'name_en' => \$registry ['name_en'],
                    'name_es' => \$registry ['name_es'],
                ]);
            }
        EOT;

        // Reemplazar el comentario // con el bloque de código
        $seederContent = str_replace('//', $insertCode, $seederContent, $count);

        // Verificar si el comentario fue encontrado y reemplazado
        if ($count > 0) {
            // Escribir el contenido actualizado en el archivo del controlador
            file_put_contents($seederPath, $seederContent);
            $this->info("Líneas agregadas correctamente en {$name}Seeder.");
        } else {
            $this->error("No se encontró el comentario // en el seeder {$name}Seeder.");
        }
    }
}

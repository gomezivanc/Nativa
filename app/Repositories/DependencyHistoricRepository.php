<?php

namespace App\Repositories;

use App\Models\DependencyHistoric;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class DependencyHistoricRepository extends BaseRepository
{
    private $errors = [];
    private $info = [];

    public function __construct(DependencyHistoric $modelo, private TrdRepository $TrdRepository, private GDDependencyRepository $gDDependencyRepository, private RegionalRepository $regionalRepository)
    {
        parent::__construct($modelo);
        $this->TrdRepository = $TrdRepository;
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['null_is_approval'])) {
                    $query->whereNull('is_approval');
                }
                if (!empty($request['dependency'])) {
                    $query->whereHas('dependency',function ($query) use($request) {
                        $query->where('name', 'like', '%' . $request['dependency'] . '%');
                    });
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
            });
        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        $dataObtained = [];

        foreach ($data as $key => $historic) {
            foreach (json_decode($historic->data_json) as $key => $serie) {
                if(!empty($request['serie'])) {
                    if($serie->serie->name !== $request['serie']) {
                        continue;
                    }
                }
                if(!empty($request['Subserie'])) {
                    if($serie->subseries->name !== $request['Subserie']) {
                        continue;
                    }
                }
                foreach ($serie->types as $key => $type) {
                    if (!empty($request['type_doc'])) {
                        if($type->name !== $request['type_doc']) {
                            continue;
                        }
                    }

                    $type->id = $historic->id;
                    $type->serie = $serie->serie;
                    $type->subserie = $serie->subseries;
                    $type->dependency = $historic->dependency;
                    $type->created_at = $historic->created_at;
                    $dataObtained[] = $type;
                }
            }
        }

        return $dataObtained;
    }

    function store(Collection $rows)
    {
        $confTrd = $this->TrdRepository->getModel()->latest()->first();
        if (!$confTrd) {
            $this->errors[] = 'No hay parametrizado ningun trd de cargue';
            return;
        }
        if (empty($rows->where('cell', $confTrd->dependency_code)->first())) {
            $this->errors[] = 'La celda ' . $confTrd->dependency_code . ' esta vacia';
            return;
        }
        if (empty($rows->where('cell', $confTrd->dependency_name)->first())) {
            $this->errors[] = 'La celda ' . $confTrd->dependency_name . ' esta vacia';
            return;
        }
        // regional
        $regional = $this->regionalRepository->getModel()->where('name', $rows->where('cell', $confTrd->regional)->first()['value'] ?? null)->first();
        if (is_null($regional)) {
            $regional = $this->regionalRepository->getModel()->latest()->first();
        }

        // unidad administrativa
        $unity = $this->gDDependencyRepository->getModel()->where('name', $rows->where('cell', $confTrd->unity_admin)->first()['value'] ?? null)->first();

        if(empty($rows->where('cell', $confTrd->dependency_code)->first()['value']?? null)) {
            $this->errors[] = 'La celda del codigo de la dependencia ' . $confTrd->unity_admin . ' esta vacia';
            return;
        }

        // dependencia del excel
        $dependency = $this->gDDependencyRepository->getModel()->where('code', $rows->where('cell', $confTrd->dependency_code)->first()['value'] ?? null)->first();
        // $dependency->name = $rows->where('cell', $confTrd->dependency_name)->first()['value'];
        // $dependency->save();

        // Creacion dependencia
        $dependencyData = [
            'code' => $rows->where('cell', $confTrd->dependency_code)->first()['value'] ?? null,
            'name' => $rows->where('cell', $confTrd->dependency_name)->first()['value'] ?? null,
            'creado_por_id' => Auth::user()->id,
            'regional_id' => $regional->id ?? null,
            'g_d_parent_id' => $unity->id ?? null
        ];
        if (is_null($dependency)) {
            $dependency = $this->gDDependencyRepository->storeGeneral($dependencyData);
            $this->info = str_replace('$num_trd', $dependency->code, __('documental_gestion.charge_trd.messages_success.new'));
        } else {
            $last = $dependency->historic()->latest()->first();
            if (is_null($last)) {
                $this->info = str_replace('$num_trd', $dependency->code, __('documental_gestion.charge_trd.messages_success.new'));
            } else {
                $this->info = str_replace('$date_trd', $last->created_at->format('M d Y, H:i'), __('documental_gestion.charge_trd.messages_success.replace'));
            }
            $dependency->update($dependencyData);
        }

        // Fin Creacion dependencia
        // TRD ACTIVA - Extraer las columnas del rango de la configuración
        $filtered = $rows->filter(function ($item) use ($confTrd) {
            $cell = $item['cell'];
            preg_match('/([A-Z]+)(\d+)/', $cell, $matches);
            $column = $matches[1];
            $row = (int)$matches[2];
            preg_match('/([A-Za-z]+)(\d+)/', $confTrd->init_data, $matches2);
            $letters = $matches2[1] ?? '';
            $numbers = $matches2[2] ?? '';
            // return strcmp($column, $letters) > 0 && $row >= $numbers;
            return strcmp($column, $letters) >= 0 && $row >= $numbers;
        });
        // Mostrar resultados filtrados

        $groupedByRows = $filtered->reduce(function ($result, $item) {
            $cell = $item['cell'];
            // Extraer fila y columna
            preg_match('/([A-Z]+)(\d+)/', $cell, $matches);
            $column = $matches[1];
            $row = (int)$matches[2];

            // Agrupar columnas bajo la fila correspondiente
            $result[$row][$column] = $item['value']; // Cambia 'value' según tu estructura
            return $result;
        }, []);

        $json = collect();
        foreach ($groupedByRows as $key => $row) {
            // Caso: Solo serie
            if (!empty($row[$confTrd->serie]) && empty($row[$confTrd->subserie])) {
                $json->push([
                    'serie' => [
                        'code' => $row[$confTrd->serie],
                        'name' => $row[$confTrd->series_sub_series_t_doc],
                    ],
                    'subseries' => [], // Espacio para subseries relacionadas
                ]);
                continue;
            }

            // Caso: Subserie
            if (!empty($row[$confTrd->subserie])) {
                // Buscar la serie correspondiente
                $serieIndex = $json->search(function ($item) use ($row, $confTrd) {
                    return isset($item['serie']['code']) && $item['serie']['code'] === $row[$confTrd->serie];
                });
                if(
                    empty($row[$confTrd->items_dispo_final_e]) &&
                    empty($row[$confTrd->items_dispo_final_s]) &&
                    empty($row[$confTrd->items_dispo_final_ct]) &&
                    empty($row[$confTrd->items_dispo_final_md])
                ) {
                    $this->errors[] = "Celda {$confTrd->items_dispo_final_e}{$key} - {$confTrd->items_dispo_final_md}{$key}:  Especifica almenos un valor en los items de disposición final";
                    continue;
                }
                if(
                    empty($row[$confTrd->items_year_gestion]) &&
                    empty($row[$confTrd->items_year_central])
                ) {
                    $this->errors[] = "Celda {$confTrd->items_year_gestion}{$key} - {$confTrd->items_year_central}{$key}: Especifica almenos un valor en los items de retención";
                    continue;
                }
                if ($serieIndex !== false) {
                    // Usar map para agregar la subserie sin modificar directamente la colección
                    $json = $json->flatMap(function ($item, $key) use ($serieIndex, $row, $confTrd) {
                        if ($key === $serieIndex) {
                            if (!empty($item['subseries'])) {
                                // Crear un nuevo elemento con la nueva subserie
                                $new = $item;
                                $new['types'] = [];
                                $new['subseries'] = [
                                    'code' => $row[$confTrd->subserie],
                                    'name' => $row[$confTrd->series_sub_series_t_doc] ?? null,
                                    'item_support_p' => $row[$confTrd->item_support_p] ?? null,
                                    'item_support_e' => $row[$confTrd->item_support_e] ?? null,
                                    'items_year_gestion' => $row[$confTrd->items_year_gestion] ?? null,
                                    'items_year_central' => $row[$confTrd->items_year_central] ?? null,
                                    'items_dispo_final_e' => $row[$confTrd->items_dispo_final_e] ?? null,
                                    'items_dispo_final_s' => $row[$confTrd->items_dispo_final_s] ?? null,
                                    'items_dispo_final_ct' => $row[$confTrd->items_dispo_final_ct] ?? null,
                                    'items_dispo_final_md' => $row[$confTrd->items_dispo_final_md] ?? null,
                                    'items_pro_subseries' => $row[$confTrd->items_pro_subseries] ?? null,
                                ];
                                return [$item, $new]; // Devuelve el elemento original y el nuevo
                            } else {
                                // Modificar el elemento original
                                $item['subseries'] = [
                                    'code' => $row[$confTrd->subserie],
                                    'name' => $row[$confTrd->series_sub_series_t_doc] ?? null,
                                    'item_support_p' => $row[$confTrd->item_support_p] ?? null,
                                    'item_support_e' => $row[$confTrd->item_support_e] ?? null,
                                    'items_year_gestion' => $row[$confTrd->items_year_gestion] ?? null,
                                    'items_year_central' => $row[$confTrd->items_year_central] ?? null,
                                    'items_dispo_final_e' => $row[$confTrd->items_dispo_final_e] ?? null,
                                    'items_dispo_final_s' => $row[$confTrd->items_dispo_final_s] ?? null,
                                    'items_dispo_final_ct' => $row[$confTrd->items_dispo_final_ct] ?? null,
                                    'items_dispo_final_md' => $row[$confTrd->items_dispo_final_md] ?? null,
                                    'items_pro_subseries' => $row[$confTrd->items_pro_subseries] ?? null,
                                ];
                            }
                        }
                        return [$item]; // Devuelve solo el elemento original si no hay cambios
                    });
                }
                continue;
            }

            $serieIndex = $json->keys()->last();
            $json = $json->map(function ($item, $key) use ($serieIndex, $row, $confTrd) {
                if ($key === $serieIndex) {
                    $item['types'][] = [
                        'name' => $row[$confTrd->series_sub_series_t_doc] ?? null,
                        'value' => $confTrd->days_conf_days_term
                    ];
                }
                return $item;
            });
        }
        $version = $dependency->historic()->count() + 1;
        $h = $this->storeGeneral([
            'data_json' => json_encode($json),
            'gd_dependency_id' => $dependency->id,
            'is_approval' => $version == 1 ? 1 : null,
            'version' => $version
        ]);
        if($version == 1) {
            $dependency->current_version_id = $h->id;
            $dependency->save();
        }
    }

    function getSerie(Request $request) {
        $data = $this->model->select('data_json')->get();

        $dataObtained = collect();
        foreach ($data as $key => $historic) {
            foreach (json_decode($historic->data_json) as $key => $serie) {
                foreach ($serie->types as $key => $type) {
                    if (!empty($request['type_doc'])) {
                        if($type->name !== $request['type_doc']) {
                            continue;
                        }
                    }
                    $serie->subseries = collect([
                        'series' => $serie->serie,
                        ...collect($serie->subseries)->toArray(),
                        'type' => $serie->types
                    ]);
                    $dataObtained->push([
                        'series' => $serie->serie,
                        'subseries' => $serie->subseries,
                        'type' => [
                            'name' => $type->name,
                            'value' => $type->value
                        ]
                    ]);
                }
            }
        }
        return [
            'series' => $dataObtained->unique('series.name')->values()->map(function ($item) {
                return $item['series'];
            }),
            'subseries' => $dataObtained->unique('subseries.name')->values()->map(function ($item,$key) {
                if (is_array($item['subseries'])) {
                    $item['subseries']['series'] = $item['series'];
                } elseif (is_object($item['subseries'])) {
                    $item['subseries']->series = $item['series'];
                }
                return $item['subseries'];
            }),
            'types' => $dataObtained->unique(function ($item) {
                    return $item['type']['name'] . '-' . $item['subseries']->get('code');
                })->values()->map(function ($item) {
                    $item['type']['serie_code'] = $item['series']->code;
                    $item['type']['subserie_code'] = $item['subseries']->get('code');
                    return $item['type'];
            }),

        ];
    }

    function getErrors()
    {
        return $this->errors;
    }
    function getInfoPage()
    {
        return $this->info;
    }
}

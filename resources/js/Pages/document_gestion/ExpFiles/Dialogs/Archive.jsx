import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import DropdownG from '../../../../components/Globals/Drodown'
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoading } from "../../../../Context/preloadContext";
import { toast } from 'react-toastify';
import axios from "axios";
import { InputText } from "primereact/inputtext";

export const ArchiveDialog = ({ onSearch, defaultVals = {}, onSetValues, exp_files_ids,withObservation = false }) => {
    const { translations,  typesBody } = usePage()?.props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, reset} = useForm({
        defaultValues: defaultVals
    })
    const [departaments, setSelectDepartaments] = useState([]);
    const [cities, setSelectCities] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [filesAreas, setFilesAreas] = useState([]);
    const [buildingsUbications, setBuildingsUbications] = useState([]);
    const { setIsLoading } = useLoading();

    const [racks, setRacks] = useState([])
    const [module, setModule] = useState([])
    const [panel, setPanel] = useState([])
    const [box, setBox] = useState([])

    const [categories, setCategories] = useState([
        {
            name: 'Carpetas (CAR)',
            value: 'CAR',
        },
        {
            name: 'Aceta (A-Z)',
            value: 'A-Z',
        },
        {
            name: 'Libro (LB)',
            value: 'LB',
        },
        {
            name: 'Archivador (AR)',
            value: 'AR',
        },
    ])

    const dep_id = watch("dep_id");
    const ciu_id = watch("ciu_id");
    const building = watch("building");
    const floor = watch("floor");
    const file_area_id = watch("file_area_id");
    useEffect(() => {
        getDepartaments()
    },[])
    useEffect(() => {
        getCities();
    }, [dep_id]);
    useEffect(() => {
        getBuildings()
    }, [ciu_id]);
    useEffect(() => {
        getBuildingsUbications()
    }, [building]);
    useEffect(() => {
        getBuildingsFilesAreas()
    }, [floor]);
    useEffect(() => {
        setItemsUbications()
    }, [file_area_id]);

    async function setItemsUbications() {
        try {
            const fileArea = getValues("file_area_id");
            if (!fileArea) return;

            const res = await axios.get(route("physicalspace.showUbication", fileArea));
            setValue('type_body_id',res.data.type_body_id)

            // Asegurar que res.data.rack es un número válido
            const rackCount = Number(res.data.rack);
            if (isNaN(rackCount) || rackCount <= 0) {
                console.error("Valor inválido para rack:", res.data.rack);
                return;
            }

            // Crear un array de racks del 1 al rackCount
            const racksArray = Array.from({ length: rackCount }, (_, index) => ({
                name: index + 1,
                value: index + 1,
            }));

            setRacks(racksArray); // Actualizar estado correctamente

            // Asegurar que res.data.rack es un número válido
            const moduleCount = Number(res.data.module);
            if (isNaN(moduleCount) || moduleCount <= 0) {
                console.error("Valor inválido para rack:", res.data.rack);
                return;
            }

            // Crear un array de racks del 1 al rackCount
            const moduleArray = Array.from({ length: rackCount }, (_, index) => ({
                name: index + 1,
                value: index + 1,
            }));

            setModule(moduleArray); // Actualizar estado correctamente

            // Asegurar que res.data.rack es un número válido
            const panelCount = Number(res.data.panel);
            if (isNaN(panelCount) || panelCount <= 0) {
                console.error("Valor inválido para rack:", res.data.rack);
                return;
            }

            // Crear un array de racks del 1 al rackCount
            const panelArray = Array.from({ length: rackCount }, (_, index) => ({
                name: index + 1,
                value: index + 1,
            }));

            setPanel(panelArray); // Actualizar estado correctamente

            // Asegurar que res.data.rack es un número válido
            const boxCount = Number(res.data.box);
            if (isNaN(boxCount) || boxCount <= 0) {
                console.error("Valor inválido para rack:", res.data.rack);
                return;
            }

            // Crear un array de racks del 1 al rackCount
            const boxArray = Array.from({ length: rackCount }, (_, index) => ({
                name: index + 1,
                value: index + 1,
            }));

            setBox(boxArray); // Actualizar estado correctamente
        } catch (error) {
            console.error("Error obteniendo ubicaciones:", error);
        }
    }

    // obtener del backend
    async function getDepartaments() {
        const res = await axios.get(route("departamento.selectDepartamento"),{
            params: {
                country_id: 48
            }
        });
        setSelectDepartaments(res.data.departamentos);
    }
    async function getCities() {
        const res = await axios.post(route("ciudad.ciudades"), {
            id_departamento: getValues("dep_id"),
        });
        setSelectCities(res.data);
    }
    async function getBuildings() {
        if(!getValues("ciu_id")) {
            return
        }
        const res = await axios.get(route("physicalspace.select"), {
            params: {
                ciu_id: getValues("ciu_id"),
                typeData: 'todos',
            }
        });
        setBuildings(res.data);
    }

    async function getBuildingsUbications() {
        if(!getValues("building")) {
            return
        }
        const res = await axios.get(route("physicalspace.floor-select"), {
            params: {
                physical_space_name: getValues("building"),
                typeData: 'todos',
            }
        });
        setBuildingsUbications(res.data);
    }
    async function getBuildingsFilesAreas() {
        if(!getValues("floor")) {
            return
        }
        const res = await axios.get(route("physicalspace.filesareas-select"), {
            params: {
                physical_space_name: getValues("building"),
                physical_space_floor: getValues("floor"),
                typeData: 'todos',
            }
        });
        setFilesAreas(res.data);
    }
    // end obtener del backend

    async function submit(data) {
        setIsLoading(true)
        let observation_con = data.observation_con
        try {
            data.exp_files_ids = exp_files_ids.map(i => i.id)
            delete data.observation_con
            const res = await axios.post(route('exp-files-archived.store'),data)
            onSearch({
                observation_con: observation_con
            })
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    function resetVals() {
        let values = getValues()

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                setValue(key,null);
            }
        }
        onSetValues(getValues());
    }

    return (
        <form onSubmit={handleSubmit(submit)}
            className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
        >
            <hr className='md:col-span-3' />

            <span className="flex flex-col">
                <label htmlFor="username">
                    {
                        translations.archive_gestion.physicalSpace
                            .form.dep_id
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="id"
                    optionLabel="nombre"
                    name="dep_id"
                    options={departaments}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {
                        translations.archive_gestion.physicalSpace
                            .form.ciu_id
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="id"
                    optionLabel="nombre"
                    name="ciu_id"
                    options={cities}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="building">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.name
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="name"
                    optionLabel="name"
                    name="building"
                    options={buildings}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="floor">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.floor
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="floor"
                    optionLabel="floor"
                    name="floor"
                    options={buildingsUbications}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="file_area">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.file_area
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="id"
                    optionLabel="file_area"
                    name="file_area_id"
                    options={filesAreas}
                />
            </span>

            <div className="card flex justify-center md:col-span-3 my-4">
                <div className="flex flex-column gap-3">
                    {categories.map((item) => (
                        <Controller
                            key={item.value}
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <div className="flex align-items-center">
                                    <RadioButton
                                        inputId={item.value}
                                        value={item.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        checked={field.value === item.value}
                                    />
                                    <label htmlFor={item.value} className="ml-2">
                                        {item.name}
                                    </label>
                                </div>
                            )}
                        />
                    ))}
                </div>
            </div>



            <span className="flex flex-col">
                <label htmlFor="rack">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.rack
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="value"
                    optionLabel="name"
                    name="rack"
                    options={racks}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="module">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.module
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="value"
                    optionLabel="name"
                    name="module"
                    options={module}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="panel">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.panel
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="value"
                    optionLabel="name"
                    name="panel"
                    options={panel}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="box">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.box
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    optionValue="value"
                    optionLabel="name"
                    name="box"
                    options={box}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="type_body_id">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.type_body_id
                    }
                </label>
                <DropdownG
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }}
                    disabled={true}
                    optionValue="id"
                    optionLabel="name"
                    name="type_body_id"
                    options={typesBody}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="type_body_id">
                    {
                        translations.archive_gestion
                            .physicalSpace.form.unity_conservation
                    }
                </label>
                <InputText { ...register('unity_conservation',{ required: translations.validation.attributes.field_required }) } />
            </span>
            {
                withObservation &&
                <span className="flex flex-col md:col-span-3">
                    <label htmlFor="type_body_id">
                        {
                            translations.archive_gestion.disposition_final.modal_delete.observation
                        }
                    </label>
                    <InputText { ...register('observation_con',{ required: translations.validation.attributes.field_required }) } />
                </span>
            }

            <div className="md:col-span-3 flex gap-2">
                <Button label={ translations.documental_gestion.exp_files.add } className='col-span-2' size='small'/>
            </div>
        </form>
    )
}


import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { RadioButton } from 'primereact/radiobutton'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import DropdownG from '../../../components/Globals/Drodown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, clasifications, translations, current_language, typesBody }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, setError} = useForm()
    const [thirds,setThirds] = useState([])
    const [series,setSeries] = useState([])
    const [subseries,setSubseries] = useState([])
    const [typesDocs,setTypesDocs] = useState([])
    const [subseriesFiltered,setSubseriesfiltered] = useState([])
    const [departaments, setSelectDepartaments] = useState([]);
    const [cities, setSelectCities] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [filesAreas, setFilesAreas] = useState([]);
    const [buildingsUbications, setBuildingsUbications] = useState([]);
    const [racks, setRacks] = useState([])
    const [module, setModule] = useState([])
    const [panel, setPanel] = useState([])
    const [box, setBox] = useState([])

    const { setIsLoading } = useLoading();
    const serie = watch("serie");
    const subserie = watch("subserie");
    const dep_id = watch("dep_id");
    const ciu_id = watch('ciu_id')
    const building = watch('building')
    const floor = watch('floor')
    const file_area_id = watch('file_area_id')
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
    useEffect(() => {
        getThirds()
        getSeries()
        getDepartaments()
        if(id) {
            getItem(id)
        }

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
    useEffect(() => {
        setSubseriesfiltered(subseries.filter(i => {
            return i.series?.code == serie?.code
        }))
    },[serie])
    useEffect(() => {
        if(subserie) {
            setTypesDocs(subserie.type)
        }
    },[subserie])

    async function getSeries() {
        const res = await axios.get(route("dependencies.seriesSelect"))
        setSeries(res.data.series)
        setSubseries(res.data.subseries)
    }

    async function submit(data) {
        setIsLoading(true);

        try {
            const res = await axios.post(route("accumulated-fund.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("accumulated-fund.index"))
        } catch (error) {
            if(error.response.status == 422) {
                for (const key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        toast.error(error.response.data.errors[key][0])
                        setError('number',{
                            type: 'manual',
                            message: error.response.data.errors[key][0]
                        })
                    }
                }
            } else {
                toast.error(translations.auth.error)
            }
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("accumulated-fund.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
        console.log(serie,subseries);

        setSubseriesfiltered(subseries.filter(i => {
            return i.series?.code == serie?.code
        }))
    }

    async function getThirds() {
        const res = await axios.get(route("third.list", {
            typeData: 'todos'
        }))
        setThirds(res.data)
    }

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

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("accumulated-fund.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 lg:grid-cols-5 items-end'
                    >
                        <h2 className='md:col-span-5 font-bold'>{ translations.menu.archive_gestion.accumulated_funds }</h2>
                        <hr className='md:col-span-5' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.number }</label>
                            <InputText { ...register("number",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.number,'w-full':true }} />
                            {errors?.number && (
                                <span className="text-red-600">{errors.number?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.word }</label>
                            <InputText { ...register("word") } className={{ 'p-invalid': errors?.word,'w-full':true }} />
                            {errors?.word && (
                                <span className="text-red-600">{errors.word?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.subject }</label>
                            <InputText { ...register("subject") } className={{ 'p-invalid': errors?.subject,'w-full':true }} />
                            {errors?.subject && (
                                <span className="text-red-600">{errors.subject?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.remi_desti_id }</label>
                            <DropdownG options={thirds} optionLabel='name_social_reason_sender' optionValue='id' control={control} name="remi_desti_id" />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.serie }</label>
                            <DropdownG options={series} optionLabel='name' optionValue={null} control={control} name="serie" />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.subserie }</label>
                            <DropdownG options={subseriesFiltered} optionLabel='name' optionValue={null} control={control} name="subserie" />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.archive_gestion.accumulated_fund.form.type_document }</label>
                            <DropdownG options={typesDocs} optionLabel='name' optionValue={i => i} control={control} name="type_document" />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.clasification_id }</label>
                            <Controller
                                name="clasification_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown  options={clasifications} optionLabel={'name_'+current_language} optionValue='id' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>

                        <h2 className='md:col-span-5 font-bold'>{ translations.archive_gestion.accumulated_fund.form.physical_location }</h2>
                        <hr className='md:col-span-5' />

                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {
                                    translations.archive_gestion.physicalSpace
                                        .form.dep_id
                                }
                            </label>
                            <DropdownG
                                control={control}
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
                                optionValue="id"
                                optionLabel="file_area"
                                name="file_area_id"
                                options={filesAreas}
                            />
                        </span>

                        <div className="card flex justify-center md:col-span-5 my-4">
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
                            <InputText { ...register('unity_conservation') } />
                        </span>

                        <div className="md:col-span-5">
                            <Button label={ translations.configuration.trd.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

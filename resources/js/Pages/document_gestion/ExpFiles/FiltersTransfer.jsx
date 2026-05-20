import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DropdownG from "../../../components/Globals/Drodown";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations, clasifications, currentLocale, users } = usePage()?.props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, reset} = useForm({
        defaultValues: defaultVals
    })
    const [series,setSeries] = useState([])
    const [subseries,setSubseries] = useState([])
    const [subseriesFiltered,setSubseriesfiltered] = useState([])
    const [dependencies,setDependencies] = useState([])
    const [states,setStates] = useState([
        {
            name: translations.archive_gestion.physicalSpace.table.state.archived,
            value: 4
        },
        {
            name: translations.documental_gestion.exp_files.table.state_transfer[1],
            value: 1
        },
        {
            name: translations.documental_gestion.exp_files.table.state_transfer[2],
            value: 2
        },
        {
            name: translations.documental_gestion.exp_files.table.state_transfer[3],
            value: 3
        },
        {
            name: translations.documental_gestion.exp_files.table.state_transfer[0],
            value: 0
        },
    ])
    const [typesArchive,setTypesArchive] = useState([
        {
            name: translations.documental_gestion.exp_files.table.type_archive_state.first,
            value: 1
        },
        {
            name: translations.documental_gestion.exp_files.table.type_archive_state.second,
            value: 2
        },
    ])

    const serie = watch("serie");
    useEffect(() => {
        getSeries()
        getDependencies()
    },[])
    async function submit(data) {
        onSearch(data)
        onSetValues(data)
    }

    useEffect(() => {
        setSubseriesfiltered(subseries.filter(i => {
            return i.series?.code == serie?.code
        }))
    },[serie])

    async function getSeries() {
        const res = await axios.get(route("dependencies.seriesSelect"))
        setSeries(res.data.series)
        setSubseries(res.data.subseries)
    }

    async function getDependencies() {
        const res = await axios.get(route("dependencies.list"),{
            params: {
                typeData: 'todos',
                only_unit_admin: true
            }
        })
        setDependencies(res.data)
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
            <h2 className='md:col-span-3 font-bold'>{ translations.configuration.provider.title }</h2>
            <hr className='md:col-span-3' />
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.table.number }</label>
                <InputText { ...register("number") } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                {errors?.name && (
                    <span className="text-red-600">{errors.name?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.name }</label>
                <InputText { ...register("name") } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                {errors?.name && (
                    <span className="text-red-600">{errors.name?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.dependency_id }</label>
                <Controller
                    name="dependency_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={dependencies} optionLabel='name' optionValue='id' filter
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
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.table.creado_por_id }</label>
                <DropdownG control={control} name="creador_por_id" optionLabel='persona.nombre' options={users} optionValue='id' />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.auth.init_date }</label>
                <InputText type="date" { ...register("created_at_init") } />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.auth.end_date }</label>
                <InputText type="date" { ...register("created_at_end") } />
            </span>

            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.serie }</label>
                <Controller
                    name="serie"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={series} optionLabel='name'
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
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.subserie }</label>
                <Controller
                    name="subserie"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={subseriesFiltered} optionLabel='name' filter
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
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.table.type_archive }</label>
                <DropdownG control={control} name="type_archive" optionLabel='name' options={typesArchive} optionValue='value' />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.auth.state_table }</label>
                <DropdownG control={control} name="state_transfer" optionLabel='name' options={states} optionValue='value' />
            </span>


            <div className="md:col-span-3 flex gap-2">
                <Button label={ translations.auth.search } className='col-span-2' size='small'/>
                <Button type="button" label={ translations.auth.clean } onClick={resetVals} severity="secondary" className='col-span-2' size='small'/>
            </div>
        </form>
    )
}

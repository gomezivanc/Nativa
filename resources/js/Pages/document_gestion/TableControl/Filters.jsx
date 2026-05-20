import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations, clasifications, currentLocale  } = usePage()?.props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, reset} = useForm({
        defaultValues: defaultVals
    })
    const [series,setSeries] = useState([])
    const [subseries,setSubseries] = useState([])
    const [subseriesFiltered,setSubseriesfiltered] = useState([])
    const [dependencies,setDependencies] = useState([])

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
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.date_init }</label>
                <InputText type='date' { ...register("date_init") } className={{ 'p-invalid': errors?.date_init,'w-full':true }} />
                {errors?.name && (
                    <span className="text-red-600">{errors.date_init?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.clasification_id }</label>
                <Controller
                    name="clasification_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={clasifications} optionLabel={'name_'+currentLocale} optionValue='id' filter
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
                <label htmlFor="username">{ translations.documental_gestion.exp_files.form.exist_p }</label>
                <Controller
                    name="exist_p"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <InputSwitch trueValue={1} falseValue={0}
                                checked={field.value}
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
                <label htmlFor="username">{ translations.auth.init_date }</label>
                <InputText type="date" { ...register("created_at_init") } />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.auth.end_date }</label>
                <InputText type="date" { ...register("created_at_end") } />
            </span>
            {/* <span className="flex flex-col">
                <Controller
                    name="active"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex items-center gap-2">
                            <InputSwitch trueValue={true} falseValue={false} checked={field.value} onChange={field.onChange} />
                            <span>{ field.value ? 'Activo' : 'Inactivo' }</span>
                        </div>
                    )}
                    />
            </span> */}
            <div className="md:col-span-3 flex gap-2">
                <Button label={ translations.auth.search } className='col-span-2' size='small'/>
                <Button type="button" label={ translations.auth.clean } onClick={resetVals} severity="secondary" className='col-span-2' size='small'/>
            </div>
        </form>
    )
}

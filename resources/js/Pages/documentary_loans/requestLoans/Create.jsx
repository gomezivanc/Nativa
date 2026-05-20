
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { MultiSelect } from 'primereact/multiselect'
import { Column } from 'primereact/column'

export default function Index({ id, clasifications, translations,currentLocale, sub_exp }) {
    // form create
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()

    // form array
    const { register: registerA,handleSubmit: handleSubmitA,getValues: getValuesA,formState: {
        errors: errorsA,
    },setValue: setValueA,control: controlA, watch: watchA, reset: resetA} = useForm()

    const AformRef = useRef()

    const [series,setSeries] = useState([])
    const [subseries,setSubseries] = useState([])
    const [dependencies,setDependencies] = useState([])
    const [subseriesFiltered,setSubseriesfiltered] = useState([])
    const [users,setUsers] = useState([])
    const [sub_exp_view,setSub_exp] = useState(false)
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "sub_exps", // unique name for your Field Array
    });

    const add_subfile = watch("add_subfile");
    const serie = watch("serie");
    const dependency_id = watch("dependency_id");

    useEffect(() => {
        if(id) {
            getItem(id)
        }

        if(sub_exp) {
            setSub_exp(true)
        }

        getSeries()
        getDependencies()
    },[])
    useEffect(() => {
        setSubseriesfiltered(subseries.filter(i => {
            return i.series?.code == serie?.code
        }))
    },[serie])
    useEffect(() => {
        getUsers()
    },[dependency_id])

    async function submit(data) {
        try {
            const res = await axios.post(route("files-exp.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("files-exp.index"))
        } catch (error) {
            console.error(error);

            toast.error(translations.auth.error)
        }finally{

        }
    }

    async function submitA(data) {
        append(data)
        resetA()
    }

    async function getItem(id) {
        const res = await axios.get(route("files-exp.show",id))
        let sub_exp = res.data.sub_exp
        delete res.data.sub_exp
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }

        setValue('serie',res.data.serie)
        setValue('subserie',res.data.subserie)
        setValue('dependencies',res.data.dependencies.map(i => i.dependency_id))
        sub_exp.forEach((s) => {
            s.dependency_id = s.dependencies.map(d => d.dependency_id)
            delete s.dependency
            append(s)
        })

        // if(res.data.subserie) {
        //     setSubseriesfiltered(res.data.subserie.filter(i => {
        //         return i.series?.code == serie?.code
        //     }))
        // }
    }

    async function getSeries() {
        const res = await axios.get(route("dependencies.seriesSelect"))
        setSeries(res.data.series)
        setSubseries(res.data.subseries)
    }

    async function getUsers() {
        if(!dependency_id) {
            return
        }
        const res = await axios.get(route("usuarios.getUsers"),{
            params: {
                by_dependency: dependency_id
            }
        })

        setUsers(res.data)
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

    function deleteItem(i) {
        remove(i);
    }

    return (
        <div>
            <div className='md:px-20'>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("files-exp.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)} ref={AformRef}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.documental_gestion.exp_files.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.name }</label>
                            <InputText disabled={sub_exp_view} { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.date_init }</label>
                            <InputText disabled={sub_exp_view} type='date' { ...register("date_init",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.date_init,'w-full':true }} />
                            {errors?.date_init && (
                                <span className="text-red-600">{errors.date_init?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.exist_p }</label>
                            <Controller
                                name="exist_p"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputSwitch disabled={sub_exp_view} trueValue={1} falseValue={0}
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
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.description }</label>
                            <InputTextarea disabled={sub_exp_view} { ...register("description",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.description,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.description?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.serie }</label>
                            <Controller
                                name="serie"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown disabled={sub_exp_view} options={series} optionLabel='name'
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
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown disabled={sub_exp_view} options={subseriesFiltered} optionLabel='name' filter
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
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.clasification_id }</label>
                            <Controller
                                name="clasification_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown disabled={sub_exp_view} options={clasifications} optionLabel={'name_'+currentLocale} optionValue='id' filter
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

                        <h3 className='md:col-span-3 font-bold text-lg mt-5'>{ translations.documental_gestion.exp_files.form.responsible }</h3>
                        <hr  className='md:col-span-3 mb-5'/>

                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.dependency_id }</label>
                            <Controller
                                name="dependency_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown disabled={sub_exp_view} options={dependencies} optionLabel='name' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.responsible_id }</label>
                            <Controller
                                name="responsible_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown disabled={sub_exp_view} options={users} optionLabel={i => `${i.persona.nombre} ${(i.persona.apellido) ? i.persona.apellido : ''}`} optionValue='id' filter
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

                        <h3 className='md:col-span-3 font-bold text-lg mt-5'>{ translations.documental_gestion.exp_files.form.dependency }</h3>
                        <hr  className='md:col-span-3 mb-5'/>

                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.dependency_id }</label>
                            <Controller
                                name="dependencies"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState })     => (
                                    <>
                                        <MultiSelect disabled={sub_exp_view} options={dependencies} optionLabel='name' optionValue='id' filter
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

                        <h3 className='md:col-span-3 font-bold text-lg mt-5'>{ translations.documental_gestion.exp_files.form.new_sub_exp }</h3>
                        <hr  className='md:col-span-3 mb-5'/>

                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.add_subfile }</label>
                            <Controller
                                name="add_subfile"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputSwitch disabled={sub_exp_view} trueValue={1} falseValue={0}
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
                    </form>
                    {
                        add_subfile == 1 && <>
                            <DataTable value={fields} className='md:col-span-3'>
                                <Column header={ translations.documental_gestion.exp_files.table.name } field="name"></Column>
                                <Column header={ translations.documental_gestion.exp_files.form.description } field="description"></Column>
                                <Column header={ translations.documental_gestion.exp_files.form.exist_p } field="exist_p"></Column>
                                <Column header={ translations.documental_gestion.exp_files.form.actions }
                                    body={(i,index) => (
                                        <div className='flex gap-2'>
                                            <Button icon="pi pi-trash" tooltip="Borrar" severity='danger' onClick={() => deleteItem(index.rowIndex)} />
                                        </div>
                                    )}
                                >

                                </Column>
                            </DataTable>

                            <form onSubmit={ handleSubmitA(submitA) } className='grid md:grid-cols-3 gap-2 md:col-span-3'>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.documental_gestion.exp_files.form.name }</label>
                                    <InputText { ...registerA("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errorsA?.name,'w-full':true }} />
                                    {errorsA?.name && (
                                        <span className="text-red-600">{errorsA.name?.message}</span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.documental_gestion.exp_files.form.name }</label>
                                    <InputText type='date' { ...registerA("date_init",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errorsA?.date_init,'w-full':true }} />
                                    {errorsA?.name && (
                                        <span className="text-red-600">{errorsA.date_init?.message}</span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.documental_gestion.exp_files.form.exist_p }</label>
                                    <Controller
                                        name="exist_p"
                                        control={controlA}
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
                                <span className="flex flex-col md:col-span-3">
                                    <label htmlFor="username">{ translations.documental_gestion.exp_files.form.description }</label>
                                    <InputTextarea { ...registerA("description",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errorsA?.description,'w-full':true }} />
                                    {errorsA?.name && (
                                        <span className="text-red-600">{errorsA.description?.message}</span>
                                    )}
                                </span>
                                <span className="flex flex-col md:col-span-3">
                                    <label htmlFor="username">{ translations.documental_gestion.exp_files.form.dependency_id }</label>
                                    <Controller
                                        name="dependency_id"
                                        control={controlA}
                                        rules={{ required: translations.validation.attributes.field_required }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <MultiSelect options={dependencies} optionLabel='name' optionValue='id' filter
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
                                <div className="md:col-span-3 text-end">
                                    <Button label={ translations.documental_gestion.exp_files.add } className='col-span-2' size='small'/>
                                </div>
                            </form>
                        </>
                    }

                    <div className="md:col-span-3 mt-2">
                        <Button label={ translations.documental_gestion.exp_files.add } onClick={() => {
                            const event = new Event('submit', { bubbles: true, cancelable: true });
                            AformRef.current.dispatchEvent(event);
                        }} type='button' className='col-span-2' size='small'/>
                    </div>
                </Card>
            </div>
        </div>
    )
}


import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { Children, useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { typeOptions } from "@/components/models/typeOptions";
import { typeTargets } from "@/components/models/typeTargets";
import { iconList } from "@/components/models/iconList";
import { TreeSelect } from 'primereact/treeselect';
import { useLoading } from '../../Context/preloadContext'



export default function Index({ id, services,translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control,watch} = useForm()


    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getRoutes();
        getParent();
    },[])
    const [routes,setRoutes] = useState([]);
    const [parent,setParent] = useState([]);
    const [loaging,setLoading] = useState(false);
    const { setIsLoading } = useLoading();
    async function submit(data) {
        setIsLoading(true)
        try {
            setLoading(true);
            if(id){
                const res = await axios.post(
                    route("menus.update", id),
                    data
                );
            }else{
                const res = await axios.post(route("menus.store"),data)
            }
            
            toast.success(translations.auth.success)
            router.visit(route("menus.index"))
        } catch (error) {
            if(error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error)
            }
        }finally{
            setLoading(false);
            setTimeout(()=>{
                setIsLoading(false);
            },1000);
        }
    }


    async function getRoutes() {
        const res = await axios.get(route("routes.index"))
        setRoutes(res.data);
    }
    async function getParent() {
        try {
            const res = await axios.get(route("menus.all"));

            // Asegúrate de que los datos sean un array
            if (!Array.isArray(res.data)) {
                throw new Error("La respuesta del servidor no es un array.");
            }

            function transformNode(node) {
                return {
                    ...node,
                    key: node.id,
                    label: node.title,
                    children: Array.isArray(node.children) ? node.children.map(transformNode) : [], // Valida que children sea un array
                };
            }

            const transformedData = res.data.map(transformNode); // Aplica la función recursiva
            setParent(transformedData); // Actualiza el estado
        } catch (error) {
            console.error("Error al obtener los datos del servidor:", error.message);
        }
    }
    async function getItem(id) {
        const res = await axios.get(route("menus.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    return (
        <div>
            <div>
                <Card header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("menus.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.administration.menu.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="title">{ translations.administration.menu.form.title }</label>
                            <InputText { ...register("title",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.title && (
                                <span className="text-red-600">{errors.title?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.administration.menu.form.type }</label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={typeOptions}
                                         placeholder={translations.auth.select_opcion}
                                         showClear
                                            optionLabel='title' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.administration.menu.form.url }</label>
                            <Controller
                                name="uri"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                         placeholder={translations.auth.select_opcion}
                                         showClear
                                            options={routes}
                                            optionLabel='name' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.administration.menu.form.parent }</label>
                            <Controller
                                name="parent_id"
                                control={control}

                                render={({ field, fieldState }) => (
                                    <>
                                         <div className="card flex justify-content-center">
                                                <TreeSelect
                                                    placeholder={translations.auth.select_opcion}
                                                    filter
                                                    inputId="treeselect" value={field.value} onChange={(e) => field.onChange(e.value)} options={parent}
                                                    className="w-full"
                                                    showClear
                                                    ></TreeSelect>
                                        </div>
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>
                                )}
                            />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.administration.menu.form.target }</label>
                            <Controller
                                name="target"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={typeTargets}
                                            placeholder={translations.auth.select_opcion}
                                            showClear
                                            optionLabel='title' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.administration.menu.form.icon }</label>
                            <Controller
                                name="icon"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            showClear
                                            placeholder={translations.auth.select_opcion}
                                            options={iconList}
                                            withIcons={true}
                                            optionLabel='name' optionValue='id' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                            itemTemplate={(option) => (
                                                <div className="flex items-center">
                                                    <i className={`${option.id} mr-2`} /> {/* Renderiza el ícono */}
                                                    <span>{option.name}</span> {/* Muestra el nombre del ícono */}
                                                </div>
                                            )}
                                            valueTemplate={(option, props)=>{
                                                if(option){
                                                    return (
                                                        <div className="flex items-center">
                                                            <i className={`${option.id} mr-2`} /> {/* Renderiza el ícono */}
                                                            <div>{option.name}</div>
                                                        </div>
                                                    );
                                                }
                                                return <span>{props.placeholder}</span>;
                                            }}
                                        />

                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        <div className="md:col-span-3">
                            <Button loading={loaging} label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

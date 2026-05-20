
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, services, translations, typePerson,current_language }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();
    const [departaments,setSelectDepartaments] = useState([])
    const [cities,setCities] = useState([])
    const [countries,setCountries] = useState([])
    const countryId = watch('country_id')
    const departament_id = watch('department_id')

    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getCountries()
    },[])

    useEffect(() => {
        if(countryId) {
            getDepartaments(countryId)
        }
    },[countryId])
    useEffect(() => {
        if(departament_id) {
            getCities(departament_id)
        }
    },[departament_id])

    async function getCountries() {
        const res = await axios.get(route("regional.countries"))
        setCountries(res.data)
    }
    async function getDepartaments(countryId) {

        try {
            const res = await axios.get(route("departamento.selectDepartamento"), {
                params: {
                    country_id: countryId,
                }
            });

            if (res.data.departamentos && res.data.departamentos.length > 0) {
                setSelectDepartaments(res.data.departamentos);
            } else {
                // Mostrar toast si no hay resultados
                setSelectDepartaments([]);
                toast.error(translations.auth.no_data);
            }
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
            toast.error(translations.auth.error);
        }
    }

    async function getCities(departament_id) {
        const res = await axios.get(route("ciudad.selectCiudad"),{
            params: {
                id_departamento: departament_id,
            }
        })
        setCities(res.data.ciudades)
    }

    async function submit(data) {
        setIsLoading(true);

        try {
            const res = await axios.post(route("third.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("third.index"))
        } catch (error) {
            toast.error(translations.auth.error)
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("third.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("third.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.provider.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="type_person_id_sender">{ translations.filing.standard_filing.form.type_person }</label>
                            <Controller
                                name="type_person_id_sender"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={typePerson} optionLabel={'name_'+current_language} optionValue='id' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder={ translations.filing.standard_filing.form.type_person }
                                            className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="name_social_reason_sender">{ translations.filing.standard_filing.form.name_social_reason_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.name_social_reason_sender } type='text' { ...register("name_social_reason_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name_social_reason_sender,'w-full':true }} />
                            {errors?.name_social_reason_sender && (
                                <span className="text-red-600">{errors.name_social_reason_sender?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="first_surname_legal_representative_sender">{ translations.filing.standard_filing.form.first_surname_legal_representative_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.first_surname_legal_representative_sender } type='text' { ...register("first_surname_legal_representative_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.first_surname_legal_representative_sender,'w-full':true }} />
                            {errors?.first_surname_legal_representative_sender && (
                                <span className="text-red-600">{errors.first_surname_legal_representative_sender?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="document_nit_sender">{ translations.filing.standard_filing.form.document_nit_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.document_nit_sender } type='text' { ...register("document_nit_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.document_nit_sender,'w-full':true }} />
                            {errors?.document_nit_sender && (
                                <span className="text-red-600">{errors.document_nit_sender?.message}</span>
                            )}
                        </span>

                        <span className="flex flex-col md:col-span-2">
                            <label htmlFor="country_id">{ translations.filing.standard_filing.form.country_id }</label>
                            <Controller
                                name="country_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={countries} optionLabel='name' optionValue='id' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder={ translations.filing.standard_filing.form.country_id }
                                            className={{ 'p-invalid': fieldState.error, 'w-full ': true }}

                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        <span className="flex flex-col ">
                            <label htmlFor="departament_id">{ translations.filing.standard_filing.form.department_id }</label>
                            <Controller
                                name="department_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={departaments} optionLabel='nombre' optionValue='id' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder={ translations.filing.standard_filing.form.department_id }
                                            className={{ 'p-invalid': fieldState.error, 'w-full ': true }}

                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        <span className="flex flex-col ">
                            <label htmlFor="city_id">{ translations.filing.standard_filing.form.city_id }</label>
                            <Controller
                                name="city_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={cities} optionLabel='nom_ciudad' optionValue='id_ciudad' filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder={ translations.filing.standard_filing.form.city_id }
                                            className={{ 'p-invalid': fieldState.error, 'w-full ': true }}

                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="address_sender">{ translations.filing.standard_filing.form.address_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.address_sender } type='text' { ...register("address_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.address_sender,'w-full':true }} />
                            {errors?.address_sender && (
                                <span className="text-red-600">{errors.address_sender?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="phone_sender">{ translations.filing.standard_filing.form.phone_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.phone_sender } type='text' { ...register("phone_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.phone_sender,'w-full':true }} />
                            {errors?.phone_sender && (
                                <span className="text-red-600">{errors.phone_sender?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="email_sender">{ translations.filing.standard_filing.form.email_sender }</label>
                            <InputText placeholder={ translations.filing.standard_filing.form.email_sender } type='email' { ...register("email_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.email_sender,'w-full':true }} />
                            {errors?.email_sender && (
                                <span className="text-red-600">{errors.email_sender?.message}</span>
                            )}
                        </span>

                        <div className="md:col-span-3">
                            <Button label={ translations.configuration.trd.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

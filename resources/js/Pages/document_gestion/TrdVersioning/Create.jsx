
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

export default function Index({ id, masks, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control} = useForm()
    const { setIsLoading } = useLoading();
    const watchedValues = useWatch({
        control, // El control del formulario
        name: ["has_regional", "conf_days_term", "has_standard", "Has_support","conf_mask_trd_id"], // Lista de campos a observar
    });


    const [hasRegionalValue, confDaysTermValue, hasStandardValue, hasSupportValue, confMaskTrdId] = watchedValues;

    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("trd.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("trd.index"))
        } catch (error) {
            toast.error(translations.auth.error)
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

    }

    async function getItem(id) {
        const res = await axios.get(route("trd.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
        setChecked(res.data.activo)
    }
    const [checked,setChecked] = useState()

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("trd.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.trd.head1 }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.conf_mask_trd_id }</label>
                            <Controller
                                name="conf_mask_trd_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={masks} optionLabel='name' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.configuration.trd.form.dependency_code }</label>
                            <InputText maxLength={5} { ...register("dependency_code",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.dependency_code,'w-full':true }} />
                            {errors?.dependency_code && (
                                    <span className="text-red-600">{errors.dependency_code?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.dependency_name }</label>
                            <InputText maxLength={5} { ...register("dependency_name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.dependency_name,'w-full':true }} />
                            {errors?.dependency_name && (
                                    <span className="text-red-600">{errors.dependency_name?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.unity_admin }</label>
                            <InputText maxLength={5} { ...register("unity_admin",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.unity_admin,'w-full':true }} />
                            {errors?.unity_admin && (
                                    <span className="text-red-600">{errors.unity_admin?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.has_regional }</label>
                            <Controller
                                name="has_regional"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputSwitch trueValue={1} falseValue={0} checked={field.value} onChange={field.onChange} />
                                )}
                                />
                        </span>
                        {
                            hasRegionalValue == 1 &&
                            <span className="flex flex-col">
                                <label htmlFor="username">{ translations.configuration.trd.form.regional }</label>
                                <InputText maxLength={5} { ...register("regional") } className={{ 'p-invalid': errors?.regional,'w-full':true }} />
                                {errors?.regional && (
                                    <span className="text-red-600">{errors.regional?.message}</span>
                                )}

                            </span>
                        }
                        <hr className='md:col-span-3 my-4' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.init_data }</label>
                            <InputText maxLength={5} { ...register("init_data",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.init_data,'w-full':true }} />
                            {errors?.init_data && (
                                    <span className="text-red-600">{errors.init_data?.message}</span>
                                )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.code_trd }</label>
                            <InputText maxLength={5} { ...register("code_trd",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.code_trd,'w-full':true }} />
                            {errors?.code_trd && (
                                    <span className="text-red-600">{errors.code_trd?.message}</span>
                                )}
                        </span>
                        {
                            confMaskTrdId == 1 && <>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.configuration.trd.form.serie }</label>
                                    <InputText maxLength={5} { ...register("serie") } className={{ 'p-invalid': errors?.serie,'w-full':true }} />
                                    {errors?.serie && (
                                            <span className="text-red-600">{errors.serie?.message}</span>
                                        )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.configuration.trd.form.subserie }</label>
                                    <InputText maxLength={5} { ...register("subserie") } className={{ 'p-invalid': errors?.subserie,'w-full':true }} />
                                    {errors?.subserie && (
                                            <span className="text-red-600">{errors.subserie?.message}</span>
                                        )}
                                </span>
                            </>
                        }
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.series_sub_series_t_doc }</label>
                            <InputText maxLength={5} { ...register("series_sub_series_t_doc",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.series_sub_series_t_doc,'w-full':true }} />
                            {errors?.series_sub_series_t_doc && (
                                    <span className="text-red-600">{errors.series_sub_series_t_doc?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_year_gestion }</label>
                            <InputText maxLength={5} { ...register("items_year_gestion",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_year_gestion,'w-full':true }} />
                            {errors?.items_year_gestion && (
                                    <span className="text-red-600">{errors.items_year_gestion?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_year_central }</label>
                            <InputText maxLength={5} { ...register("items_year_central",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_year_central,'w-full':true }} />
                            {errors?.items_year_central && (
                                    <span className="text-red-600">{errors.items_year_central?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_dispo_final_ct }</label>
                            <InputText maxLength={5} { ...register("items_dispo_final_ct",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_dispo_final_ct,'w-full':true }} />
                            {errors?.items_dispo_final_ct && (
                                    <span className="text-red-600">{errors.items_dispo_final_ct?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_dispo_final_e }</label>
                            <InputText maxLength={5} { ...register("items_dispo_final_e",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_dispo_final_e,'w-full':true }} />
                            {errors?.items_dispo_final_e && (
                                    <span className="text-red-600">{errors.items_dispo_final_e?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_dispo_final_s }</label>
                            <InputText maxLength={5} { ...register("items_dispo_final_s",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_dispo_final_s,'w-full':true }} />
                            {errors?.items_dispo_final_s && (
                                    <span className="text-red-600">{errors.items_dispo_final_s?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_dispo_final_md }</label>
                            <InputText maxLength={5} { ...register("items_dispo_final_md",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_dispo_final_md,'w-full':true }} />
                            {errors?.items_dispo_final_md && (
                                    <span className="text-red-600">{errors.items_dispo_final_md?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.items_pro_subseries }</label>
                            <InputText maxLength={5} { ...register("items_pro_subseries",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.items_pro_subseries,'w-full':true }} />
                            {errors?.items_pro_subseries && (
                                    <span className="text-red-600">{errors.items_pro_subseries?.message}</span>
                                )}

                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.conf_days_term }</label>
                            <Controller
                                name="conf_days_term"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputSwitch trueValue={1} falseValue={0} checked={field.value} onChange={field.onChange} />
                                )}
                                />
                        </span>
                        {
                            confDaysTermValue == 1 &&
                            <span className="flex flex-col">
                                <label htmlFor="username">{ translations.configuration.trd.form.days_conf_days_term }</label>
                                <InputText type="number" { ...register("days_conf_days_term") } className={{ 'p-invalid': errors?.days_conf_days_term,'w-full':true }} />
                                {errors?.days_conf_days_term && (
                                    <span className="text-red-600">{errors.days_conf_days_term?.message}</span>
                                )}

                            </span>
                        }
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.has_standard }</label>
                            <Controller
                                name="has_standard"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputSwitch trueValue={1} falseValue={0} checked={field.value} onChange={field.onChange} />
                                )}
                                />
                        </span>
                        {
                            hasStandardValue == 1 &&
                            <span className="flex flex-col">
                                <label htmlFor="username">{ translations.configuration.trd.form.item_standard }</label>
                                <InputText maxLength={5} { ...register("item_standard") } className={{ 'p-invalid': errors?.item_standard,'w-full':true }} />
                                {errors?.item_standard && (
                                    <span className="text-red-600">{errors.item_standard?.message}</span>
                                )}

                            </span>
                        }
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.trd.form.Has_support }</label>
                            <Controller
                                name="Has_support"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputSwitch trueValue={1} falseValue={0} checked={field.value} onChange={field.onChange} />
                                )}
                                />
                        </span>
                        {
                            hasSupportValue == 1 &&
                            <>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.configuration.trd.form.item_support_p }</label>
                                    <InputText maxLength={5} { ...register("item_support_p") } className={{ 'p-invalid': errors?.item_support_p,'w-full':true }} />
                                    {errors?.item_support_p && (
                                    <span className="text-red-600">{errors.item_support_p?.message}</span>
                                )}

                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.configuration.trd.form.item_support_e }</label>
                                    <InputText maxLength={5} { ...register("item_support_e") } className={{ 'p-invalid': errors?.item_support_e,'w-full':true }} />
                                    {errors?.item_support_e && (
                                    <span className="text-red-600">{errors.item_support_e?.message}</span>
                                )}

                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">{ translations.configuration.trd.form.item_support_o }</label>
                                    <InputText maxLength={5} { ...register("item_support_o") } className={{ 'p-invalid': errors?.item_support_o,'w-full':true }} />
                                    {errors?.item_support_o && (
                                    <span className="text-red-600">{errors.item_support_o?.message}</span>
                                )}

                                </span>
                            </>
                        }
                        <div className="md:col-span-3">
                            <Button label={ translations.configuration.trd.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

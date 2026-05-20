import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DropdownG from "../../../components/Globals/Drodown";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations,typeBodies } = usePage()?.props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, reset} = useForm({
        defaultValues: defaultVals
    })
    const [departaments,setSelectDepartaments] = useState([])
    const [cities,setSelectCities] = useState([])

    const dep_id = watch("dep_id");
    useEffect(() => {
        getDepartaments()
    },[])
    useEffect(() => {
        getCities()
    },[dep_id])

    async function submit(data) {
        onSearch(data)
        onSetValues(data)
    }

    async function getDepartaments() {
        const res = await axios.get(route('departamento.selectDepartamento'))
        setSelectDepartaments(res.data.departamentos)
    }
    async function getCities() {
        const res = await axios.post(route('ciudad.ciudades'),{
            id_departamento: getValues('dep_id')
        })
        setSelectCities(res.data)
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
            <label htmlFor="username">{ translations.archive_gestion.physicalSpace.form.name }</label>
                <InputText { ...register("name") } className={{ 'p-invalid': errors?.name,'w-full':true }} />

            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.archive_gestion.physicalSpace.form.floor }</label>
                <InputText type='number' { ...register("floor") } className={{ 'p-invalid': errors?.floor,'w-full':true }} />

            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.archive_gestion.physicalSpace.form.file_area }</label>
                <InputText { ...register("file_area") } className={{ 'p-invalid': errors?.file_area,'w-full':true }} />

            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.archive_gestion.physicalSpace.form.box }</label>
                <InputText type='number' { ...register("box") } className={{ 'p-invalid': errors?.box,'w-full':true }} />

            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.archive_gestion.physicalSpace.form.type_body_id }</label>
                <DropdownG control={control} options={typeBodies} optionValue='id' optionLabel='name' name="type_body_id" />
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
            </span>
            <div className="md:col-span-3 flex gap-2">
                <Button label={ translations.auth.search } className='col-span-2' size='small'/>
                <Button type="button" label={ translations.auth.clean } onClick={resetVals} severity="secondary" className='col-span-2' size='small'/>
            </div>
        </form>
    )
}

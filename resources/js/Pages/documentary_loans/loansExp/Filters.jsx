import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import DropdownG from "../../../components/Globals/Drodown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations, states, current_language, typeLoan,typeRequirements , gdDependecy } = usePage()?.props
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
                <label htmlFor="username">{ translations.request_loans.admin_loans_expfile.table.number }</label>
                <InputText { ...register("number") } classsubject={{ 'p-invalid': errors?.name,'w-full':true }} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.request_loans.admin_loans_expfile.table.name }</label>
                <InputText { ...register("name") } classsubject={{ 'p-invalid': errors?.name,'w-full':true }} />
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
                <label htmlFor="username">{ translations.request_loans.admin_loans_expfile.table.type_loan }</label>
                <DropdownG control={control} name="type_loan_id" options={typeLoan} optionLabel={'name_'+current_language} optionValue="id" classsubject={{ 'p-invalid': errors?.name,'w-full':true }} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.request_loans.request_loans.table.dependency }</label>
                <DropdownG control={control} name="dependency_id" options={gdDependecy} optionLabel={'name'} optionValue="id" classsubject={{ 'p-invalid': errors?.name,'w-full':true }} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.auth.state_table }</label>
                <DropdownG control={control} name="state_loan_id" options={states} optionLabel={'name_'+current_language} optionValue="id" classsubject={{ 'p-invalid': errors?.name,'w-full':true }} />
            </span>
            <div className="md:col-span-3 flex gap-2">
                <Button label={ translations.auth.search } className='col-span-2' size='small'/>
                <Button type="button" label={ translations.auth.clean } onClick={resetVals} severity="secondary" className='col-span-2' size='small'/>
            </div>
        </form>
    )
}

import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues, filters }) => {
    const { translations } = usePage()?.props;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
    } = useForm({
        defaultValues: defaultVals,
    });
    const [typeFiling,setTypeFiling] = useState([])
    useEffect(() => {
        getTypeFiling()
    },[])
    async function getTypeFiling() {
        const res = await axios.get(route("types-filings.list"),{
            params:{
                typeData: 'todos'
            }
        })
        setTypeFiling(res.data)
    }
    async function submit(data) {
        onSearch(data);
        onSetValues(data);
    }

    function resetVals() {
        let values = getValues();

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                setValue(key, null);
            }
        }
        onSetValues(getValues());
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-3 items-end"
        >
            <h2 className="md:col-span-3 font-bold">
                {translations.filing.standard_filing.title}
            </h2>
            <hr className="md:col-span-3" />

            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.filing.standard_filing.form.types_filing}
                </label>
                <Controller
                    name="types_filings_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                options={typeFiling}
                                optionLabel="name"
                                optionValue="id"
                                placeholder={ translations.filing.standard_filing.form.types_filing }
                                filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                className={{
                                    "p-invalid": fieldState.error,
                                    "w-full": true,
                                }}
                            />
                            {fieldState.error && (
                                <span className="text-red-600 w-full">
                                    {fieldState.error?.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="filing_number">{ translations.filing.standard_filing.table.number_filing }</label>
                <InputText type="filing_number" { ...register("filing_number") } />
            </span>
            <span className="flex flex-col">
                <label htmlFor="created_at_init">{ translations.auth.init_date }</label>
                <InputText type="date" { ...register("created_at_init") } />
            </span>
            <span className="flex flex-col">
                <label htmlFor="created_at_end">{ translations.auth.end_date }</label>
                <InputText type="date" { ...register("created_at_end") } />
            </span>
            <div className="md:col-span-3 flex gap-2">
                <Button
                    label={translations.auth.search}
                    className="col-span-2"
                    size="small"
                />
                <Button
                    type="button"
                    label={translations.auth.clean}
                    onClick={resetVals}
                    severity="secondary"
                    className="col-span-2"
                    size="small"
                />
            </div>
        </form>
    );
};

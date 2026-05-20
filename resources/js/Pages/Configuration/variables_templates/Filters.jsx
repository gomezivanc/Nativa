import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations, dependencies } = usePage()?.props;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        watch,
        reset,
    } = useForm({
        defaultValues: defaultVals,
    });
    const days = [
        { label: translations.auth.day_of_weeks.monday , value: "1" },
        { label: translations.auth.day_of_weeks.tuesday , value: "2" },
        { label: translations.auth.day_of_weeks.wednesday , value: "3" },
        { label: translations.auth.day_of_weeks.thursday , value: "4" },
        { label: translations.auth.day_of_weeks.friday , value: "5" },
        { label: translations.auth.day_of_weeks.saturday , value: "6" },
        { label: translations.auth.day_of_weeks.sunday , value: "7" },
    ]
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
                {translations.configuration.variables_templates.title}
            </h2>
            <hr className="md:col-span-3" />
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.configuration.variables_templates.form.name }</label>
                <InputText { ...register("name") } className={{ 'p-invalid': errors?.name,'w-full':true }} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.configuration.variables_templates.form.description }</label>
                <InputText { ...register("description")} className={{ 'p-invalid': errors?.description,'w-full':true }} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.auth.state_table}
                </label>
                <Controller
                    name="active"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex items-center gap-2">
                            <InputSwitch
                                trueValue={true}
                                falseValue={false}
                                checked={field.value}
                                onChange={field.onChange}
                            />
                            <span>
                                {field.value
                                    ? translations.auth.state.active
                                    : translations.auth.state.inactive}
                            </span>
                        </div>
                    )}
                />
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

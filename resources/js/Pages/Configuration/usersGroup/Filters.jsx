import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
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
                {translations.documental_gestion.dependency.title}
            </h2>
            <hr className="md:col-span-3" />
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.configuration.users_group.form.name}
                </label>
                <InputText
                    maxLength={255}
                    {...register("name")}
                    className={{ "p-invalid": errors?.name, "w-full": true }}
                />
                {errors?.name && (
                    <span className="text-red-600">{errors.name?.message}</span>
                )}
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
                <label htmlFor="username">{ translations.auth.state_table }</label>
                <Controller
                    name="active"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex items-center gap-2">
                            <InputSwitch trueValue={true} falseValue={false} checked={field.value} onChange={field.onChange} />
                            <span>{ field.value ? translations.auth.state.active : translations.auth.state.inactive }</span>
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

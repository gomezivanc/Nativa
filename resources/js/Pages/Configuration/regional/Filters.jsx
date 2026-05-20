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
    const [countries,setCountries] = useState([])
    const [departaments,setDepartaments] = useState([])
    const [cities,setCities] = useState([])
    const countryId = watch('country_id')
    const departament_id = watch('departament_id')

    async function submit(data) {
        onSearch(data);
        onSetValues(data);
    }
    useEffect(() => {
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
        const res = await axios.get(route("regional.countries"));
        setCountries(res.data);
    }
    async function getDepartaments(countryId) {
        const res = await axios.get(route("departamento.selectDepartamento"), {
            params: {
                country_id: countryId,
            },
        });
        setDepartaments(res.data.departamentos);
    }
    async function getCities(departament_id) {
        const res = await axios.get(route("ciudad.selectCiudad"), {
            params: {
                id_departamento: departament_id,
            },
        });
        setCities(res.data.ciudades);
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
                {translations.configuration.satisfaction_survey.title}
            </h2>
            <hr className="md:col-span-3" />
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.configuration.regional.form.name}
                </label>
                <InputText
                    className={{ "p-invalid": errors?.name, "w-full": true }}
                    { ...register("name") }
                />
                {errors?.name && (
                    <span className="text-red-600">{errors.name?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.configuration.regional.form.sigla}
                </label>
                <InputText
                    maxLength={5} { ...register("sigla") }
                    className={{ "p-invalid": errors?.sigla, "w-full": true }}
                />
                {errors?.sigla && (
                    <span className="text-red-600">
                        {errors.sigla?.message}
                    </span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.configuration.regional.form.country_id}
                </label>
                <Controller
                    name="country_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                options={countries}
                                optionLabel="name"
                                optionValue="id"
                                filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                className={{
                                    "p-invalid": fieldState.error,
                                    "w-full p-inputtext-sm": true,
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
                <label htmlFor="username">
                    {translations.configuration.regional.form.departament_id}
                </label>
                <Controller
                    name="departament_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                options={departaments}
                                optionLabel="nombre"
                                optionValue="id"
                                filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                className={{
                                    "p-invalid": fieldState.error,
                                    "w-full p-inputtext-sm": true,
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
                <label htmlFor="username">
                    {translations.configuration.regional.form.city_id}
                </label>
                <Controller
                    name="city_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                options={cities}
                                optionLabel="nom_ciudad"
                                optionValue="id_ciudad"
                                filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                className={{
                                    "p-invalid": fieldState.error,
                                    "w-full p-inputtext-sm": true,
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
                <label htmlFor="username">{translations.auth.init_date}</label>
                <InputText type="date" {...register("created_at_init")} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{translations.auth.end_date}</label>
                <InputText type="date" {...register("created_at_end")} />
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

import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Filters = ({ onSearch, defaultVals = {}, onSetValues }) => {
    const { translations } = usePage()?.props;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        reset
    } = useForm({
        defaultValues: defaultVals,
    });
    const [getRole, setRole] = useState([]);
    const [getDependency, setGetDependency] = useState([]);
    const [regionals,setRegionals] = useState([])

    useEffect(() => {
        getRoles();
        getDependencies();
        getRegionals()
    }, []);

    async function submit(data) {
        onSearch(data);
        onSetValues(data);
    }

    function resetVals() {
        const cleanValues = {
            user: "",
            role_id: null,
            dependency_id: null,
            created_at_init: null,
            created_at_end: null,
            active: null
        };

        reset(cleanValues);

        onSetValues(cleanValues);
    }
    async function getRoles() {
        try {
            const res = await axios.get(route("roles.list"), {
                params: {
                    typeData: "todos",
                },
            });
            setRole(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
    }
    async function getDependencies() {
        try {
            const res = await axios.get(route("dependencies.list"), {
                params: {
                    typeData: "todos",
                },
            });

            setGetDependency(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
    }

    async function getRegionals() {
        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setRegionals(res.data)
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-3 items-end"
        >
            <hr className="md:col-span-3" />
            <span className="flex flex-col">
                <label htmlFor="username">
                {translations.administration.user.form.user}
                </label>
                <InputText
                    className={{ "p-invalid": errors?.name, "w-full": true }}
                    { ...register("user") }
                />
                {errors?.name && (
                    <span className="text-red-600">{errors.name?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label>
                    {translations.administration.user.form.role}
                </label>

                <Controller
                    name="role_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                filter
                                options={getRole}
                                optionLabel="name"
                                optionValue="id"
                                placeholder={translations.auth.select_opcion}
                            />

                            {fieldState.error && (
                                <span className="text-red-600">
                                    {fieldState.error.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.administration.user.form.dependency}
                </label>
               <Controller
                    name="dependency_id"
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                            {...field}
                            onChange={(e) => field.onChange(e.value)}
                            value={field.value}
                            filter
                            options={getDependency}
                            optionLabel="name"
                            optionValue="id"
                            placeholder={translations.auth.select_opcion}
                        />
                    )}
                />

                {errors?.dependency_id && (
                    <span className="text-red-600">
                        {errors.dependency_id?.message}
                    </span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">{ translations.configuration.provider.form.regional_id }</label>
                <Controller
                    name="regional_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                options={regionals}
                                placeholder={
                                    translations.auth.select_opcion
                                }
                                optionLabel='name'
                                optionValue='id'
                                filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                            />
                            {
                                fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
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

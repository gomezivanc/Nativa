import { useForm, Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "@inertiajs/react";

export default function Create({ id }) {
    const { translations } = usePage().props;

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            response_time: null,
        },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(route("procedure-management.show", id)).then((res) => {
                const { name, response_time } = res.data;
                setValue("name", name);
                setValue("response_time", Number(response_time));
            });
        }
    }, [id]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post(route("procedure-management.store"), {
                ...data,
                id: id ?? null,
            });
            toast.success(translations.auth.success);
            router.visit(route("procedure-management.index"));
        } catch (err) {
            toast.error(translations.auth.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:px-20 py-4">
            <div className='py-2 flex gap-1 flex-col'>
                <div>
                    <Link href={route("procedure-management.index")}>
                        <Button label={translations.auth.back} size="small" />
                    </Link>
                </div>
            </div>

            <Card
                title={
                    id
                        ? translations.configuration.procedure_management.edit_title
                        : translations.configuration.procedure_management.create_title
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-4 grid-cols-1 md:grid-cols-2"
                >
                    {/* Nombre tramite */}
                    <span className="flex flex-col">
                        <label>
                            {
                                translations.configuration.procedure_management.form.name
                            }
                        </label>
                        <Controller
                            name="name"
                            disabled={!!id}
                            control={control}
                            rules={{
                                required:
                                    translations.validation.attributes
                                        .field_required,
                            }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    className={
                                        errors.name
                                            ? "p-invalid w-full"
                                            : "w-full"
                                    }
                                />
                            )}
                        />
                        {errors.name && (
                            <small className="text-red-600">
                                {errors.name.message}
                            </small>
                        )}
                    </span>

                    {/* Tiempo de respuesta */}
                    <span className="flex flex-col">
                        <label>
                            {translations.configuration.procedure_management.form.response_time}
                        </label>
                        <Controller
                            name="response_time"
                            control={control}
                            rules={{
                                required: translations.validation.attributes.field_required,
                            }}
                            render={({ field }) => (
                                <InputNumber
                                    value={field.value}
                                    onValueChange={(e) => field.onChange(e.value)}
                                    className={errors.response_time ? "p-invalid w-full" : "w-full"}
                                    useGrouping={false}
                                />
                            )}
                        />
                        {errors.response_time && (
                            <small className="text-red-600">
                                {errors.response_time.message}
                            </small>
                        )}
                    </span>

                    {/* Botón */}
                    <div className="md:col-span-2">
                        <Button
                            type="submit"
                            label={translations.auth.save}
                            icon="pi pi-save"
                            loading={loading}
                            className="w-full md:w-auto"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

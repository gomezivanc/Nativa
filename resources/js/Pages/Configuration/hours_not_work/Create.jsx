import { useForm, Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/es";

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
            date: null,
            reason: "",
            is_recurring: false,
        },
    });

    const [loading, setLoading] = useState(false);
    const selectedDate = watch("date");
    const dayName = selectedDate
        ? dayjs(selectedDate).locale("es").format("dddd")
        : "";

    useEffect(() => {
        if (id) {
            axios.get(route("hours-not-work.show", id)).then((res) => {
                const { date, reason, is_recurring } = res.data;
                setValue("date", new Date(date));
                setValue("reason", reason);
                setValue("is_recurring", is_recurring);
            });
        }
    }, [id]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post(route("hours-not-work.store"), {
                ...data,
                id: id ?? null,
                date: data.date.toISOString().split("T")[0], // <-- aquí el fix
            });
            toast.success(translations.auth.success);
            router.visit(route("hours-not-work.index"));
        } catch (err) {
            toast.error(translations.auth.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:px-20 py-4">
            <Card
                title={
                    id
                        ? translations.configuration.hours_not_work.edit_title
                        : translations.configuration.hours_not_work.create_title
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-4 grid-cols-1 md:grid-cols-2"
                >
                    {/* Fecha */}
                    <span className="flex flex-col">
                        <label>
                            {
                                translations.configuration.hours_not_work.form
                                    .date
                            }
                        </label>
                        <Controller
                            name="date"
                            control={control}
                            rules={{
                                required:
                                    translations.validation.attributes
                                        .field_required,
                            }}
                            render={({ field }) => (
                                <Calendar
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                    className={
                                        errors.date
                                            ? "p-invalid w-full"
                                            : "w-full"
                                    }
                                />
                            )}
                        />
                        {errors.date && (
                            <small className="text-red-600">
                                {errors.date.message}
                            </small>
                        )}
                    </span>

                    {/* Día de la semana */}
                    <span className="flex flex-col">
                        <label>
                            {
                                translations.configuration.hours_not_work.form
                                    .day_of_week
                            }
                        </label>
                        <InputText
                            value={dayName}
                            disabled
                            className="w-full bg-gray-100"
                        />
                    </span>

                    {/* Motivo */}
                    <span className="flex flex-col md:col-span-2">
                        <label>
                            {
                                translations.configuration.hours_not_work.form
                                    .reason
                            }
                        </label>
                        <Controller
                            name="reason"
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
                                        errors.reason
                                            ? "p-invalid w-full"
                                            : "w-full"
                                    }
                                />
                            )}
                        />
                        {errors.reason && (
                            <small className="text-red-600">
                                {errors.reason.message}
                            </small>
                        )}
                    </span>

                    {/* Recurrente */}
                    <span className="flex items-center gap-2 md:col-span-2">
                        <Controller
                            name="is_recurring"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    inputId="recurring"
                                    onChange={(e) => field.onChange(e.checked ? 1 : 0)}
                                    checked={field.value === 1}
                                />
                            )}
                        />
                        <label htmlFor="recurring">
                            {
                                translations.configuration.hours_not_work.form
                                    .is_recurring
                            }
                        </label>
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

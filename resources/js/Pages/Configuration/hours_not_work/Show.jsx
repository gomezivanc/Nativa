import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { usePage } from "@inertiajs/react";

export default function ({ data: horario, creadorNombre = "Usuario" }) {
    const { translations } = usePage().props;
    // Formatear la fecha para mostrarla de manera más amigable
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Formatear timestamp
    const formatearTimestamp = (timestampStr) => {
        if (!timestampStr) return "N/A";

        const fecha = new Date(timestampStr);
        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Capitalizar primera letra
    const capitalizar = (texto) => {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const header = (
        <div className="flex items-center gap-2 p-3 bg-blue-50">
            <i className="pi pi-calendar text-blue-500 text-2xl"></i>
            <h2 className="text-xl font-bold text-blue-700 m-0">
                { translations.configuration.hours_not_work
                                    .title }
            </h2>
        </div>
    );

    const footer = (
        <div className="flex justify-end p-2">
            <span className="text-sm text-gray-500">ID: {horario.id}</span>
        </div>
    );

    return (
        <Card header={header} footer={footer} className="shadow-md">
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {
                                translations.configuration.hours_not_work
                                    .info_section
                            }
                        </h3>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-calendar text-blue-500"></i>
                                {
                                    translations.configuration.hours_not_work
                                        .fields.date
                                }
                                :
                            </span>
                            <span className="text-gray-800">
                                {formatearFecha(horario.date)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-calendar-plus text-blue-500"></i>
                                {
                                    translations.configuration.hours_not_work
                                        .fields.day_of_week
                                }
                                :
                            </span>
                            <span className="text-gray-800">
                                {capitalizar(horario.day_of_week)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-refresh text-blue-500"></i>
                                {
                                    translations.configuration.hours_not_work
                                        .fields.is_recurring
                                }
                                :
                            </span>
                            {horario.is_recurring === 1 ? (
                                <Badge
                                    value={
                                        translations.configuration
                                            .hours_not_work.yes
                                    }
                                    severity="success"
                                />
                            ) : (
                                <Badge
                                    value={
                                        translations.configuration
                                            .hours_not_work.no
                                    }
                                    severity="info"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {
                                translations.configuration.hours_not_work
                                    .details_section
                            }
                        </h3>

                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 mb-1 flex items-center gap-2">
                                <i className="pi pi-info-circle text-blue-500"></i>
                                {
                                    translations.configuration.hours_not_work
                                        .fields.reason
                                }
                                :
                            </span>
                            <p className="text-gray-800 m-0">
                                {horario.reason}
                            </p>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-user text-blue-500"></i>
                                {
                                    translations.configuration.hours_not_work
                                        .fields.created_by
                                }
                                :
                            </span>
                            <span className="text-gray-800">
                                ID: {horario.creado_por_id} ({creadorNombre})
                            </span>
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-clock text-blue-400"></i>
                            {
                                translations.configuration.hours_not_work.fields
                                    .created_at
                            }
                            :
                        </span>
                        <span className="text-sm">
                            {formatearTimestamp(horario.created_at)}
                        </span>
                    </div>

                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-sync text-blue-400"></i>
                            {
                                translations.configuration.hours_not_work.fields
                                    .updated_at
                            }
                            :
                        </span>
                        <span className="text-sm">
                            {formatearTimestamp(horario.updated_at)}
                        </span>
                    </div>

                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-trash text-blue-400"></i>
                            {
                                translations.configuration.hours_not_work.fields
                                    .deleted_at
                            }
                            :
                        </span>
                        <span className="text-sm">
                            {horario.deleted_at
                                ? formatearTimestamp(horario.deleted_at)
                                : translations.configuration.hours_not_work
                                      .fields.not_deleted}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

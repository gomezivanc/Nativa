import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { usePage } from "@inertiajs/react";

export default function ({ data: tramite, creadorNombre = "Usuario" }) {
    const { translations } = usePage().props;

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

    const header = (
        <div className="flex items-center gap-2 p-3 bg-blue-50">
            <i className="pi pi-file text-blue-500 text-2xl"></i>
            <h2 className="text-xl font-bold text-blue-700 m-0">
                { translations.configuration.procedure_management
                                    .title }
            </h2>
        </div>
    );

    const footer = (
        <div className="flex justify-end p-2">
            <span className="text-sm text-gray-500">ID: {tramite.id}</span>
        </div>
    );

    return (
        <Card header={header} footer={footer} className="shadow-md">
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Información del trámite */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {translations.configuration.procedure_management.info_section}
                        </h3>

                        {/* Nombre */}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-tag text-blue-500"></i>
                                {translations.configuration.procedure_management.form.name}:
                            </span>
                            <span className="text-gray-800">
                                {tramite.name}
                            </span>
                        </div>

                        {/* Tiempo de respuesta */}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-clock text-blue-500"></i>
                                {translations.configuration.procedure_management.form.response_time}:
                            </span>
                            <span className="text-gray-800">
                                {tramite.response_time} {translations.configuration.procedure_management.fields.days}
                            </span>
                        </div>

                        {/* Estado */}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2">
                                <i className="pi pi-check-circle text-blue-500"></i>
                                Estado:
                            </span>
                            {tramite.deleted_at ? (
                                <Badge value="Inactivo" severity="danger" />
                            ) : (
                                <Badge value="Activo" severity="success" />
                            )}
                        </div>
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {translations.configuration.procedure_management.details_section}
                        </h3>

                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-600 mb-1 flex items-center gap-2">
                                <i className="pi pi-hashtag text-blue-500"></i>
                                ID:
                            </span>
                            <p className="text-gray-800 m-0">
                                {tramite.id}
                            </p>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">

                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-clock text-blue-400"></i>
                            {translations.configuration.procedure_management.fields.created_at}:
                        </span>
                        <span className="text-sm">
                            {formatearTimestamp(tramite.created_at)}
                        </span>
                    </div>

                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-sync text-blue-400"></i>
                            {translations.configuration.procedure_management.fields.updated_at}:
                        </span>
                        <span className="text-sm">
                            {formatearTimestamp(tramite.updated_at)}
                        </span>
                    </div>

                    <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-trash text-blue-400"></i>
                            {translations.configuration.procedure_management.fields.deleted_at}:
                        </span>
                        <span className="text-sm">
                            {tramite.deleted_at
                                ? formatearTimestamp(tramite.deleted_at)
                                : translations.configuration.procedure_management.fields.not_deleted}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

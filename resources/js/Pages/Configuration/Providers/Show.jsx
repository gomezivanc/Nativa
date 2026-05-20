import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Badge } from "primereact/badge";
import { usePage } from "@inertiajs/react";
import { formatDate } from '../../../hooks/useDate';

export default function Show({ data }) {
    const { translations } = usePage()?.props;

    const t = (key) => translations?.configuration?.provider?.show?.[key] ?? key;

    const headerTemplate = (options) => {
        const className = `${options.className} flex align-items-center gap-2 py-3`;
        return (
            <div className={className}>
                <i className={`pi pi-${options.collapsed ? "plus" : "minus"}`}></i>
                <span className="font-semibold text-lg">{options.props.header}</span>
            </div>
        );
    };

    return (
        <div >
            <Card className="shadow-lg max-w-5xl mx-auto bg-white">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                            <i className="pi pi-file text-xl"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 m-0">{t("title")}</h1>
                            <p className="text-gray-500 m-0">{t("id")}: {data.id}</p>
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("basic_info")}</h2>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("name")}</span>
                                <span className="text-lg font-medium">{data.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("provider_id")}</span>
                                <span className="text-lg font-medium">{data.conf_services_provider_id}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("created_by")}</span>
                                <span className="text-lg font-medium">Usuario #{data.creado_por_id}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("regional_id")}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-medium">{data.regional_id}</span>
                                    <Badge value={data.regional.sigla} severity="info" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("temporal_info")}</h2>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("created_at")}</span>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-calendar text-blue-500"></i>
                                    <span className="text-lg font-medium">{formatDate(data.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("updated_at")}</span>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-calendar-plus text-green-500"></i>
                                    <span className="text-lg font-medium">{formatDate(data.updated_at)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{t("deleted_at")}</span>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-calendar-minus text-red-500"></i>
                                    <span className="text-lg font-medium">{data.deleted_at || t("not_deleted")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Panel header={t("service_panel")} toggleable headerTemplate={headerTemplate} className="mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-blue-800 mb-2">{data.service.name}</h3>
                                <p className="text-blue-600">{t("service_id")}: {data.service.id}</p>
                            </div>
                        </div>
                        <Divider />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-blue-700 mb-1">{t("service_created_at")}</p>
                                <p className="font-medium">{data.service.created_at || "No disponible"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 mb-1">{t("service_updated_at")}</p>
                                <p className="font-medium">{data.service.updated_at || "No disponible"}</p>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel header={t("regional_panel")} toggleable headerTemplate={headerTemplate}>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-200 text-green-800 p-2 rounded-full">
                                    <span className="font-bold">{data.regional.sigla}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 mb-1">{data.regional.name}</h3>
                                    <p className="text-green-600">{t("regional_id_text")}: {data.regional.id}</p>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">{t("country_id")}</p>
                                <p className="font-medium text-lg">{data.regional.country_id}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">{t("departament_id")}</p>
                                <p className="font-medium text-lg">{data.regional.departament_id}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">{t("city_id")}</p>
                                <p className="font-medium text-lg">{data.regional.city_id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-green-700 mb-1">{t("regional_created_by")}</p>
                                <p className="font-medium">Usuario #{data.regional.creado_por_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-700 mb-1">{t("regional_created_at")}</p>
                                <p className="font-medium">{formatDate(data.regional.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Card>
        </div>
    );
}

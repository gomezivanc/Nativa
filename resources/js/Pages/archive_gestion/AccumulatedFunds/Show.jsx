import { Card } from "primereact/card"
import { Tag } from "primereact/tag"
import { Avatar } from "primereact/avatar"
import { Fieldset } from "primereact/fieldset"
import { Panel } from "primereact/panel"
import { TabView, TabPanel } from "primereact/tabview"
import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleString()
      }

      const renderField = (label, value, className = "") => (
        <div className={`flex flex-col md:flex-row py-1.5 ${className}`}>
          <div className="font-medium w-full md:w-2/5 text-gray-600">{label}:</div>
          <div className="w-full md:w-3/5 font-semibold text-gray-800">{value || "N/A"}</div>
        </div>
      )

      const renderInfoItem = (icon, title, value) => (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-primary">{icon}</div>
          <div>
            <div className="text-xs text-gray-500">{title}</div>
            <div className="font-semibold">{value}</div>
          </div>
        </div>
      )

      return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Encabezado */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {translations.archive_gestion.accumulated_fund.show.document} #{data.number}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Tag value={data.type_document.name} severity="info" className="uppercase text-xs" />
                                    <Tag value={data.clasification.name_es} severity="success" className="uppercase text-xs" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm opacity-80 flex items-center justify-end gap-1">
                                    <span>{translations.archive_gestion.accumulated_fund.show.created_at}: {formatDate(data.created_at)}</span>
                                </div>
                                <div className="text-sm opacity-80 mt-1">{translations.archive_gestion.accumulated_fund.show.id}: {data.id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="shadow-none border border-gray-200">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">{translations.archive_gestion.accumulated_fund.show.subject}</div>
                                    <div className="font-semibold text-lg">{data.subject}</div>
                                </div>
                            </Card>

                            <Card className="shadow-none border border-gray-200">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">{translations.archive_gestion.accumulated_fund.show.serie}</div>
                                    <div className="font-semibold text-lg">{data.serie.name}</div>
                                    <div className="text-xs text-gray-500">{translations.archive_gestion.accumulated_fund.show.code}: {data.serie.code}</div>
                                </div>
                            </Card>

                            <Card className="shadow-none border border-gray-200">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">{translations.archive_gestion.accumulated_fund.show.subserie}</div>
                                    <div className="font-semibold text-lg">{data.subserie.name}</div>
                                    <div className="text-xs text-gray-500">{translations.archive_gestion.accumulated_fund.show.code}: {data.subserie.code}</div>
                                </div>
                            </Card>
                        </div>

                        <TabView className="mt-4">
                            <TabPanel header={translations.archive_gestion.accumulated_fund.show.general_info} leftIcon="pi pi-file mr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                    <Fieldset legend={translations.archive_gestion.accumulated_fund.show.general_info} className="shadow-sm">
                                        <div className="space-y-2">
                                            {renderField(translations.archive_gestion.accumulated_fund.show.document_number, data.number)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.keyword, data.word)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.document_type, data.type_document.name)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.classification, data.clasification.name_es)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.unity_conservation, data.unity_conservation)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.type, data.type)}
                                        </div>
                                    </Fieldset>

                                    <Fieldset legend={translations.archive_gestion.accumulated_fund.show.retention_info} className="shadow-sm">
                                        <div className="space-y-2">
                                            {renderField(translations.archive_gestion.accumulated_fund.show.physical_support, data.subserie.item_support_p ? "Sí" : "No")}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.electronic_support, data.subserie.item_support_e ? "Sí" : "No")}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.years_in_management, data.subserie.items_year_gestion)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.years_in_central, data.subserie.items_year_central)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.final_disposition_s, data.subserie.items_dispo_final_s ? "Sí" : "No")}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.final_disposition_md, data.subserie.items_dispo_final_md ? "Sí" : "No")}
                                        </div>
                                    </Fieldset>
                                </div>
                            </TabPanel>

                            <TabPanel header={translations.archive_gestion.accumulated_fund.show.location} leftIcon="pi pi-map-marker mr-2">
                                <div className="p-4">
                                    <Panel header={translations.archive_gestion.accumulated_fund.show.geo_location} className="mb-4 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {renderInfoItem(<i className="pi pi-globe text-xl"></i>, translations.archive_gestion.accumulated_fund.show.department, data.departament.nombre)}
                                            {renderInfoItem(<i className="pi pi-map text-xl"></i>, translations.archive_gestion.accumulated_fund.show.city, data.city.nombre)}
                                            {renderInfoItem(<i className="pi pi-building text-xl"></i>, translations.archive_gestion.accumulated_fund.show.building, data.building)}
                                        </div>
                                    </Panel>

                                    <Panel header={translations.archive_gestion.accumulated_fund.show.physical_location} className="shadow-sm">
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            <Card className="shadow-none border border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">{translations.archive_gestion.accumulated_fund.show.floor}</div>
                                                    <div className="text-2xl font-bold text-blue-600">{data.floor}</div>
                                                </div>
                                            </Card>

                                            <Card className="shadow-none border border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">{translations.archive_gestion.accumulated_fund.show.rack}</div>
                                                    <div className="text-2xl font-bold text-blue-600">{data.rack}</div>
                                                </div>
                                            </Card>

                                            <Card className="shadow-none border border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">{translations.archive_gestion.accumulated_fund.show.module}</div>
                                                    <div className="text-2xl font-bold text-blue-600">{data.module}</div>
                                                </div>
                                            </Card>

                                            <Card className="shadow-none border border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">{translations.archive_gestion.accumulated_fund.show.panel}</div>
                                                    <div className="text-2xl font-bold text-blue-600">{data.panel}</div>
                                                </div>
                                            </Card>

                                            <Card className="shadow-none border border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">{translations.archive_gestion.accumulated_fund.show.box}</div>
                                                    <div className="text-2xl font-bold text-blue-600">{data.box}</div>
                                                </div>
                                            </Card>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2">
                                                <i className="pi pi-info-circle text-blue-500"></i>
                                                <span className="font-medium">{translations.archive_gestion.accumulated_fund.show.body_type}: </span>
                                                <span>{data.type_body.name}</span>
                                            </div>
                                        </div>
                                    </Panel>
                                </div>
                            </TabPanel>

                            <TabPanel header={translations.archive_gestion.accumulated_fund.show.sender} leftIcon="pi pi-user mr-2">
                                <div className="p-4">
                                    <Card className="shadow-sm">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="md:w-1/4 flex justify-center">
                                                <Avatar
                                                    icon="pi pi-user"
                                                    size="xlarge"
                                                    shape="circle"
                                                    style={{ width: "100px", height: "100px", backgroundColor: "#2563eb", color: "#ffffff" }}
                                                />
                                            </div>

                                            <div className="md:w-3/4">
                                                <h3 className="text-xl font-bold mb-4">{data.third.name_social_reason_sender}</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                                    {renderField(translations.archive_gestion.accumulated_fund.show.social_reason, data.third.first_surname_legal_representative_sender)}
                                                    {renderField(translations.archive_gestion.accumulated_fund.show.document_nit, data.third.document_nit_sender)}
                                                    {renderField(translations.archive_gestion.accumulated_fund.show.address, data.third.address_sender)}
                                                    {renderField(translations.archive_gestion.accumulated_fund.show.email, data.third.email_sender)}
                                                    {renderField(translations.archive_gestion.accumulated_fund.show.phone, data.third.phone_sender)}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </TabPanel>

                            <TabPanel header={translations.archive_gestion.accumulated_fund.show.processes} leftIcon="pi pi-cog mr-2">
                                <div className="p-4">
                                    <Panel header={translations.archive_gestion.accumulated_fund.show.subseries_processes} className="shadow-sm">
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm leading-relaxed">
                                            {data.subserie.items_pro_subseries}
                                        </div>
                                    </Panel>
                                </div>
                            </TabPanel>

                            <TabPanel header={translations.archive_gestion.accumulated_fund.show.metadata} leftIcon="pi pi-list mr-2">
                                <div className="p-4">
                                    <Panel header={translations.archive_gestion.accumulated_fund.show.creator_info} className="mb-4 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Avatar
                                                icon="pi pi-user"
                                                shape="circle"
                                                style={{ backgroundColor: "#4f46e5", color: "#ffffff" }}
                                            />
                                            <div>
                                                <div className="font-bold">{data.user.usuario}</div>
                                                <div className="text-sm text-gray-500">{data.user.email}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderField(translations.archive_gestion.accumulated_fund.show.last_login, formatDate(data.user.ultimo_login))}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.last_login_ip, data.user.ultimo_login_ip)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.status, data.user.estado ? translations.archive_gestion.accumulated_fund.show.active : translations.archive_gestion.accumulated_fund.show.inactive)}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.super_admin, data.user.super_administrador ? "Sí" : "No")}
                                        </div>
                                    </Panel>

                                    <Panel header={translations.archive_gestion.accumulated_fund.show.dates_info} className="shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderField(translations.archive_gestion.accumulated_fund.show.created, formatDate(data.created_at))}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.updated, formatDate(data.updated_at))}
                                            {renderField(translations.archive_gestion.accumulated_fund.show.deleted, data.deleted_at ? formatDate(data.deleted_at) : translations.archive_gestion.accumulated_fund.show.no)}
                                        </div>
                                    </Panel>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>

    )
}
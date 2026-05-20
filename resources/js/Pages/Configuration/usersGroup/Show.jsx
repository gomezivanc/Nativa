import { useState, useEffect } from "react"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Panel } from "primereact/panel"
import { Badge } from "primereact/badge"
import { Avatar } from "primereact/avatar"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { TabView, TabPanel } from "primereact/tabview"
import { Tag } from "primereact/tag"
import { usePage } from "@inertiajs/react"

export default function GrupoDetalle({ data: grupoData }) {
    const [grupo, setGrupo] = useState(grupoData)
    const [visible, setVisible] = useState(false)
    const [jsonDialogContent, setJsonDialogContent] = useState("")
    const [jsonDialogTitle, setJsonDialogTitle] = useState("")
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [dialogUsuario, setDialogUsuario] = useState(false)
    const { translations } = usePage()?.props;

    const t = (key) => translations?.configuration?.users_group?.show?.[key] ?? key;


    const mostrarJson = (titulo, contenido) => {
      setJsonDialogTitle(titulo)
      setJsonDialogContent(JSON.stringify(contenido, null, 2))
      setVisible(true)
    }

    const mostrarDetalleUsuario = (usuario) => {
      setUsuarioSeleccionado(usuario)
      setDialogUsuario(true)
    }

    const formatearFecha = (fechaStr) => {
      if (!fechaStr) return "No disponible"
      const fecha = new Date(fechaStr)
      return fecha.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    }

    const headerTemplate = (options) => {
      const className = `${options.className} flex align-items-center gap-2 py-3`
      return (
        <div className={className}>
          <i className={`pi pi-${options.collapsed ? "plus" : "minus"}`}></i>
          <span className="font-semibold text-lg">{options.props.header}</span>
        </div>
      )
    }

    const estadoTemplate = (rowData) => {
      const estado = rowData.user.estado
      const severity = estado === 1 ? "success" : "danger"
      const text = estado === 1 ? "Activo" : "Inactivo"
      return <Tag severity={severity} value={text} />
    }

    const accionesTemplate = (rowData) => {
      return (
        <div className="flex gap-2 justify-center">
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => mostrarDetalleUsuario(rowData.user)}
            tooltip="Ver detalles"
          />
        </div>
      )
    }

    const nombreCompletoTemplate = (rowData) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar
            label={`${rowData.user.persona.nombre.charAt(0)}${rowData.user.persona.apellido.charAt(0)}`}
            shape="circle"
            className="bg-primary"
            style={{ width: "2rem", height: "2rem" }}
          />
          <span>{`${rowData.user.persona.nombre} ${rowData.user.persona.apellido}`}</span>
        </div>
      )
    }

    const dependencyTemplate = (rowData) => {
      return (
        <div className="flex items-center gap-2 justify-between">
          <div>
            <div className="font-medium">{rowData.dependency.name}</div>
            <div className="text-sm text-gray-500">Código: {rowData.dependency.code}</div>
          </div>
        </div>
      )
    }

    return (
    <div >
        <Card className="shadow-lg max-w-6xl mx-auto bg-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-800 p-3 rounded-full">
                <i className="pi pi-users text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">{grupo.name}</h1>
                <p className="text-gray-500 m-0">{t("group_id")}: {grupo.id}</p>
              </div>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("basic_info")}</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("group_name")}</span>
                  <span className="text-lg font-medium">{grupo.name}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("created_by")}</span>
                  <span className="text-lg font-medium">Usuario #{grupo.creado_por_id}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("total_users")}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{grupo.users.length}</span>
                    <Badge value={grupo.users.length} severity="info" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("total_dependencies")}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{grupo.dependencies.length}</span>
                    <Badge value={grupo.dependencies.length} severity="success" />
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
                    <span className="text-lg font-medium">{formatearFecha(grupo.created_at)}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("updated_at")}</span>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-calendar-plus text-green-500"></i>
                    <span className="text-lg font-medium">{formatearFecha(grupo.updated_at)}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("deleted_at")}</span>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-calendar-minus text-red-500"></i>
                    <span className="text-lg font-medium">{grupo.deleted_at || t("not_deleted")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TabView className="mb-6">
            <TabPanel header={t("users_tab")} leftIcon="pi pi-users mr-2">
              <div className="p-3">
                <DataTable
                  value={grupo.users}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25]}
                  tableStyle={{ minWidth: "50rem" }}
                  emptyMessage={t("no_users_found")}
                  className="shadow-sm"
                >
                  <Column field="user.id" header="ID" sortable style={{ width: "5%" }} />
                  <Column header={t("group_name")} body={nombreCompletoTemplate} sortable />
                  <Column field="user.usuario" header="Usuario" sortable style={{ width: "15%" }} />
                  <Column field="user.email" header={t("email")} sortable style={{ width: "25%" }} />
                  <Column header={t("status")} body={estadoTemplate} style={{ width: "10%" }} />
                  <Column header="Acciones" body={accionesTemplate} style={{ width: "10%" }} />
                </DataTable>
              </div>
            </TabPanel>

            <TabPanel header={t("dependencies_tab")} leftIcon="pi pi-building mr-2">
              <div className="p-3">
                {grupo.dependencies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {grupo.dependencies.map((dep) => (
                      <div
                        key={dep.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {dependencyTemplate(dep)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">{t("no_dependencies_found")}</div>
                )}
              </div>
            </TabPanel>
          </TabView>
        </Card>

        <Dialog
          header={t("user_details")}
          visible={dialogUsuario}
          style={{ width: "50vw" }}
          onHide={() => setDialogUsuario(false)}
          footer={
            <div className="flex justify-end">
              <Button
                label={t("close")}
                icon="pi pi-times"
                onClick={() => setDialogUsuario(false)}
                className="p-button-text"
              />
            </div>
          }
        >
          {usuarioSeleccionado && (
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <Avatar
                    label={`${usuarioSeleccionado.persona.nombre.charAt(0)}${usuarioSeleccionado.persona.apellido.charAt(0)}`}
                    size="xlarge"
                    shape="circle"
                    className="bg-primary mb-2"
                  />
                  <h3 className="text-xl font-bold text-center">
                    {usuarioSeleccionado.persona.nombre} {usuarioSeleccionado.persona.apellido}
                  </h3>
                  <p className="text-gray-500 text-center">{usuarioSeleccionado.usuario}</p>
                  {usuarioSeleccionado.super_administrador === 1 && (
                    <Tag severity="warning" value="Super Admin" icon="pi pi-star" className="mt-2" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("email")}</p>
                      <p className="font-medium break-words">{usuarioSeleccionado.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("status")}</p>
                      <Tag
                        severity={usuarioSeleccionado.estado === 1 ? "success" : "danger"}
                        value={usuarioSeleccionado.estado === 1 ? t("active") : t("inactive")}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("last_login")}</p>
                      <p className="font-medium">{usuarioSeleccionado.ultimo_login || "Nunca"}</p>
                    </div>

                    {/* <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("last_login_ip")}</p>
                      <p className="font-medium">{usuarioSeleccionado.ultimo_login_ip || "N/A"}</p>
                    </div> */}

                    {/* <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("login_attempts")}</p>
                      <p className="font-medium">{usuarioSeleccionado.intentos_login}</p>
                    </div> */}

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">{t("dependency_id")}</p>
                      <p className="font-medium">{usuarioSeleccionado.dependency_id || "No asignada"}</p>
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{t("observations")}</p>
                    <p className="bg-gray-50 p-3 rounded-md">{usuarioSeleccionado.observaciones}</p>
                  </div>
                </div>
              </div>

              <Panel header={t("temporal_info")} toggleable collapsed>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{t("created_at")}</p>
                    <p className="font-medium">{formatearFecha(usuarioSeleccionado.created_at)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{t("updated_at")}</p>
                    <p className="font-medium">{formatearFecha(usuarioSeleccionado.updated_at)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{t("deleted_at")}</p>
                    <p className="font-medium">{usuarioSeleccionado.deleted_at || t("not_deleted")}</p>
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </Dialog>
      </div>
    )
  }

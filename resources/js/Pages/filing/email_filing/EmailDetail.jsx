import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EmailDetail({ emailData }) {
    const formattedDate = format(
        new Date(emailData.created_at),
        "dd 'de' MMMM 'de' yyyy, HH:mm",
        { locale: es }
    );

    const getInitials = (nombre, apellido) => {
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "pdf":
                return "pi pi-file-pdf text-red-500";
            case "doc":
            case "docx":
                return "pi pi-file-word text-blue-500";
            default:
                return "pi pi-file text-gray-500";
        }
    };

    const header = (
        <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Tag
                        value={emailData.entrance_exit}
                        severity={
                            emailData.entrance_exit === "Entrada"
                                ? "info"
                                : "success"
                        }
                        className="px-3 py-1 text-xs font-medium rounded-full"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">
                        {emailData.subject}
                    </h2>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                    {formattedDate}
                </span>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                        De:
                    </span>
                    <div className="flex items-center gap-3">
                        <Avatar
                            label={getInitials(
                                emailData.user.persona.nombre,
                                emailData.user.persona.apellido
                            )}
                            shape="circle"
                            size="large"
                            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">
                                {`${emailData.user.persona.nombre} ${emailData.user.persona.apellido}`}
                            </span>
                            <span className="text-xs text-gray-500">
                                {emailData.user.email}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                        Para:
                    </span>
                    <div className="flex flex-col gap-4">
                        {emailData.to.map((recipient, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <Avatar
                                    label={getInitials(
                                        recipient.user.persona.nombre,
                                        recipient.user.persona.apellido
                                    )}
                                    shape="circle"
                                    size="large"
                                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {`${recipient.user.persona.nombre} ${recipient.user.persona.apellido}`}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {recipient.user.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <
        >
            {header}
            <div className="p-6">
                {/* Contenido del correo */}
                <div
                    className="prose prose-sm max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: emailData.body }}
                />

                {/* Archivos adjuntos */}
                {emailData.attachments.length > 0 && (
                    <div className="space-y-6">
                        <Divider className="border-gray-100" />

                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-gray-700 font-medium">
                                <i className="pi pi-envelope text-blue-500"></i>
                                <span>
                                    Archivos adjuntos (
                                    {emailData.attachments_count})
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {emailData.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-blue-100">
                                                <i
                                                    className={`${getFileIcon(
                                                        attachment.file_name
                                                    )} text-lg`}
                                                ></i>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {attachment.file_name}
                                            </span>
                                        </div>
                                        <a href={ route('file')+'?path='+attachment.path } target="_blank">
                                          <Button
                                              icon="pi pi-download"
                                              rounded
                                              text
                                              severity="secondary"
                                              className="opacity-60 hover:opacity-100 transition-opacity"
                                              aria-label="Descargar archivo"
                                              tooltip="Descargar archivo"
                                          />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

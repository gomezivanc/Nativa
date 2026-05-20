import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Button } from "primereact/button";
import { usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function Onlyoffice({ visible, setVisible, pdfViewer }) {
    const [showMetadata, setShowMetadata] = useState(false);
    const { auth, translations  } = usePage().props;
    const [loading,setLoading] = useState(false)

    function refreshDocuments() {
        setVisible(false);
        router.reload({ only: ['filing', 'query', 'typeDocs'] });
    }

    const handleAction = async (type, idResponse, accion, actionLabel) => {
        try {
            setLoading(true);

            const res = await axios.get(route('filing.documentaprovado', {
                type,
                response_id: idResponse,
                accion
            }));

            toast.success(res.data.message || `${actionLabel} exitoso`);

            refreshDocuments();

        } catch (error) {
            const mensaje =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                translations.auth.document_signing_error;
            toast.error(mensaje);
        } finally {
            setLoading(false);
        }
    };

    const isReviewer = pdfViewer?.revisa?.id == auth.user.id;
    const isApprover = pdfViewer?.aprueba?.id == auth.user.id;

    const revisaEstado = pdfViewer?.estadoPlantilla?.revisa;
    const apruebaEstado = pdfViewer?.estadoPlantilla?.aprueba;

    const revisaPending = revisaEstado == null;
    const apruebaPending = apruebaEstado == null;

    const sameUserBothRoles = isReviewer && isApprover;

    const showReview = isReviewer && revisaPending;

    const showApprove = isApprover && apruebaPending && (
        !sameUserBothRoles
            ? true
            : !revisaPending
    );

    const header = (
        <div className="flex justify-between items-center w-full pr-4">
            <div className="flex items-center gap-3">
                <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                <span className="font-semibold text-gray-700 truncate max-w-[300px] md:max-w-md">
                    {pdfViewer?.title || "Visualizador de Documento"}
                </span>
            </div>

            <div className="flex gap-2 items-center">

                {showReview && (
                    <>
                        <p className="text-sm font-semibold text-orange-600">Revisor</p>

                        <Button
                            label="Rechazar"
                            icon="pi pi-times-circle"
                            className="p-button-sm p-button-danger p-button-outlined"
                            onClick={() => handleAction(1, pdfViewer.id, 2, 'Revisión rechazada')}
                        />

                        <Button
                            label="Aprobar"
                            icon="pi pi-check-circle"
                            className="p-button-sm p-button-success p-button-outlined"
                            onClick={() => handleAction(1, pdfViewer.id, 1, 'Revisión aprobada')}
                        />
                    </>
                )}

                {showApprove && (
                    <>
                        <p className="text-sm font-semibold text-green-600">Aprueba</p>

                        <Button
                            label="Rechazar"
                            icon="pi pi-times-circle"
                            className="p-button-sm p-button-danger p-button-outlined"
                            onClick={() => handleAction(2, pdfViewer.id, 2, 'Aprobación rechazada')}
                        />

                        <Button
                            label="Aprobar"
                            icon="pi pi-check-circle"
                            className="p-button-sm p-button-success p-button-outlined"
                            onClick={() => handleAction(2, pdfViewer.id, 1, 'Aprobación aprobada')}
                        />
                    </>
                )}

                {showApprove && showReview && pdfViewer?.firmantes?.map((firmante, index) => {
                    if (auth.user.id !== firmante.official.id) return null;

                    return (
                        <Button
                            key={index}
                            label="Firmar"
                            icon="pi pi-pencil"
                            className="p-button-sm p-button-primary"
                            onClick={() => console.log('Firmar')}
                        />
                    );
                })}

                <div className="h-6 w-[1px] bg-gray-300 mx-1"></div>

                <Button
                    icon="pi pi-info-circle"
                    className={`p-button-sm p-button-text ${showMetadata ? 'p-button-primary' : 'p-button-secondary'}`}
                    tooltip="Información del documento"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={() => setShowMetadata(!showMetadata)}
                />
            </div>
        </div>
    );

    return (
        <Dialog
            draggable={false}
            modal
            position="center"
            visible={visible}
            style={{ width: "98vw", maxWidth: "1800px" }}
            header={header}
            onHide={() => {
                setVisible(false);
                setShowMetadata(false);
            }}
            contentClassName="p-0"
        >
            {pdfViewer && (
                <div className="flex flex-row w-full h-[85vh] bg-gray-50">

                    <div className="flex-1 relative border-r border-gray-200">
                        <div
                            id="onlyoffice-editor"
                            className="w-full h-full"
                            style={{ minHeight: '100%' }}
                        >
                        </div>
                    </div>

                    {showMetadata && (
                        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl animate-fade-left animate-duration-300">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700 m-0">Información General</h3>
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-text p-button-secondary p-button-sm"
                                    onClick={() => setShowMetadata(false)}
                                />
                            </div>

                            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
                                <MetadataItem label="Radicado" value={pdfViewer.radicado} />
                                <MetadataItem label="Asunto" value={pdfViewer.asunto} />
                                <MetadataItem
                                    label="Fecha de Creación"
                                    value={pdfViewer.fecha ? new Date(pdfViewer.fecha).toLocaleString() : null}
                                />

                                <hr className="border-gray-100 m-0" />

                                <h4 className="text-xs font-black uppercase text-primary mt-2">Responsables</h4>

                                {pdfViewer.elabora && (
                                    <MetadataItem
                                        label="Elaboró"
                                        value={pdfViewer.elabora.usuario}
                                        subValue={pdfViewer.elabora.email}
                                        labelColor="text-blue-600"
                                    />
                                )}

                                <hr className="border-gray-50 m-0" />

                                <h4 className="text-xs font-black uppercase text-primary mt-2">Seguimiento de Acciones</h4>

                                {pdfViewer.revisa && (
                                    <div className="flex flex-col gap-1">
                                        <MetadataItem
                                            label="Revisa"
                                            value={pdfViewer.revisa.usuario}
                                            subValue={pdfViewer.revisa.email}
                                            labelColor="text-orange-600"
                                        />
                                        {(() => {
                                            const estado = pdfViewer.estadoPlantilla?.revisa;
                                            if (estado === 1) {
                                                return (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full w-fit font-bold border border-green-100">
                                                        <i className="pi pi-check-circle text-[9px] mr-1"></i>Aprobado
                                                    </span>
                                                );
                                            } else if (estado === 2) {
                                                return (
                                                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full w-fit font-bold border border-red-100">
                                                        <i className="pi pi-times-circle text-[9px] mr-1"></i> Rechazado
                                                    </span>
                                                );
                                            } else {
                                                return (
                                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full w-fit font-bold border border-gray-200">
                                                        <i className="pi pi-minus-circle text-[9px] mr-1"></i> No Realizado
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}

                                {pdfViewer.aprueba && (
                                    <div className="flex flex-col gap-1 mt-3">
                                        <MetadataItem
                                            label="Aprueba"
                                            value={pdfViewer.aprueba.usuario}
                                            subValue={pdfViewer.aprueba.email}
                                            labelColor="text-green-600"
                                        />
                                        {(() => {
                                            const estado = pdfViewer.estadoPlantilla?.aprueba;
                                            if (estado === 1) {
                                                return (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full w-fit font-bold border border-green-100">
                                                        <i className="pi pi-check-circle text-[9px] mr-1"></i> Aprobado
                                                    </span>
                                                );
                                            } else if (estado === 2) {
                                                return (
                                                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full w-fit font-bold border border-red-100">
                                                        <i className="pi pi-times-circle text-[9px] mr-1"></i> Rechazado
                                                    </span>
                                                );
                                            } else {
                                                return (
                                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full w-fit font-bold border border-gray-200">
                                                        <i className="pi pi-minus-circle text-[9px] mr-1"></i> No Realizado
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}

                                <h4 className="text-xs font-black uppercase text-primary mt-2">Seguimiento de Firmas</h4>

                                {pdfViewer.firmantes && pdfViewer.firmantes.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {pdfViewer.firmantes.map((firmante, index) => (
                                            <div key={firmante.id || index} className="flex flex-col gap-1 p-2 bg-gray-50 rounded-md border border-gray-100">
                                                <MetadataItem
                                                    label={`Firmante ${index + 1}`}
                                                    value={`Usuario: ${firmante.official.usuario}`}
                                                    subValue={firmante.official?.email}
                                                    labelColor="text-green-600"
                                                />
                                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full w-fit font-bold border border-green-100">
                                                    <i className="pi pi-pencil text-[9px] mr-1"></i> Esperando Firma
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No hay firmantes asignados</p>
                                )}

                                <hr className="border-gray-100 m-0" />

                                <MetadataItem label="Tipo de Archivo" value={pdfViewer.tipo_archivo?.toUpperCase()} />
                                <MetadataItem label="Nombre Original" value={pdfViewer.title} isLongText />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Dialog>
    );
}

const MetadataItem = ({ label, value, subValue, isLongText, labelColor = "text-gray-400" }) => (
    <div className="flex flex-col gap-0.5">
        <label className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>{label}</label>
        <p className={`text-gray-800 font-semibold m-0 ${isLongText ? 'text-xs break-words' : 'text-sm'}`}>
            {value || "No registrado"}
        </p>
        {subValue && (
            <span className="text-[11px] text-gray-500 italic leading-tight">{subValue}</span>
        )}
    </div>
);
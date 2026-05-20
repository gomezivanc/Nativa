import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { ChargeDocuments } from "./Dialogs/ChargeDocuments";
import MoveDocumentsDialog from "./Dialogs/MoveDocumentsDialog";
import IndexElec from "./Detail/IndexElec";

export default function Detail({ expFiles }) {
    const { translations } = usePage().props;
    const [attachShow, setAttachShow] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState(false);
    const [indexGenerated, setIndexGenerated] = useState(false);
    const [indexFileName, setIndexFileName] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [documents, setDocuments] = useState(expFiles.files || []);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [viewMode, setViewMode] = useState('general');
    const [moveDialogVisible, setMoveDialogVisible] = useState(false);
    const [indexDialogVisible, setIndexDialogVisible] = useState(false);

    // GENERAR ÍNDICE ELECTRÓNICO
    const generateIndex = async () => {
        try {
            setLoadingIndex(true);
            const res = await axios.post(route("files-exp.generateIndex", expFiles.id));
            toast.success("Índice electrónico generado correctamente");
            setIndexGenerated(true);
            setIndexFileName(res.data.file);
        } catch (error) {
            toast.error("Error generando índice electrónico");
        } finally {
            setLoadingIndex(false);
        }
    };

    // DESCARGAR XML
    const downloadIndex = () => {
        if (!indexFileName) {
            toast.error("Primero debe generar el índice electrónico");
            return;
        }
        window.open(route("files-exp.downloadIndex", indexFileName), "_blank");
    };

    const downloadSelected = () => {
        selectedDocuments.forEach((doc) => {
            if (doc.file_url) {
                window.open(doc.file_url, "_blank");
            }
        });
    };

    const handleDocumentsMoved = (fileIds) => {
        setDocuments((prev) => prev.filter((doc) => !fileIds.includes(Number(doc.file_id))));
        setSelectedDocuments((prev) => prev.filter((doc) => !fileIds.includes(Number(doc.file_id))));
    };

   return (
    <div className="p-4 space-y-4">

        {/* VOLVER */}
        <Button
            text
            icon="pi pi-arrow-left"
            label={translations?.auth?.back || "Volver"}
            onClick={() => window.history.back()}
        />

        {/* INFORMACIÓN EXPEDIENTE */}
        <Card title="Información del expediente">

            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <div><b>Dependencia:</b> {expFiles.dependency?.name}</div>
                <div><b>Serie:</b> {expFiles.serie?.name}</div>
                <div><b>Subserie:</b> {expFiles.subserie?.name}</div>
                <div><b>Estado:</b> {expFiles.deleted_at ? 'Inactivo' : 'Activo'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                {/* ÍNDICES */}
                <div className="mt-2">
                    {expFiles.indices_formateados?.length > 0 ? (
                        expFiles.indices_formateados.map((i, idx) => (
                            <div key={idx} className="text-sm mt-1">
                                <b>{i.nombre}:</b> {i.valor}
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">
                            Sin índices
                        </span>
                    )}
                </div>

                {/* INFO GENERAL */}
                <div className="flex flex-col gap-2 mt-2">
                    <div className="text-sm mt-1">
                        <b>Nombre del Expediente:</b> {expFiles.name}
                    </div>

                    <div className="text-sm mt-1">
                        <b>Fecha Creación:</b> {expFiles.date_init}
                    </div>

                    <div className="text-sm mt-1">
                        <b>Expediente Número:</b> {expFiles.number}
                    </div>
                </div>

            </div>
        </Card>

        {/* CAMBIO DE VISTA */}
        <div className="flex gap-2">
            <Button label="Vista general" outlined={viewMode !== 'general'} severity={viewMode === 'general' ? 'primary' : 'secondary'} onClick={() => setViewMode('general')}/>
            <Button label="Vista por trámite" outlined={viewMode !== 'tramites'} severity={viewMode === 'tramites' ? 'primary' : 'secondary'} onClick={() => setViewMode('tramites')}/>
        </div>

        {/* VISTA GENERAL */}
        {viewMode === 'general' && (
            <Card>
                <div className="flex justify-between items-center mb-3">

                    <h3 className="font-bold">Documentos</h3>

                    <div className="flex gap-2">
                        {selectedDocuments.length > 0 && (
                            <Button label={`Descargar (${selectedDocuments.length})`} icon="pi pi-download" severity="success" outlined onClick={downloadSelected}/>
                        )}
                        <Button label="Mover Expedientes" icon="pi pi-folder-open" severity="warning" outlined onClick={() => setMoveDialogVisible(true)} />
                        <Button label="Subir documento" icon="pi pi-upload" onClick={() => setAttachShow(true)} />
                    </div>
                </div>

                <DataTable value={documents} size="small" emptyMessage="No hay documentos"
                    selection={selectedDocuments}
                    onSelectionChange={(e) => setSelectedDocuments(e.value || [])}
                    dataKey="row_key"
                    paginator
                    rows={10}
                    responsiveLayout="scroll"
                >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column header="#" style={{ width: '60px' }} body={(_, options) => options.rowIndex + 1} />
                    <Column field="name" header="Nombre" />
                    <Column field="radicado_tipo_procedimiento" header="Tipo Trámite" />
                    <Column header="Fecha Creación"
                        body={(row) => {

                            if (!row.created_at) { return '—';}

                            const date = new Date(row.created_at);

                            return date.toLocaleString('es-CO', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }}
                    />

                    <Column field="radicado_asunto" header="Asunto/Descripción" body={(row) => row.radicado_asunto || '—'} />
                    <Column field="tipo_documental" header="Tipo documental" body={(row) => row.tipo_documental || '—'} />
                    <Column field="radicado_creado_por" header="Creado por" body={(row) => row.radicado_creado_por || '—'} />
                    <Column field="radicado_numero" header="Radicado/Secuencial" body={(row) => row.radicado_numero || '—'} />
                    <Column field="tipo_soporte"  header="Soporte" body={(row) => row.tipo_soporte || '—'} />

                    <Column header="Tipo archivo" body={(row) => {
                            const ext = row.tipo_archivo?.toLowerCase();

                            let icon = "pi pi-file";
                            let color = "#6b7280";

                            if (ext?.includes("pdf")) {
                                icon = "pi pi-file-pdf";
                                color = "#ef4444";
                            }
                            else if (
                                ext?.includes("word") ||
                                ext?.includes("doc")
                            ) {
                                icon = "pi pi-file-word";
                                color = "#2563eb";
                            }
                            else if (
                                ext?.includes("excel") ||
                                ext?.includes("xls")
                            ) {
                                icon = "pi pi-file-excel";
                                color = "#16a34a";
                            }
                            else if (
                                ext?.includes("image") ||
                                ext?.includes("jpg") ||
                                ext?.includes("png")
                            ) {
                                icon = "pi pi-image";
                                color = "#f59e0b";
                            }

                            return (
                                <div className="flex items-center gap-2">
                                    <i className={icon} style={{  color, fontSize: "1.2rem" }} />
                                    <span> {row.tipo_archivo} </span>
                                </div>
                            );
                        }}
                    />

                    <Column
                        header="Acciones"
                        body={(row) => (
                            <div className="flex gap-2">

                                {row.is_pdf && (
                                    <Button icon="pi pi-eye" className="p-button-text" tooltip="Ver"
                                        onClick={() => {
                                            setPreviewUrl(row.file_preview);
                                            setPreviewVisible(true);
                                        }}
                                    />
                                )}

                                <Button icon="pi pi-download" className="p-button-text" tooltip="Descargar"
                                    onClick={() =>
                                        window.open(row.file_url, "_blank")
                                    }
                                />

                            </div>
                        )}
                    />
                </DataTable>
            </Card>
        )}

        {/* VISTA POR TRÁMITES */}
        {viewMode === 'tramites' && (

            <div className="space-y-4">
                {(expFiles.filings_detail || []).map((filing) => (

                    <Card key={filing.id}>

                        <div className="mb-4 border-b pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg">
                                        {filing.filing_number}
                                    </h4>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {filing.subject || 'Sin asunto'}
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <div>
                                        {filing.tipo_tramite}
                                    </div>
                                    <div>
                                        {filing.creado_por}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DOCUMENTOS */}
                        <div className="mb-4">

                            <h5 className="font-semibold mb-3">
                                Documentos del trámite
                            </h5>

                            <DataTable value={filing.documentos || []} size="small" emptyMessage="Sin documentos" responsiveLayout="scroll" >

                                <Column header="#" body={(_, options) => options.rowIndex + 1} style={{ width: '60px' }}/>
                                <Column field="name" header="Documento"/>
                                <Column field="tipo_documental" header="Tipo documental" body={(row) => row.tipo_documental || '—'  } />
                                <Column field="tipo_soporte" header="Soporte" body={(row) => row.tipo_soporte || '—' } />
                                <Column
                                    header="Acciones"
                                    body={(row) => (
                                        <div className="flex gap-2">

                                            {row.is_pdf && (
                                                <Button icon="pi pi-eye" className="p-button-text" tooltip="Ver"
                                                    onClick={() => {
                                                        setPreviewUrl(row.file_preview);
                                                        setPreviewVisible(true);
                                                    }}
                                                />
                                            )}

                                            <Button icon="pi pi-download" className="p-button-text" tooltip="Descargar"
                                                onClick={() => window.open(row.file_url, "_blank") }
                                            />

                                        </div>
                                    )}
                                />
                            </DataTable>

                        </div>

                        {/* RESPUESTAS */}
                        {!!filing.respuestas?.length && (

                            <div>

                                <h5 className="font-semibold mb-3">
                                    Respuestas
                                </h5>

                                <DataTable value={filing.respuestas || []} size="small" responsiveLayout="scroll">

                                    <Column field="name" header="Documento" />
                                    <Column field="radicado_numero" header="Radicado salida" />
                                    <Column
                                        header="Acciones"
                                        body={(row) => (
                                            <div className="flex gap-2">
                                                {row.is_pdf && (
                                                    <Button icon="pi pi-eye" className="p-button-text" tooltip="Ver"
                                                        onClick={() => {
                                                            setPreviewUrl(row.file_preview);
                                                            setPreviewVisible(true);
                                                        }}
                                                    />
                                                )}

                                                <Button icon="pi pi-download" className="p-button-text" tooltip="Descargar"
                                                    onClick={() => window.open(row.file_url, "_blank") }
                                                />

                                            </div>
                                        )}
                                    />
                                </DataTable>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        )}

        {/* ÍNDICE ELECTRÓNICO */}
        <Card>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">
                    Índice electrónico
                </h3>
                <div className="flex gap-2">
                    <Button label="Ver índice" icon="pi pi-table" severity="info" onClick={() => setIndexDialogVisible(true)}/>
                    <Button label="Generar" icon="pi pi-file" severity="warning" loading={loadingIndex} onClick={generateIndex}/>
                    <Button label="Descargar XML" icon="pi pi-download" severity="success" disabled={!indexGenerated} onClick={downloadIndex}/>
                </div>
            </div>
            <div className="text-sm text-gray-600">
                El índice electrónico garantiza la integridad del expediente mediante hash de documentos.
            </div>
        </Card>

        {/* MODAL SUBIR */}
        <Dialog  header="Subir documentos" visible={attachShow} style={{ width: '60vw' }} onHide={() => setAttachShow(false)} >

            <ChargeDocuments
                items={[expFiles]}
                onFinish={(newDocuments) => {
                    setAttachShow(false);
                    if (newDocuments?.length) {
                        setDocuments(prev => [
                            ...newDocuments,
                            ...prev
                        ]);
                    }
                }}
            />

        </Dialog>

        {/* MODAL PREVIEW */}
        <Dialog header="Vista previa documento" visible={previewVisible} style={{ width: '90vw' }} maximizable modal
            onHide={() => {
                setPreviewVisible(false);
                setPreviewUrl(null);
            }}
        >
            {previewUrl && (
                <iframe src={previewUrl} title="Vista previa PDF" width="100%" height="700px" style={{ border: 'none' }}/>
            )}

        </Dialog>

        {/* MODAL MOVER EXPEDIENTES */}
        <MoveDocumentsDialog
            expFiles={expFiles}
            visible={moveDialogVisible}
            onHide={() => setMoveDialogVisible(false)}
            onMoved={handleDocumentsMoved}
        />

        {/* MODAL ÍNDICE ELECTRÓNICO */}
        <Dialog
            header="Índice Electrónico"
            visible={indexDialogVisible}
            style={{ width: '90vw', maxWidth: '1200px' }}
            maximizable
            modal
            onHide={() => setIndexDialogVisible(false)}
        >
            <IndexElec
                expFiles={{ ...expFiles, files: documents }}
                handleViewChange={() => setIndexDialogVisible(false)}
            />
        </Dialog>

    </div>
);
}
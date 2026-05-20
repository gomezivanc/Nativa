import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { toast } from "react-toastify";

export default function MoveDocumentsDialog({ expFiles, visible, onHide, onMoved }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [availableExpedients, setAvailableExpedients] = useState([]);
    const [targetExpedient, setTargetExpedient] = useState(null);
    const [loadingExpedients, setLoadingExpedients] = useState(false);
    const [loadingMove, setLoadingMove] = useState(false);

    // Cargar documentos movibles y expedientes disponibles al abrir
    useEffect(() => {
        if (visible && expFiles?.files) {
            const movibles = (expFiles.files || []).filter((doc) => doc.origen === 'Expediente');
            setDocuments(movibles);
            setSelectedDocuments([]);
            setTargetExpedient(null);
            loadAvailableExpedients();
        }
    }, [visible, expFiles]);

    const loadAvailableExpedients = async () => {
        setLoadingExpedients(true);
        try {
            const res = await axios.get(route("files-exp.list"), {
                params: { typeData: 'todos', onlyExp: true }
            });
            // Cuando typeData='todos', el backend retorna array plano (no paginado)
            const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
            const expedients = rawData.filter(
                (exp) => exp.id !== expFiles.id && !exp.deleted_at
            );
            setAvailableExpedients(expedients);
        } catch (error) {
            toast.error("Error cargando expedientes disponibles");
        } finally {
            setLoadingExpedients(false);
        }
    };

    const handleMoveDocuments = async () => {
        if (!targetExpedient) {
            toast.warning("Debes seleccionar un expediente destino");
            return;
        }

        const fileIds = selectedDocuments
            .filter((doc) => Number.isInteger(Number(doc.file_id)))
            .map((doc) => Number(doc.file_id));

        if (fileIds.length === 0) {
            toast.warning("No hay documentos válidos para trasladar");
            return;
        }

        setLoadingMove(true);
        try {
            await axios.post(route("files-exp.moveDocuments"), {
                source_exp_id: expFiles.id,
                target_exp_id: targetExpedient.id,
                file_ids: fileIds,
            });

            toast.success("Documentos trasladados correctamente");
            onMoved(fileIds);
            onHide();
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || "Error trasladando documentos";
            toast.error(msg);
        } finally {
            setLoadingMove(false);
        }
    };

    const fileIconBody = (row) => {
        const ext = row.tipo_archivo?.toLowerCase();
        let icon = "pi pi-file";
        let color = "#6b7280";

        if (ext?.includes("pdf")) { icon = "pi pi-file-pdf"; color = "#ef4444"; }
        else if (ext?.includes("word") || ext?.includes("doc")) { icon = "pi pi-file-word"; color = "#2563eb"; }
        else if (ext?.includes("excel") || ext?.includes("xls")) { icon = "pi pi-file-excel"; color = "#16a34a"; }
        else if (ext?.includes("image") || ext?.includes("jpg") || ext?.includes("png")) { icon = "pi pi-image"; color = "#f59e0b"; }

        return (
            <div className="flex items-center gap-2">
                <i className={icon} style={{ color, fontSize: "1.2rem" }} />
                <span>{row.tipo_archivo}</span>
            </div>
        );
    };

    const dateBody = (row) => {
        if (!row.created_at) return '—';
        const date = new Date(row.created_at);
        return date.toLocaleString('es-CO', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Dialog
            header="Mover Expedientes"
            visible={visible}
            style={{ width: '80vw' }}
            modal
            onHide={onHide}
        >
            <div className="space-y-4">
                {/* EXPEDIENTE ORIGEN */}
                <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="font-semibold text-sm mb-1">Expediente origen</div>
                    <div className="text-sm">{expFiles.name} <span className="text-gray-500">({expFiles.number})</span></div>
                </div>

                {/* TABLA DOCUMENTOS MOVIBLES */}
                <div>
                    <div className="font-semibold text-sm mb-2">Seleccione los documentos a trasladar</div>
                    <DataTable
                        value={documents}
                        size="small"
                        emptyMessage="No hay documentos disponibles para trasladar"
                        selection={selectedDocuments}
                        onSelectionChange={(e) => setSelectedDocuments(e.value || [])}
                        dataKey="row_key"
                        paginator
                        rows={8}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column header="#" style={{ width: '60px' }} body={(_, options) => options.rowIndex + 1} />
                        <Column field="name" header="Nombre" />
                        <Column field="radicado_tipo_procedimiento" header="Tipo Trámite" />
                        <Column header="Fecha Creación" body={dateBody} />
                        <Column field="radicado_asunto" header="Asunto/Descripción" body={(row) => row.radicado_asunto || '—'} />
                        <Column field="tipo_documental" header="Tipo documental" body={(row) => row.tipo_documental || '—'} />
                        <Column field="radicado_creado_por" header="Creado por" body={(row) => row.radicado_creado_por || '—'} />
                        <Column field="radicado_numero" header="Secuencial" body={(row) => row.radicado_numero || '—'} />
                        <Column field="tipo_soporte" header="Soporte" body={(row) => row.tipo_soporte || '—'} />
                        <Column header="Tipo archivo" body={fileIconBody} />
                    </DataTable>
                </div>

                {/* EXPEDIENTE DESTINO */}
                <div>
                    <label className="block text-sm font-medium mb-1">Expediente destino</label>
                    {loadingExpedients ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />
                            Cargando expedientes...
                        </div>
                    ) : (
                        <Dropdown
                            value={targetExpedient}
                            options={availableExpedients}
                            onChange={(e) => setTargetExpedient(e.value)}
                            optionLabel={(opt) => `${opt.name} (${opt.number})`}
                            placeholder="Seleccione un expediente destino"
                            className="w-full"
                            filter
                        />
                    )}
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        outlined
                        onClick={onHide}
                        disabled={loadingMove}
                    />
                    <Button
                        label={loadingMove ? 'Moviendo...' : 'Mover'}
                        icon="pi pi-check"
                        severity="warning"
                        loading={loadingMove}
                        onClick={handleMoveDocuments}
                        disabled={!targetExpedient || selectedDocuments.length === 0 || loadingMove}
                    />
                </div>
            </div>
        </Dialog>
    );
}

import { usePage } from "@inertiajs/react";
import { Card } from "primereact/card";
import { formatDate } from "../../../../hooks/useDate";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ExpFileLabel from "./ExpFileLabel";

export default function IndexElec({ expFiles, handleViewChange }) {
    const { translations, current_language } = usePage().props;
    const detailTranslate = translations.documental_gestion.exp_files.detail;
    const expTranslate = translations.documental_gestion.exp_files;

    function getFileName(file) {
        if (file.name) return file.name;
        try {
            const detail = JSON.parse(file.file_detail);
            return detail?.name?.split(".")[0] ?? null;
        } catch (error) {
            return null;
        }
    }

    function getFileExtension(file) {
        if (file.tipo_archivo) return file.tipo_archivo;
        try {
            const detail = JSON.parse(file.file_detail);
            return detail?.name?.split(".")[1] ?? null;
        } catch (error) {
            return null;
        }
    }

    function getFileSize(file) {

        if (!file?.size) {
            return 'N/A';
        }

        const bytes = file.size;

        if (bytes < 1024) {
            return bytes + ' Bytes';
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        }

        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function getHash(file) {
        return file.hash || file.token || '—';
    }

    function getTypeDocumental(file) {
        if (file.tipo_documental) return file.tipo_documental;
        return file.typeDocumental?.["name_" + current_language] || "—";
    }

    function getOrigin(file) {
        if (file.tipo_soporte) return file.tipo_soporte;
        return file.supportType?.name_es || "Electrónico";
    }

    // Calcular paginación acumulativa
    let paginaActual = 1;
    const filesWithPagination = expFiles.files?.map((file) => {
        const numPages = file.num_pages || file.last_page_pdf || 1;
        const startPage = paginaActual;
        const endPage = paginaActual + numPages - 1;
        paginaActual = endPage + 1;

        return {
            ...file,
            startPage,
            endPage,
            numPages,
        };
    }) || [];

    return (
        <>
            {handleViewChange && (
                <Button onClick={() => handleViewChange('detail')} text icon="pi pi-angle-left">{translations.auth.back}</Button>
            )}

            {handleViewChange && <ExpFileLabel expFile={expFiles} />}

            <Card className={handleViewChange ? "mt-4" : ""}>
                <DataTable
                    value={filesWithPagination}
                    header={
                        <div className="p-0">
                            <h3 className="text-xl font-bold mt-0">
                                {detailTranslate.index_elec}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Total de páginas: {paginaActual - 1} | Total de documentos: {filesWithPagination.length}
                            </p>
                        </div>
                    }
                >
                    <Column
                        header={detailTranslate.table_documents?.content_index || "Orden"}
                        body={(i, options) => options.rowIndex + 1}
                    />
                    <Column
                        header={detailTranslate.table_documents?.document_name || "Nombre del documento"}
                        body={(i) => getFileName(i)}
                    />
                    <Column
                        header={detailTranslate.table_documents?.document_date || "Fecha del documento"}
                        body={(i) => formatDate(i.created_at, false)}
                    />
                    <Column
                        header={detailTranslate.table_documents?.fingerprint_value_document || "Valor de la huella digital"}
                        body={(i) => {
                            const hash = getHash(i);
                            return hash !== '—' ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs truncate max-w-[150px]" title={hash}>
                                        {hash.substring(0, 12)}...
                                    </span>
                                    <Button
                                        icon="pi pi-copy"
                                        className="p-button-text p-button-sm"
                                        tooltip="Copiar hash"
                                        onClick={() => navigator.clipboard.writeText(hash)}
                                    />
                                </div>
                            ) : '—';
                        }}
                    />
                    <Column
                        header={detailTranslate.table_documents?.start_page || "Página inicial"}
                        body={(i) => i.startPage}
                    />
                    <Column
                        header={detailTranslate.table_documents?.end_page_format || "Página final"}
                        body={(i) => i.endPage}
                    />
                    <Column
                        header={detailTranslate.table_documents?.format || "Formato"}
                        body={(i) => getFileExtension(i)?.toUpperCase()}
                    />
                    <Column
                        header={detailTranslate.table_documents?.size || "Tamaño"}
                        body={(i) => getFileSize(i)}
                    />
                    <Column
                        header={detailTranslate.table_documents?.origin || "Origen"}
                        body={(i) => getOrigin(i)}
                    />
                    <Column
                        header={detailTranslate.table_documents?.document_type || "Tipología documental"}
                        body={(i) => getTypeDocumental(i)}
                    />
                    <Column
                        header="Número de páginas"
                        body={(i) => i.numPages}
                    />
                </DataTable>
            </Card>
        </>
    );
}

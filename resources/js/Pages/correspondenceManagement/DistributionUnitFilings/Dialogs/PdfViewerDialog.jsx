import { Dialog } from "primereact/dialog";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function PdfViewerDialog({ visible, setVisible, pdfViewer, setPdfViewer, selectedFiling }) {
    const [showMetadata, setShowMetadata] = useState(false);
    const [searchText, setSearchText] = useState("");
    const iframeRef = useRef(null);

    const getPdfUrl = (query = "") => {
        if (!pdfViewer) return "";

        let url = route("file")
            + "?path=" + encodeURIComponent(pdfViewer.file)
            + "&preview=1";

        if (query) {
            url += `#search="${encodeURIComponent(query)}"`;
        }
        return url;
    };


    const header = (
        <div className="flex justify-between items-center w-full">
            <span className="font-semibold text-gray-700">
                {`Documento: ${pdfViewer?.title}`}
            </span>

            <div className="flex gap-2 items-center">
                {/* BUSCADOR PROPIO */}
                <span className="border-l h-6 mx-1 border-gray-300"></span>

                {/* METADATOS */}
                <Button
                    icon="pi pi-info-circle"
                    className="p-button-sm p-button-secondary p-button-text"
                    tooltip="Ver metadatos"
                    onClick={() => setShowMetadata(!showMetadata)}
                />

                {/* NUEVA PESTAÑA */}
                <Button
                    icon="pi pi-external-link"
                    className="p-button-sm p-button-help p-button-text"
                    tooltip="Abrir en nueva pestaña"
                    onClick={() => window.open(getPdfUrl(searchText), "_blank")}
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
            style={{ width: "95vw", maxWidth: "1600px" }} 
            header={header}
            onHide={() => {
                setVisible(false);
                setPdfViewer(null);
                setShowMetadata(false);
                setSearchText("");
            }}
        >
            {pdfViewer && (
                <div className="flex flex-row gap-4 h-[80vh]">
                    {/* CONTENEDOR DEL IFRAME */}
                    <div className={`${showMetadata ? 'w-3/4' : 'w-full'} transition-all duration-300 h-full`}>
                        <iframe
                            ref={iframeRef}
                            src={getPdfUrl()}
                            width="100%"
                            height="100%"
                            title="Visor PDF"
                            className="border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                        />
                    </div>

                    {/* PANEL DE METADATOS */}
                    {showMetadata && (
                        <div className="w-1/4 bg-white p-5 rounded-lg border border-gray-200 overflow-y-auto shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-primary border-b pb-2">Metadatos</h3>
                            
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Radicado</label>
                                    <p className="text-gray-800 font-medium">{selectedFiling.filing_number || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Funcionario</label>
                                    <p className="text-gray-800 font-medium">{selectedFiling.funcionario || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Asunto</label>
                                    <p className="text-gray-800 font-medium">{selectedFiling.subject || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Fecha</label>
                                    <p className="text-gray-800 font-medium">{selectedFiling.created_at || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Tipo de Archivo</label>
                                    <p className="text-gray-800 font-medium">{selectedFiling.tipo_archivo || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Nombre Original</label>
                                    <p className="text-gray-800 font-medium break-words text-sm">{pdfViewer.title || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </Dialog>
    );
}
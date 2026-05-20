import { router, usePage } from "@inertiajs/react";
import { Card } from "primereact/card";
import { formatDate } from "../../../../hooks/useDate";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { useLoading } from "../../../../Context/preloadContext";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Filters } from "./Filters";

export default function Documents({ handleViewChange, expFiles,withouthBack }) {
    const { translations, current_language } = usePage().props;
    const detailTranslate = translations.documental_gestion.exp_files.detail;
    const expTranslate = translations.documental_gestion.exp_files;
    const [selectedItem, setSelectedItem] = useState([]);
    const [filterShow, setFilterShow] = useState(false);
    const [pdfShow, setpdfShow] = useState(false);
    const [optionsTool, setOptionsTool] = useState();
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const { setIsLoading } = useLoading();
    const [pdfViewer, setPdfViewer] = useState(null);

    const tools = [
        {
            label: detailTranslate.table_documents.dials.download,
            icon: 'pi pi-download',
            command: () => {
                exportPackageZip()
            }
        },
    ]

    async function Idelete(selectedItems) {
        const res = await Swal.fire({
            icon: 'question',
            title: detailTranslate.table_documents.dials.question_deactivate,
            text: detailTranslate.table_documents.dials.question_deactivate_body,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no
            ,confirmButtonText: translations.auth.yes_not.yes
        })

        if(!res.isConfirmed) {
            return
        }
        const ids = selectedItems.map(i => i.id)

        try {
            setIsLoading(true)
            const requests = ids.map(id => axios.delete(route("exp-files-charge-docs.destroy", id)));

            await Promise.all(requests);

            toast.success(translations.auth.confirmation_delete.success);
            router.reload()
        } catch (error) {
            toast.error(translations.auth.error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        if(selectedItem.length > 1) {
            setOptionsTool([
                ...tools,
                {
                    label: detailTranslate.table_documents.dials.exclude_files,
                    icon: 'pi pi-file',
                    command: () => {
                        Idelete(selectedItem)
                    }
                },
            ])
        } else {
            setOptionsTool([
                ...tools,
                {
                    label: detailTranslate.table_documents.dials.show,
                    icon: 'pi pi-eye',
                     command: () => {
                        if (selectedItem.length === 1) {
                            setPdfViewer({
                                file: selectedItem[0].file,
                                segment: false,
                                title: selectedItem[0].file.split('/').pop()
                            });

                            setpdfShow(true);
                        }
                        // window.open(route('file')+'?path='+selectedItem[0].file)
                    }
                },
                {
                    label: detailTranslate.table_documents.dials.exclude_files,
                    icon: 'pi pi-file',
                    command: () => {
                        Idelete(selectedItem)
                    }
                },

            ])
        }

    },[selectedItem])

    const exportPackageZip = (type) => {

            axios.get(route('files-exp.exportPackageZip'), {
                params: {
                    ids: selectedItem.map(i => i.id),  // Parámetro para el tipo de archivo
                    id: expFiles.id
                },
                responseType: 'blob',  // Importante para descargar el archivo como blob
            })
            .then(response => {
                // Obtener el nombre del archivo desde el header
                let fileName = response.headers['content-disposition'] || 'default.csv'; // Si no hay header, usa un nombre predeterminado
                if (fileName) {
                    const fileNameMatch = fileName.match(/filename\*?=['"]?UTF-8['"]?'?([^;\n]*)/);
                    if (fileNameMatch && fileNameMatch[1]) {
                        fileName = decodeURIComponent(fileNameMatch[1]);
                    }
                }
                // Crea un enlace temporal para descargar el archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);  // Usar el nombre del archivo obtenido desde el header
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error al exportar el archivo:', error);
                // Opcionalmente, puedes mostrar un mensaje de error aquí.
            });
    };

    function search(e) {
        setIsLoading(true)
        router.reload({
            data: e,
            onFinish: () => {
                setIsLoading(false)
                setFilterShow(false)
            },
            replace: true,
            preserveState: true,
        });
    }
    return (
        <>
            <Card className="mt-4"
                pt={{
                    content: { className: "p-0" }
                }}
                >
                <DataTable
                    value={expFiles.files}
                    dataKey="id"
                    selectionMode="multiple" selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)}
                    header={
                        <div className="p-0 flex flex-col md:flex-row md:justify-between">
                            <h3 className="text-xl font-bold mt-0">
                                {detailTranslate.index_elec}
                            </h3>
                            <Button icon="pi pi-search" onClick={() => setFilterShow(true)} size='small' label={translations.auth.filters}></Button>

                        </div>
                    }
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column
                        header="#"
                        body={(i,options) =>
                            options.rowIndex + 1
                        }
                    ></Column>

                    {/* Fecha de inclusión */}
                    <Column
                        header={detailTranslate.table_documents.date_inclusion}
                        body={(i) =>
                            formatDate(i.created_at,true)
                        }
                    />

                    {/* Tipo Documental */}
                    <Column
                        header={detailTranslate.table_documents.document_type}
                        body={(i) =>
                            i.typeDocumental?.['name_' + current_language] ?? '—'
                        }
                    ></Column>

                    {/* Descripcion */}
                    <Column
                        header={detailTranslate.table_documents.description}
                        field="description"
                    ></Column>

                    {/* Fecha del documento */}
                    <Column
                        header={detailTranslate.table_documents.date_document}
                        body={(i) =>
                            formatDate(i.date,true)
                        }
                    ></Column>

                    {/* Tipo de soporte */}
                    <Column
                        header={detailTranslate.table_documents.document_support}
                        body={(i) =>
                            i.support_type?.["name_" + current_language] ?? ''
                        }
                    />

                    {/* Consecutivo */}
                    <Column
                        header={detailTranslate.table_documents.document_sequential}
                        field="document_sequential"
                    />

                    {/* Responsable (creador) */}
                    <Column
                        header={detailTranslate.table_documents.document_responsible}
                        body={(i) =>
                            i.creador?.persona
                                ? `${i.creador.persona.nombre} ${i.creador.persona.apellido}`
                                : ''
                        }
                    />

                    {/* ruta documento */}
                    {/* <Column
                        header={detailTranslate.table_documents.document}
                        body={(i) =>
                            JSON.parse(i.file_detail)?.name
                        }
                    ></Column> */}

                </DataTable>
                {
                    selectedItem.length > 0 &&
                    <>
                        <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                        <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
                    </>
                }

                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                {/* <Dialog modal={true} position='top' visible={pdfShow} style={{ width: '50vw' }} onHide={() => {if (!pdfShow) return; setpdfShow(false); }}>
                {
                    selectedItem.length == 1 &&
                    <iframe
                        src={route('file')+'?path='+selectedItem[0].file}
                        width="100%"
                        height="600px"
                        style={{ border: "none" }}
                    ></iframe>
                }
                </Dialog> */}

                <Dialog
                    modal
                    position="top"
                    visible={pdfShow}
                    style={{ width: '70vw' }}
                    header={`Documento: ${pdfViewer?.title}`}
                    onHide={() => {
                        setpdfShow(false);
                        setPdfViewer(null);
                    }}
                >
                    {pdfViewer && (
                        <iframe
                            src={route('file') + '?path=' + pdfViewer.file + '&preview=' + 1}
                            width="100%"
                            height="600px"
                            style={{ border: "none" }}
                        />
                    )}
                </Dialog>

            </Card>
        </>
    );
}

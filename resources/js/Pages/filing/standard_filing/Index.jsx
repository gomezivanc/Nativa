import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import Show from './Show'
import { Filters } from './Filters'
import { formatDate } from '../../../hooks/useDate'
import { BreadCrumb } from 'primereact/breadcrumb'
import { ChargeDocuments } from './Dialogs/ChargeDocuments'
import { SendMail } from './Dialogs/SendMail'
import { Reassing } from './Dialogs/Reassing'
import { AssociateTemplate } from './Dialogs/AssociateTemplate'
import { FinishFiling } from './Dialogs/FinishFiling'
import { SingFiling } from './Dialogs/SingFiling'
import { CancellationRequest } from './Dialogs/CancellationRequest'
import { Badge } from 'primereact/badge'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


export default function Index() {
    const { translations,current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [attachShow, setAttachShow] = useState(false);
    const [sendMail, setSendMail] = useState(false);
    const [reassingFiling, setReassingFiling] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [associateTemplate, setAssociateTemplate] = useState(false);
    const [finishFiling, setFinishFiling] = useState(false);
    const [singFiling, setSingFiling] = useState(false);
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    const [cancellationRequest, setCancellationRequest] = useState(false);
    const chargeDocFilings = selectedItem[0]?.charge_doc_filings;
    const [optionsTool, setOptionsTool] = useState([
            {
               label: translations.menu.options_speed_dial.add,
                icon: 'pi pi-plus',
                command: () => {
                    router.visit(route("filing.create"))
                }
            },

    ]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {

            if(selectedItem.length == 0) {
                setOptionsTool([
                    optionsTool[0]
                ])
                return
            }
            if(selectedItem.length == 1) {
                let optionsDia = []

                if(!selectedItem[0].finished && !selectedItem[0].no_response_required && !selectedItem[0].cancelation_request || selectedItem[0].cancelation_request == 2) {
                optionsDia.push(
                    {
                        label: translations.filing.standard_filing.options_speed_dial.workflow,
                        icon: 'fa fa-solid fa-code-fork',
                        command: () => {
                            router.visit(route("filing.workflow",selectedItem[0].id))
                        }
                    },
                    {
                        label: translations.menu.options_speed_dial.edit,
                        icon: 'pi pi-pencil',
                        command: () => {
                            router.visit(route("filing.edit",selectedItem[0].id))
                        }
                    },
                    {
                        label: translations.menu.options_speed_dial.delete,
                        icon: 'pi pi-trash',
                        command: () => {
                            Idelete(selectedItem.id,selectedItem.deleted_at)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.print_sticker,
                        icon: 'pi pi-print',
                        command: () => {
                            exportStiker(true)
                        }
                    },
                    {
                        label: translations.documental_gestion.exp_files.table.dials.charge_docs,
                        icon: 'pi pi-paperclip',
                        command: () => {
                            setAttachShow(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.copy_informed,
                        icon: 'pi pi-copy',
                        command: () => {
                            setSendMail(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.reassign,
                        icon: 'pi pi-user-edit',
                        command: () => {
                            setReassingFiling(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.associate_template,
                        icon: 'pi pi-upload',
                        command: () => {
                            setAssociateTemplate(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.finish,
                        icon: 'pi pi-flag',
                        command: () => {
                            setFinishFiling(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.sign,
                        icon: 'pi pi-qrcode',
                        command: () => {
                            setSingFiling(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.cancellation_request,
                        icon: 'pi pi-ban',
                        command: () => {
                            setCancellationRequest(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.no_response,
                        icon: 'pi pi-delete-left',
                        command: () => handleNoResponse(), // Mostrar diálogo de confirmación
                    },

                )
                }

                optionsDia.push(
                    {
                        label: translations.menu.options_speed_dial.detail,
                        icon: 'pi pi-eye',
                        command: () => {
                            router.visit(route("filing.show-filing", selectedItem[0].id ),{
                                data:{
                                    id: selectedItem[0].id,
                                    back: 'filing.index'  // Captura la URL actual como referencia
                                }
                            });
                        }
                    },

                )

                setOptionsTool([
                    optionsTool[0],
                    ...optionsDia
                ])
            }else{
                setOptionsTool([
                    optionsTool[0],
                    {
                        label: translations.documental_gestion.exp_files.table.dials.charge_docs,
                        icon: 'pi pi-paperclip',
                        command: () => {
                            setAttachShow(true)
                        }
                    },
                    {
                        label: translations.filing.standard_filing.options_speed_dial.sign,
                        icon: 'pi pi-qrcode',
                        command: () => {
                            setSingFiling(true)
                        }
                    }
                ])
            }
        },[selectedItem])

        const handleNoResponse = () => {
        confirmDialog({
            message: translations.filing.standard_filing.no_response_required,
            header: translations.filing.standard_filing.options_speed_dial.no_response,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                noResponseRequired();
            }
        });
    };
    async function getData(page = 1,rows = 10,filters) {
        setLoading(true)

        try {

            let res = await axios.get(route("filing.list"),{
                params: {
                    page: page,
                    perPage: rows,
                    ...filters
                }
            })

            const response = res.data || {}

            setAData({
                data: response.data || [],
                filters: response.filters || {},
                per_page: response.per_page || rows,
                currentPage: response.from || 1,
                lastPage: response.total || 0
            })

            if(filters) {
                setFiltersVals(filters)
            }

        } catch (error) {

            console.error("Error cargando datos:", error)

            setAData({
                data: [],
                filters: {},
                per_page: rows,
                currentPage: 1,
                lastPage: 0
            })

        }
        setLoading(false)
    }
    async function noResponseRequired() {
        setLoading(true);

        try {
            const res = await axios.post(route("filing.no-response-required"), selectedItem[0]);
            if (res.data.success) {
                toast.success(`${translations.filing.standard_filing.no_response_required_success} : ${res.data.numberFiling}`);
            } else {
                toast.error(res.data.message || translations.auth.error); // Mensaje de error del backend
            }
            getData(1)
            setSelectedItem([]);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error); // Muestra el error exacto del backend
            } else {
                toast.error(translations.auth.error); // Mensaje genérico si no hay error específico
            }
            console.error(error);

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    const exportStiker = () => {

        if (!selectedItem || !selectedItem[0].id) {
            console.error("Error: No hay un ítem seleccionado para exportar.");
            return;
        }

        axios.get(route('filing.export-stiker'), {
            params: { id: selectedItem[0].id },
            responseType: 'blob', // Importante para archivos binarios
        })
        .then(response => {
            const fileName = `sticker_${selectedItem[0].filing_number}.pdf`;

            // Crear URL del blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Liberar memoria
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error al exportar el sticker:", error);
        });
    };
    const exportI = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('filing.export'), {
            params: {
                type: type,  // Parámetro para el tipo de archivo
                ...filtersVals
            },
            responseType: 'blob',  // Importante para descargar el archivo como blob
        })
        .then(response => {
            // Obtener el nombre del archivo desde el header
            const fileName = response.headers['x-file-name'] || 'default.csv'; // Si no hay header, usa un nombre predeterminado

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

    const getStateLabel = (item) => {
        let statusText;
        let badgeSeverity;
        if(item.cancelation_request == 1){
            statusText = translations.filing.standard_filing.canceled;
            badgeSeverity = 'danger';
        }else if (item.no_response_required) {
            statusText = translations.filing.standard_filing.options_speed_dial.no_response;
            badgeSeverity = 'danger';
        }else if (item.deleted_at) {
            statusText = translations.auth.state.inactive;
            badgeSeverity = 'danger';
        } else if (item.finished) {
            statusText = translations.filing.standard_filing.completed_file;
            badgeSeverity = 'success';
        } else if (item.cancelation_request == 0) {
            statusText = translations.filing.standard_filing.options_speed_dial.cancellation_request;
            badgeSeverity = 'warning'; // Amarillo para "solicitud de cancelación"
        } else {
            statusText = translations.auth.state.active;
            badgeSeverity = 'info'; // Azul para "activo"
        }

        return (
            <Badge
                value={statusText}
                severity={badgeSeverity}
                className="custom-badge"
                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            />
        );
    };


    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations.filing.standard_filing.title }</h1>
                </div>
                <div className="flex md:justify-between">
                    <div className="flex gap-2 flex-wrap mt-2">
                        <div>
                            <Button onClick={() => exportI('csv')} size='small' label='CSV'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('excel')} size='small' label='EXCEL'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('pdf')} size='small' label='PDF'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('pdf')} size='small' label={translations.auth.exports.print}></Button>
                        </div>
                    </div>
                    <div>
                        <Button icon="pi pi-search" onClick={() => setFilterShow(true)} size='small' label={translations.auth.filters}></Button>
                    </div>
                </div>
            </>
        )
    }

    function page(data) {
        getData(data.page + 1,data.rows)
    }
    function search(e) {
        getData(1,e)
    }
    function resetValues() {
        getData(1);
        setSelectedItem([]);
    }
    const items = [{ label: translations.menu.filing.filing }, { label: translations.menu.filing.standard_filing }];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="single" rows={ AData?.per_page }
                        selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"  first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                        size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column selectionMode='multiple'></Column>
                        <Column header={ translations.filing.standard_filing.table.types_filing } field="types_filings.name"></Column>
                        <Column header={ translations.filing.standard_filing.table.number_filing } field="filing_number"></Column>
                        <Column header={ translations.filing.standard_filing.table.creation_date } field={ item => formatDate(item.created_at,true) }></Column>
                        <Column header={translations.filing.standard_filing.table.client} field={(item) =>  `${item.name_social_reason_sender || ""} ${item.first_surname_legal_representative_sender || ""}`}/>
                        <Column header={ translations.filing.standard_filing.table.subject } field="subject"></Column>
                        <Column header={translations.filing.standard_filing.table.documental_type} field={(item) => item.documental_type?.['name_'+current_language] || "N/A"}/>
                        <Column header={ translations.filing.standard_filing.table.due_date } field={ item => formatDate(item.expiration_date,false,true)}></Column>
                        <Column header={ translations.filing.standard_filing.table.priority } field={(item) => item.priority?.['name_'+current_language] || "N/A"} ></Column>
                        <Column header={ translations.auth.state_table } field={getStateLabel} ></Column>
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters filters={AData.filters} onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Dialog modal={true} position='center' visible={attachShow} header={translations.filing.standard_filing.options_speed_dial.charge_docs } style={{ width: '70vw' }} onHide={() => {if (!attachShow) return; setAttachShow(false); }}>
                    <ChargeDocuments items={selectedItem} onFinish={() =>{ setAttachShow(false);resetValues();} }/>
                </Dialog>
                <Dialog modal={true} position='center' visible={sendMail} header={translations.filing.standard_filing.options_speed_dial.mail_reply } style={{ width: '70vw' }} onHide={() => {if (!sendMail) return; setSendMail(false); }}>
                    <SendMail dataFiling={selectedItem[0]} tableDocument={chargeDocFilings} onFinish={() => {setSendMail(false);resetValues()}} />
                </Dialog>
                <Dialog modal={true} position='center' visible={reassingFiling} header={translations.filing.standard_filing.options_speed_dial.reassign } style={{ width: '70vw' }} onHide={() => {if (!reassingFiling) return; setReassingFiling(false); }}>
                    <Reassing dataFiling={selectedItem[0]} onFinish={() => {setReassingFiling(false);resetValues()}} />
                </Dialog>
                <Dialog modal={true} position='center' visible={associateTemplate} header={translations.filing.standard_filing.options_speed_dial.associate_template } style={{ width: '70vw' }} onHide={() => {if (!associateTemplate) return; setAssociateTemplate(false); }}>
                    <AssociateTemplate dataFiling={selectedItem[0]} onFinish={() => {setAssociateTemplate(false);resetValues();}} />
                </Dialog>
                <Dialog modal={true} position='center' visible={finishFiling} header={translations.filing.standard_filing.options_speed_dial.finish } style={{ width: '70vw' }} onHide={() => {if (!finishFiling) return; setFinishFiling(false); }}>
                    <FinishFiling dataFiling={selectedItem[0]} onFinish={() => {setFinishFiling(false);resetValues();}} />
                </Dialog>
                <Dialog modal={true} position='center' visible={singFiling} header={translations.filing.standard_filing.options_speed_dial.sign } style={{ width: '70vw' }} onHide={() => {if (!singFiling) return; setSingFiling(false); }}>
                    <SingFiling items={selectedItem} onFinish={() => {setSingFiling(false);resetValues();}} />
                </Dialog>
                <Dialog modal={true} position='center' visible={cancellationRequest} header={translations.filing.standard_filing.options_speed_dial.cancellation_request } style={{ width: '70vw' }} onHide={() => {if (!cancellationRequest) return; setCancellationRequest(false); }}>
                    <CancellationRequest dataFiling={selectedItem[0]} onFinish={() => {setCancellationRequest(false);resetValues();}} />
                </Dialog>
                <ConfirmDialog />
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className=" speeddial-bottom-right  right-4 bottom-4 " buttonClassName='btn-open' />
            </div>
        </>
    )
}

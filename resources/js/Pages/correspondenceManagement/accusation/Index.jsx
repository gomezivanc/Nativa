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
import { formatDate } from '../../../hooks/useDate'
import { BreadCrumb } from 'primereact/breadcrumb'
// import { SendMail } from './Dialogs/SendMail'
import { Badge } from 'primereact/badge';
import { Attach } from './Dialogs/Attach';
import { Filters } from './Filters'



export default function Index(servicesToAdd) {
    const { translations,current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([]);
    //Modales
    const [sendMail, setSendMail] = useState(false);
    const [attach, setAttach] = useState(false);


    useEffect(() => {
        getData()
    },[])
    useEffect(() => {


            if(selectedItem.length == 1) {
                let optionsDia = []
                switch (selectedItem[0].distribution_shipping_status) {
                    case 1:
                        optionsDia.push(
                            {
                                label: translations.menu.options_speed_dial.detail,
                                icon: 'pi pi-eye',
                                command: () => {
                                    router.visit(route("filing.show-filing", selectedItem[0].id ),{
                                        data:{
                                            id: selectedItem[0].id,
                                            back: 'distributionshipping.index'  // Captura la URL actual como referencia
                                        }
                                    });
                                }
                            },
                            {
                                label: translations.correspondence_management.distribution_shipping.distribution_shipping_status.delivered,
                                icon: 'pi pi-thumbs-up',
                                command: () => {
                                    updateStateCorrespondece(3);
                                }
                            },
                            {
                                label: translations.correspondence_management.distribution_shipping.distribution_shipping_status.returned,
                                icon: 'pi pi-undo',
                                command: () => {
                                    updateStateCorrespondece(2);
                                }
                            }
                        )
                        break;
                    case 2:
                        optionsDia.push(
                            {
                                label: translations.menu.options_speed_dial.detail,
                                icon: 'pi pi-eye',
                                command: () => {
                                    router.visit(route("filing.show-filing", selectedItem[0].id ),{
                                        data:{
                                            id: selectedItem[0].id,
                                            back: 'distributionshipping.index'  // Captura la URL actual como referencia
                                        }
                                    });
                                }
                            },
                            {
                                label: translations.correspondence_management.distribution_shipping.options_speed_dial.send_filing,
                                icon: 'pi pi-send',
                                command: () => {
                                    setSendMail(true)
                                }
                            },
                        );
                        break;

                     case 3:
                         optionsDia.push(
                            {
                                label: translations.menu.options_speed_dial.detail,
                                icon: 'pi pi-eye',
                                command: () => {
                                    router.visit(route("filing.show-filing", selectedItem[0].id ),{
                                        data:{
                                            id: selectedItem[0].id,
                                            back: 'distributionshipping.index'  // Captura la URL actual como referencia
                                        }
                                    });
                                }
                            }
                         )
                        break;

                    default:
                        optionsDia.push(
                            {
                                label: translations.menu.options_speed_dial.detail,
                                icon: 'pi pi-eye',
                                command: () => {
                                    router.visit(route("filing.show-filing", selectedItem[0].id ),{
                                        data:{
                                            id: selectedItem[0].id,
                                            back: 'distributionshipping.index'  // Captura la URL actual como referencia
                                        }
                                    });
                                }
                            },
                            {
                                label: translations.correspondence_management.distribution_shipping.options_speed_dial.send_filing,
                                icon: 'pi pi-send',
                                command: () => {
                                    setSendMail(true)
                                }
                            },
                        )
                        break;

                }

                setOptionsTool([
                    ...optionsDia
                ])
            }else{
                setOptionsTool([])
            }
        },[selectedItem])

    async function getData(page = 1,rows = 10,filters) {
        setLoading(true)
        let res = await axios.get(route("accusation.list"),{
            params: {
                page: page,
                perPage: rows,
                null_is_approval: true,
                ...filters
            }
        })
        setAData({
            data: res.data.data,
            per_page: res.data.per_page,
            currentPage: res.data.from,
            lastPage: res.data.total
        })
        if(filters) {
            setFiltersVals(filters)
        }
        setLoading(false)
    }

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
        switch (item.state) {
            case 6:
                statusText = translations.correspondence_management.distribution_shipping.distribution_shipping_status.pending_delivery_Ac;
                badgeSeverity = 'warning'; // Amarillo para "pendiente"
                break;
            case 7:
                statusText = translations.correspondence_management.distribution_shipping.distribution_shipping_status.Charged_acknowledgment;
                badgeSeverity = 'info'; // Amarillo para "pendiente"
                break;
        }   

        return <Badge
            value={statusText}
            severity={badgeSeverity}
            className="custom-badge"
            style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        />;
    };

    async function updateStateCorrespondece(state){
        try {
            let res = await axios.post(route("distributionshipping.update-state-correspondece"),{
                distribution_shipping_status:state,
                id_filing :selectedItem[0].id
            });
            if (res.data.success) {
                toast.success(`${translations.correspondence_management.distribution_shipping.status_successfully_changed}`);
            } else {
                toast.error(res.data.message || translations.auth.error); // Mensaje de error del backend
            }
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
        setSelectedItem([]);

      getData(1);
    }
    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations.correspondence_management.distribution_shipping.title }</h1>
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
    const items = [{ label: translations.menu.correspondence_management.correspondence_management }, { label: translations.menu.correspondence_management.distribution_and_shippings }];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <div>
                   <DataTable loading={loading} value={AData?.data} header={header} rows={AData?.per_page} rowsPerPageOptions={[5, 10, 25, 50, 100]} currentPageReportTemplate="{first} to {last} of {totalRecords}" first={AData.currentPage}
                    size="small" emptyMessage={translations.auth.not_found} lazy onPage={page} paginator totalRecords={AData?.lastPage} >
                        <Column header={ 'Radicado Entrada' } field="filing.filing_number"></Column>
                        <Column header={ 'Radicado Salida' } field="answers.departure_filing"></Column>
                        <Column header={ 'Fecha de asignacion' } field="transfer_date"></Column>
                        <Column header={ 'Remitente' } field="third.name_social_reason_sender"></Column>
                        <Column header={ 'Dependencia' } field="filing.dependency.name"></Column>
                        <Column header={ 'Funcionario' }   field="filing.user.usuario"></Column>
                        <Column
                            header={translations.auth.state_table}
                            body={getStateLabel}
                        />
                        <Column
                            header="Acciones"
                            body={(rowData) => {
                                return (
                                    <div className="flex items-center gap-2 justify-center">
                                        {rowData.state !== 7 && (
                                            <Button
                                                icon="pi pi-folder-open"
                                                tooltip="Acuse"
                                                onClick={() => {
                                                    setSelectedItem(rowData);
                                                    setAttach(true);
                                                }}
                                                className="p-button-sm p-button-help"
                                            />
                                        )}
                                        
                                        
                                    </div>
                                );
                            }}
                        />
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters filters={AData.filters} onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>

                <Dialog visible={attach} modal position="center"  header={translations.filing.standard_filing.options_speed_dial.charge_docs} style={{ width: '70vw' }} onHide={() => setAttach(false)}>
                <Attach items={selectedItem ? [{ id: selectedItem }] : []}
                    onFinish={() => {
                        setAttach(false);   
                        resetValues();
                    }}
                />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
            </div>
        </>
    )
}
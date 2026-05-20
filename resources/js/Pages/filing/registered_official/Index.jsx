import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import axios from 'axios'
import { toast } from 'react-toastify'
import { BreadCrumb } from 'primereact/breadcrumb'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function Index() {
    const pageData = usePage();
    const translations = pageData?.props?.translations || {};
    const current_language = pageData?.props?.current_language || "es";
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        getData()
    },[])

    async function getData(page = 1, rows = 10, filters) {
        try {

            const url = route("filingOfficial.list");

            const params = {
                page: page,
                perPage: rows,
                ...filters
            };

            setLoading(true);

            const res = await axios.get(url, { params });

            if (!res.data) {
                console.error("ERROR: res.data is undefined");
            }

            setAData({
                data: res.data?.data || [],
                filters: res.data?.filters || {},
                per_page: res.data?.per_page || rows,
                currentPage: res.data?.from || 1,
                lastPage: res.data?.total || 0
            });

            if (filters) {
                setFiltersVals(filters);
            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    const filingNumberTemplate = (rowData) => {
        const isCopy = rowData.is_copy === 1;

        return (
            <div className='flex items-center gap-2'>
                <Link
                    // href={route('filing.show', rowData.id)}
                    className='text-blue-600 font-semibold hover:underline'
                >
                    {rowData.filing_number}
                </Link>

                {isCopy && (
                    <span className='inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold'>
                        COPIA
                    </span>
                )}
            </div>
        )
    }

    const getPriorityBadge = (rowData) => {

        const hoy = new Date();
        const fechaExpiracion = new Date(rowData.expiration_date);

        const tiempoRestante = fechaExpiracion - hoy;
        const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));

        let gradient = "";
        let label = `${diasRestantes}`;
        let icon = null;

        if (diasRestantes < 0) {
            gradient = "linear-gradient(135deg, #434343, #414141)"; // vencido elegante
            // icon = "pi pi-exclamation-triangle";
        } else if (diasRestantes <= 2) {
            gradient = "linear-gradient(135deg, #ff6a6a, #ff3d3d)"; // rojo suave
        } else if (diasRestantes <= 4) {
            gradient = "linear-gradient(135deg, #ffb86b, #ff8c42)"; // naranja suave
        } else if (diasRestantes <= 7) {
            gradient = "linear-gradient(135deg, #ffe57f, #ffc107)"; // amarillo suave
        } else {
            gradient = "linear-gradient(135deg, #81c784, #4caf50)"; // verde suave
        }

        return (
            <div
                style={{
                    width: "29px",
                    height: "29px",
                    borderRadius: "50%",
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    color: "#fff",
                    fontSize: "13px",

                    boxShadow: `
                        0 6px 14px rgba(0,0,0,0.18),
                        inset 0 2px 4px rgba(255,255,255,0.25),
                        inset 0 -2px 4px rgba(0,0,0,0.15)
                    `,
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(2px)",
                    transition: "all 0.25s ease",
                    cursor: "pointer"
                }}

                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow = `
                        0 10px 20px rgba(0,0,0,0.25),
                        inset 0 2px 6px rgba(255,255,255,0.35),
                        inset 0 -3px 6px rgba(0,0,0,0.2)
                    `;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = `
                        0 6px 14px rgba(0,0,0,0.18),
                        inset 0 2px 4px rgba(255,255,255,0.25),
                        inset 0 -2px 4px rgba(0,0,0,0.15)
                    `;
                }}
            >
                {icon ? <i className={icon} style={{ fontSize: "15px" }} /> : label}
            </div>
        );
    };

    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations?.filing?.standard_filing?.titleofficial || '' }</h1>
                </div>
                <div className="flex md:justify-between">
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
    const items = [{ label: translations?.menu?.filing?.filing || '' },{ label: translations?.menu?.filing?.official_filing || '' }];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (
        <>
            <BreadCrumb model={items} home={home} />
            <Tooltip target=".icon-tooltip" showDelay={200} hideDelay={100} />
            <div className='h-full mt-4'>
                <div>
                    <DataTable   loading={ loading } value={ AData?.data } header={ header } selectionMode="single" rows={ AData?.per_page }
                        selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"  first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                        size='small' emptyMessage={ translations?.auth?.not_found || '' } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column header="Prioridad" body={getPriorityBadge} />
                        <Column field='filing_number' header={translations.auth.filing_number || 'Radicado'} body={filingNumberTemplate}/>
                        <Column header={ translations?.filing?.filing_official?.table?.affair || '' } field="subject" />
                        <Column header={translations?.filing?.standard_filing?.table?.client || ''} field={(item) =>  `${item.name_social_reason_sender || ""} ${item.first_surname_legal_representative_sender || ""}`}/>
                        <Column header={ translations?.filing?.filing_official?.table?.date_filed || '' } field="document_date" />
                        <Column header={ translations?.filing?.filing_official?.table?.Half_reception || '' } field={`reception_media.name_${current_language || 'es'}` || "N/A"} />
                        <Column header={ translations?.filing?.filing_official?.table?.reception || '' } field={`documental_type.name_${current_language || 'es'}` || "N/A"} />
                        <Column header="Acciones"
                            body={(rowData) => {

                                const nota = rowData.filing_logs
                                ?.filter(log => log.action_es === "Nota de Observacion")
                                ?.pop();

                                const tieneAcuse = rowData.response_templates?.some(r => r.state === 7);
                                const faltaAcuse = rowData.response_templates?.some(r => r.state === 5);
                                const anulacionRechazada = rowData.cancelation_request === 2;

                                return (
                                    <div className="flex items-center w-full px-2">
                                        <div className="w-6 flex justify-start">
                                            {(nota || anulacionRechazada) && (
                                                <i
                                                    className="pi pi-info-circle text-yellow-500 text-sm cursor-pointer icon-tooltip"
                                                    data-pr-tooltip={translations?.filing?.standard_filing?.Observation || ''}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        const nota = rowData.filing_logs
                                                            ?.filter(log => log.action_es === "Nota de Observacion")
                                                            ?.pop();

                                                        setModalContent(nota?.description_es || 'Sin descripción');
                                                        setModalVisible(true);
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div className="flex gap-2 justify-center flex-1">

                                            {tieneAcuse && (
                                                <i
                                                    className="pi pi-check-circle text-green-500 text-sm icon-tooltip"
                                                    data-pr-tooltip={translations?.filing?.standard_filing?.Has_Acknowledgment || ''}
                                                />
                                            )}

                                            {faltaAcuse && (
                                                <i
                                                    className="pi pi-cloud-upload text-red-500 text-sm icon-tooltip" 
                                                    data-pr-tooltip={translations?.filing?.standard_filing?.acknowledgment || ''}
                                                />
                                            )}

                                        </div>

                                        <div className="w-6 flex justify-end gap-2">
                                            {rowData.is_copy === 1 && (
                                                <i
                                                    className="pi pi-check-circle text-green-500 text-sm cursor-pointer hover:text-green-700 icon-tooltip"
                                                    data-pr-tooltip="Finalizar copia"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDialog({
                                                            message: '¿Está seguro de finalizar esta copia?',
                                                            header: 'Confirmar finalización',
                                                            icon: 'pi pi-exclamation-triangle',
                                                            accept: async () => {
                                                                try {
                                                                    await axios.post(route('filing.finish-copy', rowData.copy_id));
                                                                    toast.success('Copia finalizada correctamente');
                                                                    getData();
                                                                } catch (error) {
                                                                    toast.error('Error al finalizar la copia');
                                                                }
                                                            },
                                                        });
                                                    }}
                                                />
                                            )}
                                            <i
                                                className="pi pi-sign-in text-blue-500 text-sm cursor-pointer hover:text-blue-700 icon-tooltip"
                                                data-pr-tooltip={translations?.filing?.standard_filing?.Enter || ''}
                                                onClick={() => {
                                                    router.visit(
                                                        route("filing.show-filing", rowData.id),
                                                        {
                                                            data: {
                                                                copy: rowData.is_copy,
                                                                id: rowData.id,
                                                                back: 'filingOfficial.index'
                                                            }
                                                        }
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </DataTable>
                </div>
                <Dialog header="Nota de Observación" visible={modalVisible} style={{ width: '400px' }} modal onHide={() => setModalVisible(false)}>
                    <p>{modalContent}</p>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>

    )
}

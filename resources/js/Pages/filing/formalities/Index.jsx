import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios'
import { BreadCrumb } from 'primereact/breadcrumb'
import { SpeedDial } from "primereact/speeddial";

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
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("newProcedures.create"))
            }
        },
    ]);

    useEffect(() => {
        getData()
    },[])

    async function getData(page = 1, rows = 10, filters) {
        try {

            const url = route("newProcedures.list");

            const params = {
                page: page,
                perPage: rows,
                ...filters
            };

            setLoading(true);

            const res = await axios.get(url, { params });

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
                        <Column header={'Fecha'}  />
                        <Column header={'Tipo documental'}  />
                        <Column header={'Asunto'}  />
                        <Column header={'Consecutivo'}  />
                        <Column header={'Tipo soporte'}  />
                        <Column
                            header="Acciones"
                            body={(rowData) => {
                                return (
                                    <div className="flex items-center w-full px-2">
                                        <div className="w-6 flex justify-end">
                                            <i
                                                className="pi pi-sign-in text-blue-500 text-sm cursor-pointer hover:text-blue-700 icon-tooltip"
                                                data-pr-tooltip={translations?.filing?.standard_filing?.Enter || ''}
                                                onClick={() => {
                                                    router.visit(
                                                        route("filing.show-filing", rowData.id),
                                                        {
                                                            data: {
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
                    <Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                    <SpeedDial
                        model={optionsTool}
                        direction="up"
                        className="speeddial-bottom-right right-4 bottom-4"
                        buttonClassName="btn-open"
                    />
                </div>
            </div>
        </>

    )
}

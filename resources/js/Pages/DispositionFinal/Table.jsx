import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../hooks/useDate";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from "primereact/dialog";

export function Table({ data, loading, onPage,title, setSelectedItem, selectedItem }) {
    const { translations, current_language } = usePage()?.props;
    const [expandedRows, setExpandedRows] = useState([]);

    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{ title }</h1>
                </div>
                <div className="flex md:justify-between">
                    {/* <div className="flex gap-2 flex-wrap mt-2">
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
                    </div> */}
                    <div>
                        {/* <Button icon="pi pi-search" onClick={() => setFilterShow(true)} size='small' label={translations.auth.filters}></Button> */}
                    </div>
                </div>
            </>
        )
    }

    const headerTemplate = (data) => (
        <>
            <span className="vertical-align-middle ml-2 font-bold line-height-3">
                {data.type_trd}
            </span>
        </>
    );

    function getState(data) {

        if(data.is_dispo_final_delete == 0) {
            return translations.archive_gestion.disposition_final.table.states.approve_el
        }
        if(data.is_dispo_final_delete == 1) {
            return translations.archive_gestion.disposition_final.table.states.el
        }
        if(data.is_dispo_final_conservation == 0) {
            return translations.archive_gestion.disposition_final.table.states.approve_con
        }
        if(data.is_dispo_final_conservation == 1) {
            return translations.archive_gestion.disposition_final.table.states.con
        }

        return 'Activo'
    }

    return (
        <>
            <DataTable
                loading={loading}
                value={data?.data}
                header={header}
                selectionMode="multiple"
                rows={data?.per_page}
                rowGroupHeaderTemplate={headerTemplate}
                rowGroupMode="subheader"
                groupRowsBy="type_trd"
                expandableRowGroups
                selection={selectedItem}
                onSelectionChange={(e) => setSelectedItem(e.value)}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                first={(data?.currentPage - 1) * data?.per_page}
                size="small"
                emptyMessage={translations.auth.not_found}
                lazy
                onPage={onPage}
                paginator
                totalRecords={data?.lastPage}
            >
                {/* Checkbox de selección */}
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

                {/* Columnas principales */}
                <Column header="ID" field="id" />
                <Column header={translations.documental_gestion.exp_files.table.number} field="number" />
                <Column header={translations.documental_gestion.exp_files.table.name} field="name" />

                {/* Fechas con formato */}
                <Column
                    header={translations.documental_gestion.exp_files.table.time_gestion}
                    field={(item) => formatDate(item.created_at, true)}
                />
                <Column
                    header={translations.documental_gestion.exp_files.table.time_central}
                    field={(item) =>
                        item.exp_files_archived ? formatDate(item.exp_files_archived?.created_at, true) : ''
                    }
                />

                {/* Disposición final (Siempre "Sí") */}
                <Column
                    header={translations.archive_gestion.disposition_final.table.destroy_agn}
                    field={() => 'Si'}
                />

                {/* Estado del archivo */}
                <Column
                    header={translations.auth.state_table}
                    body={i =>
                        <>
                            <span>{ getState(i) }</span>
                        </>
                    }
                />
            </DataTable>
        </>
    );
}

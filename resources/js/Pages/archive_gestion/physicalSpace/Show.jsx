import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

import axios from 'axios'
import { toast } from 'react-toastify'
import { formatDate } from '../../../hooks/useDate'

export default function Show({ data }) {
    const { translations } = usePage()?.props

    const labelsValues = useMemo(() => {
        if (!translations?.configuration?.trd?.form) return [];
        return Object.keys(data).map((key) => ({
            label: translations.configuration.trd.form[key] || key,
            value: typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key],
        }));
    }, [data, translations.configuration.trd.form]);

    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.name}:</h3>
                <p>{data.building.name}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.floor}:</h3>
                <p>{data.floor}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.file_area}:</h3>
                <p>{data.file_area}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.rack}:</h3>
                <p>{data.rack}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.module}:</h3>
                <p>{data.module}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.type_body_id}:</h3>
                <p>{data.type_body.name}</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{translations.archive_gestion.physicalSpace.table.created_at}:</h3>
                <p>{formatDate(data.created_at,true)}</p>
            </div>
        </div>
    );
}
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
            {labelsValues.map((label, index) => (
                <div key={index} className="p-4">
                    <h3 className='font-bold'>{label.label}:</h3>
                    {
                        label.label == 'mask'
                            ? <p>{JSON.parse(label.value).name}</p>
                            : <p>{label.value}</p>
                    }
                </div>
            ))}
        </div>
    );
}
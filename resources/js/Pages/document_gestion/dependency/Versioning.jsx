import { Link, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import Detail from './Detail'

export default function Versioning({ historics, dependency }) {
    return (
        <div className='flex gap-6 flex-col'>
            {
                historics.map(h => {
                    return <Detail key={h.id} historic={h} dependency={dependency} />
                })
            }
        </div>
    )
}
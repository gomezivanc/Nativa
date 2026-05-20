import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'

export default function Show({ data }) {
    const { translations } = usePage()?.props


    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.documental_gestion.dependency.form.code }:</h3>
                <p>{ data.code }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.documental_gestion.dependency.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            {
                data.gd_dependency &&
                <div className="p-4" >
                    <h3 className='font-bold'>{ translations.documental_gestion.dependency.form.g_d_parent_id }:</h3>
                    <p>{ data.gd_dependency.name }</p>
                </div>
            }
            <div className="p-4">
                <h3 className='font-bold'>{ translations.documental_gestion.dependency.form.regional }:</h3>
                <p>{ data.regional.name }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.documental_gestion.dependency.table.trd_active }:</h3>
                <p>{ data.current_version.version }</p>
            </div>
        </div>
    );
}

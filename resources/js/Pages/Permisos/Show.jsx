import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props
    
    
    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.administration.permission.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.administration.permission.form.name_module }:</h3>
                <p>{ data.name_module }</p>
            </div>
        </div>
    );
}
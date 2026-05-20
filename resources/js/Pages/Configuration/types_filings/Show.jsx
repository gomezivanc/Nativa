import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props
    
    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.types_of_filings.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.types_of_filings.form.code }:</h3>
                <p>{ data.code }</p>
            </div>
            <div className="md:col-span-3 p-4">
                <h3 className='font-bold'>{ translations.configuration.types_of_filings.form.description }:</h3>
                <p>{ data.description }</p>
            </div>
        </div>
    );
}
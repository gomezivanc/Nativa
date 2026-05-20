import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props    
    
    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.filling_setting.form.dependency_length }:</h3>
                <p>{ data.dependency_length }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.filling_setting.form.filling_structure }:</h3>
                <p>{ data.filing_structure.filing_structure }</p>
            </div>
            <div className="md:col-span-3 p-4">
                <h3 className='font-bold'>{ translations.configuration.filling_setting.form.consecutive_length }:</h3>
                <p>{ data.consecutive_length }</p>
            </div>
        </div>
    );
}
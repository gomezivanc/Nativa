import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props
    
    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.form.email }:</h3>
                <p>{ data.email }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.form.document }:</h3>
                <p>{ data.document }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.table.type_document_id }:</h3>
                <p>{ data.type_document?.nombre }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.form.dependency_id }:</h3>
                <p>{ data.dependency?.name }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.user_interoperability.form.token }:</h3>
                <p className='token-column'>{ data.token }</p>
            </div>
        </div>
    );
}
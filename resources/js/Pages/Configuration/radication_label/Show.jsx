import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props
    
    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.satisfaction_survey.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            <div className="p_4">
                <h3 className='font-bold'>{ translations.configuration.satisfaction_survey.form.email }:</h3>
                <p>{ data.email }</p>
            </div>
        </div>
    );
}
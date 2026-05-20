import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations } = usePage()?.props

    return (
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.satisfaction_survey.form.name }:</h3>
                <p>{ data.name }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.configuration.satisfaction_survey.table.num_questions }:</h3>
                <p>{ data.questions_count }</p>
            </div>
            <div className="p-4 md:col-span-2">
                <h2><b>Preguntas:</b></h2>
                <ul>

                </ul>
                {
                    data.questions.map(q =>
                        <li className="list-disc">
                            { q.question }
                        </li>
                    )
                }
                {/* <h3 className='font-bold'>{ translations.configuration.satisfaction_survey.table.num_questions }:</h3>
                <p>{ data.questions_count }</p> */}
            </div>
        </div>
    );
}

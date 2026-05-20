import { usePage } from '@inertiajs/react'
import { typeTargets } from "@/components/models/typeTargets";
import { typeOptions } from "@/components/models/typeOptions";
import { ProgressBar } from 'primereact/progressbar';




export default function Show({ data }) {
    const { translations } = usePage()?.props

    const getTypeTitle = (type) => {
        const target = typeTargets.find((item) => item.id === type);
        return target ? target.title : 'No definido';
    };
    const getOptionTitle = (type) => {
        const target = typeOptions.find((item) => item.id === type);
        return target ? target.title : 'No definido';
    };
    
    return (
        
        <div className="grid md:grid-cols-2 p-2">
            <div className="p-4">
                <h3 className='font-bold'>{ translations.administration.menu.form.title }:</h3>
                <p className='whitespace-normal break-words'>{ data.title }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.administration.menu.form.url }:</h3>
                <p>{ data.uri }</p>
            </div>
            <div className="p-4">
                <h3 className='font-bold'>{ translations.administration.menu.form.parent }:</h3>
                <p>{data?.parent?.title ? data.parent.title : ''}</p>
            </div>
            <div className="p-4">
                <h3 className="font-bold">{translations.administration.menu.form.icon}:</h3>
                <i className={data.icon}  style={{ fontSize: '1.7rem' }}></i>
            </div>
            <div className="p-4">
                <h3 className="font-bold">{translations.administration.menu.form.target}:</h3>
                <p>{getTypeTitle(data.target)}</p>
            </div>
            <div className="p-4">
                <h3 className="font-bold">{translations.administration.menu.form.type}:</h3>
                <p>{getOptionTitle(data.type)}</p>
            </div>
        </div>
    );
}
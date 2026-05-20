
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { InputText } from 'primereact/inputtext'
import { useLoading } from '../../Context/preloadContext'

export default function EliminateForm({ ids, emitFinish }) {
    // form create
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, setError} = useForm()
    const { translations,auth } = usePage()?.props

    const [typesEl,setTypesEl] = useState([])

    const customType = watch('customType');
    const type_delete = watch('type_delete');

    useEffect(() => {
        // Solo restablecer customType si type_delete cambia y no es "Otro"
        if (type_delete && type_delete !== 'translations.archive_gestion.disposition_final.modal_delete.types_delete.other') {
            setValue('customType', null);
        }

        // Solo restablecer type_delete si customType tiene valor
        if (customType && type_delete !== 'translations.archive_gestion.disposition_final.modal_delete.types_delete.other') {
            setValue('type_delete', null);
        }
    }, [customType, type_delete]);  // Asegúrate de que solo se ejecute cuando cambien los valores de `customType` o `type_delete`


    useEffect(() => {
        let types = translations.archive_gestion.disposition_final.modal_delete.types_delete;
    
        const newTypes = Object.keys(types)
            .map(key => ({
                name: types[key],
                value: `translations.archive_gestion.disposition_final.modal_delete.types_delete.${key}`
            }));
    
        setTypesEl(newTypes); // Actualizar estado correctamente
    }, [translations]); // Agregar dependencia para evitar problemas si cambia

    const [error,setError2] = useState(false)
    const { setIsLoading } = useLoading();

    async function submit(data) {
        setIsLoading(true)
        try {
            data.ids = ids;
            data.deleted_dispo_id = auth.user.id;
            data.is_dispo_final_delete = 0;

            // Verifica si existe un customType y asigna a type_delete
            if (data.customType) {
                data.type_delete = data.customType;
            }
            delete data.customType; // Elimina customType después de asignarlo

            // Validación de type_delete
            if (data.type_delete == null) {
                // Establece el error
                setError2(translations.validation.attributes.field_required);
                return; // Detén la ejecución de la función
            }
            setError2(false);
            const res = await axios.post(route("files-exp.storeOnlyExpFile"),data)
            toast.success(translations.auth.success)
        } catch (error) {
            toast.error(translations.auth.error)
        }finally{
            emitFinish()

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}
            className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
        >
            <h2 className='md:col-span-3 font-bold'>{translations.archive_gestion.disposition_final.modal_delete.title}</h2>
            <hr className='md:col-span-3' />
            <span className="flex flex-col md:col-span-3 space-y-4">
                <label htmlFor="type_delete" className="font-semibold text-lg">
                    {translations.archive_gestion.disposition_final.modal_delete.type_delete}
                </label>
                {typesEl.filter((i) => i.value !== 'translations.archive_gestion.disposition_final.modal_delete.types_delete.other').map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                        <Controller
                            name="type_delete"
                            control={control}
                            render={({ field }) => (
                                <RadioButton
                                    {...field}
                                    value={option.value}
                                    checked={field.value === option.value}
                                    inputId={option.value}
                                    className="p-2"
                                />
                            )}
                        />
                        <label htmlFor={option.value} className="text-base">
                            {option.name}
                        </label>
                    </div>
                ))}

                {/* Condicional para mostrar el campo "Otro" */}
                {typesEl.some(option => option.value === 'translations.archive_gestion.disposition_final.modal_delete.types_delete.other') && (
                    <div className="flex flex-col gap-2 md:col-span-3">
                        <label htmlFor="customType" className="font-semibold text-lg">
                            {translations.archive_gestion.disposition_final.modal_delete.types_delete.other}
                        </label>
                        <InputText 
                            id="customType"
                            {...register('customType')} 
                            className="p-2 border-2 border-gray-300 rounded-lg"
                        />
                    </div>
                )}

                {error && (
                    <span className="text-red-600 text-sm">{error}</span>
                )}
            </span>
            <span className="flex flex-col md:col-span-3 space-y-4">
                <label htmlFor="type_delete" className="font-semibold text-lg">
                    {translations.archive_gestion.disposition_final.modal_delete.observation}
                </label>
                <InputTextarea {...register('observation_delete')}  />
            </span>
            <div className='text-center md:col-span-3'>
                <Button label={translations.documental_gestion.exp_files.add} className='col-span-2' size='small'/>
            </div>


        </form>
    )
}
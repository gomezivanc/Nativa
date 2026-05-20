import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from 'react-toastify';
import { InputTextarea } from "primereact/inputtextarea";

export const FinishFiling = ({  defaultVals = {}, onFinish,dataFiling }) => {
    const { translations, current_language } = usePage()?.props;
    const {
        register,
        handleSubmit,        
        formState: { errors },
        setValue,
        control, watch
    } = useForm({
        defaultValues: defaultVals,
    });    
  
    const [loading, setLoading] = useState(false);
    function fileChange(e) {       
        if(e.length > 0) {
            setValue('file', e[0]?.data);
            setValue('filename', e[0]?.name);
        }
    }   
   

    async function submit(data) {
        setLoading(true);
        data.id = dataFiling.id;            
        
        try {
            const res = await axios.post(route("filing.finish-filing"), data);
            if (res.data.success) {
                toast.success(`${translations.filing.standard_filing.finish_filing}`);      
                onFinish();        
            } else {
                toast.error(res.data.message || translations.auth.error); // Mensaje de error del backend
            }
        } catch (error) {
           if (error.response && error.response.data.error) {
               toast.error(error.response.data.error); // Muestra el error exacto del backend
           } else {
               toast.error(translations.auth.error); // Mensaje genérico si no hay error específico
           }
           console.error(error);
            
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }  

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end"
        >   
            <span className="flex flex-col  md:col-span-6">
                <label htmlFor="finish_observation">{translations.filing.standard_filing.form.observation}</label>                              
                <InputTextarea rows={10} { ...register("finish_observation",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.finish_observation,'w-full':true }} />              
                {errors?.subject && (
                    <span className="text-red-600">{errors.finish_observation?.message}</span>
                )}  
            </span>
            <div className="md:col-span-6 text-end">
                <Button loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
                
            </div>
        </form>
    );
};
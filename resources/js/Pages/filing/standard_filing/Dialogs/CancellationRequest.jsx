import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from 'react-toastify';
import { InputTextarea } from "primereact/inputtextarea";
import { router } from '@inertiajs/react';

export const CancellationRequest = ({  defaultVals = {}, onFinish,dataFiling }) => {
    const { translations } = usePage()?.props;
    const {
        register,
        handleSubmit,        
        formState: { errors },      
    } = useForm({
        defaultValues: defaultVals,
    });    
  
    const [loading, setLoading] = useState(false);      
   

    async function submit(data) {
        setLoading(true);
        data.id = dataFiling.id;            
        
        try {
            const res = await axios.post(route("filing.cancellation-request"), data);
            if (res.data.success) {
                toast.success(`${translations.filing.standard_filing.cancellation_request_successfully} ${res.data.filingRequest}`);   
                setTimeout(() => {
                    router.visit(route('filingOfficial.index'));
                }, 100);
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
                <label htmlFor="request_observation">{translations.filing.standard_filing.form.observation}</label>                              
                <InputTextarea rows={10} { ...register("request_observation",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.request_observation,'w-full':true }} />              
                {errors?.subject && (
                    <span className="text-red-600">{errors.request_observation?.message}</span>
                )}  
            </span>
            <div className="md:col-span-6 text-end">
                <Button loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
            </div>
        </form>
    );
};
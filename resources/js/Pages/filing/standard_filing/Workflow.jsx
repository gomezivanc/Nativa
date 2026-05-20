import { Button } from 'primereact/button'
import { Link, router, usePage } from '@inertiajs/react'
import React, { useRef } from 'react';
import Nodes from '../../Workflow/Nodes'
import { Card } from 'primereact/card'
import { InputTextarea } from 'primereact/inputtextarea'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLoading } from '../../../Context/preloadContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Index({ nodes, edges, filing, current_node_id, last_node_id, is_node_conditional, next_node_yes, next_node_false }) {
    const { translations } = usePage()?.props
    const { register, handleSubmit, formState: {
        errors,
    } } = useForm()
    const { setIsLoading } = useLoading();

    async function submit(data) {
        setIsLoading(true);
        try {
            data.filing_id = filing.id
            const res = await axios.post(route("filing.workflow.store"), data);
            toast.success(translations.auth.success);
            router.visit(route("filing.workflow",filing.id));
        } catch (error) {
            console.error(error);
            toast.error(translations.auth.error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function reject(data) {
        setIsLoading(true);
        try {
            data.filing_id = filing.id
            data.node_id = current_node_id
            const res = await axios.get(route("filing.rejectStep",{filing: filing.id}),{
                params: data
            });
            toast.success(translations.auth.success);
            router.visit(route("filing.workflow",filing.id));
        } catch (error) {
            console.error(error);
            toast.error(translations.auth.error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    function dispatchSubmit(data) {
        if(is_node_conditional) {
            showModalConditional(data)
            return
        }
        data.node_id = current_node_id
        submit(data)
    }

    function showModalConditional(data) {
        let message = nodes.find(nd => nd.id == current_node_id)?.node_data.data.label

        Swal.fire({
            title: translations.workflow.workflow_standart.conditional_message.replace('{{rep_condi}}',message),
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: translations.auth.yes_not.yes,
            denyButtonText: translations.auth.yes_not.no,
            cancelButtonText: translations.auth.start_end.cancel,
        }).then((result) => {
            if (result.isConfirmed) {
                data.conditional_true = true
                data.is_node_conditional = true
                data.node_id = next_node_yes.id
                submit(data)
            } else if (result.isDenied) {
                data.conditional_true = false
                data.is_node_conditional = true
                data.node_id = next_node_false.id
                submit(data)
            } else {

            }
        });
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 h-full'>
            <Card className='md:col-span-1'>
                <Link href={route("filing.index")}>
                    <Button label={translations.auth.back} className="w-full" icon="pi pi-angle-left" />
                </Link>
                <form onSubmit={ handleSubmit(dispatchSubmit) } className='mt-4'>
                    <div>
                        <label htmlFor="">{ translations.workflow.workflow_standart.observation }</label>
                        <InputTextarea { ...register('observation', { required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.observation,'w-full':true }}/>
                        {errors?.observation && (
                            <span className="text-red-600">{errors.observation?.message}</span>
                        )}
                    </div>
                    <div className='flex flex-col md:flex-row justify-between'>
                        <Button icon="pi pi-times" severity='danger' type='button' label={ translations.workflow.workflow_standart.reject } onClick={handleSubmit(reject)} />
                        <Button icon="pi pi-plus" label={ translations.workflow.workflow_standart.advance } />
                    </div>
                </form>
            </Card>
            <Nodes nodes={nodes} edges={edges} notEditable className='md:col-span-2 w-full' />
        </div>
    )
}
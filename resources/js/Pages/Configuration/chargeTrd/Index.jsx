
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import Upload from '../../../components/Upload'

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()


    async function submit(data) {
        try {
            const res = await axios.post(route("charge.store"), data);

            if (res.data.success) {

                toast.success(
                    `Se procesaron ${res.data.processed.length} hojas:
                    ${res.data.processed.map(p => `#${p}`).join(', ')}`
                );

                router.visit(route("dependencies.index"));
            }

        } catch (error) {

            if (error.response) {

                const errors = error.response.data.errors;

                if (Array.isArray(errors)) {
                    toast.error(errors.join('\n'));
                } else {
                    toast.error(errors);
                }

            } else {
                toast.error(translations.auth.error);
            }
        }finally{

        }
    }

    function fileChange(e) {
        if(e.length > 0) {
            setValue('file', e[0]?.data);
            setValue('filename', e[0]?.name);
        }
    }
    return (
        <div>
            <div>
                <Card
                    header={
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold">
                                {translations.documental_gestion.title}
                            </h1>

                            <div className="flex justify-end">
                            <Button
                                label="Plantilla"
                                size="small"
                                onClick={async () => {
                                    const response = await axios.get(
                                        route('dependencies.exportTrd'),
                                        {
                                            params: { type: 'trd' },
                                            responseType: 'blob',
                                        }
                                    );

                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', 'trd_plantilla.xlsx');
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                }}
                            />
                            </div>
                        </div>
                    }
                >
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 items-end'
                    >
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.payroll_management.form.file }</label>
                            <Upload onChangeDocs={fileChange} limitDocs={1} allowedFiles='.xlx,.xlsx' />
                        </span>
                        <div className="text-center">
                            <Button label={ translations.documental_gestion.charge_trd.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { exportBase64 } from "../../../../hooks/converBase64";

export function ChargeDocumen({ items, onFinish, radicado = null, typeDocs= null }) {
    const { translations, expFilesTypeDocs: initialFiles ,  expFilesSupportsType: initialSupports, current_language } = usePage().props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, unregister } = useForm()
    const { fields, append, remove, insert,replace } = useFieldArray({
        control,
        name: "filesList"
    })
    
    const [expFilesSupportsType, setExpFilesSupportsType] = useState(initialSupports || []);
    const [expFilesTypeDocs, setFilesTypeDocs] = useState(initialFiles || []);
    const [pdfPages, setPdfPages] = useState({});

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        insert({})
    }, [])

    useEffect(() => {
        if (!initialSupports || initialSupports.length === 0) {
            fetch(route('files-exp.detailex'))
                .then(res => res.json())
                .then(data => {
                    // asegúrate de cómo viene la data
                    if (data.expFilesSupportsType) {
                        setExpFilesSupportsType(data.expFilesSupportsType);
                    }

                })
                .catch(err => console.error(err));
        }

    }, []);

    useEffect(() => {
        if (typeDocs && typeDocs.length > 0) {
            setFilesTypeDocs(typeDocs);
            return;
        }

        fetch(route('files-exp.expFilesTypeDocs'))
            .then(res => res.json())
            .then(data => {
                if (data.expFilesTypeDocs) {
                    setFilesTypeDocs(data.expFilesTypeDocs);
                }
            })
            .catch(err => console.error(err));

    }, [typeDocs]);


    const [loading,setLoading] = useState(false)

    function addFile() {
        const newIndex = fields.length;

        append({
            date: '',
            description: '',
            file: '',
            is_public: 0,
            support_type_id: ''
        });
    }

    
    async function Guardar(data) {
        data.ids = items.map(item => item.id);
        data.radicados = radicado ?? true;

        let error = false;
        let errors = [];

        for (let i = 0; i < data.filesList.length; i++) {
            const f = data.filesList[i];
            if(f.file[0].type !== 'application/pdf') {
                errors.push( i + 1 +': '+ translations.documental_gestion.exp_files.dialogs.charge_docs.error_format_file);
                error = true;
                continue;
            }
            const { file, base64, base64Only } = await exportBase64(f.file[0]);
            data.filesList[i].file = base64Only;
            data.filesList[i].file_detail = file;
        }
        if(error) {
            toast.error(errors.join(', '));
            return
        }
        setLoading(true);
        setLoading(true);
        try {
            if (radicado) {
                await axios.post(route('charge-doc-filing.store'), data);
            }
            toast.success('Documentos guardados correctamente');
            setIsFinished(true);
            if (onFinish) onFinish();
        } catch (error) {

            if (error.response?.status === 422) {
                const key = error.response?.data?.error_key;
                let message =
                    translations.documental_gestion.exp_files.dialogs.charge_docs[key] ||
                    translations.auth.error;

                if (key === "segment_page_end_exceeds_total") {
                    message = message.replace(":total_pages", error.response.data.total_pages);
                }
                toast.error(message);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
            <form onSubmit={(e) => e.preventDefault()} className={`${isFinished ? 'opacity-60 pointer-events-none' : ''}`}>
            {isFinished && (
                <div className="bg-gray-100 p-3 mb-4 rounded-lg border border-gray-300 text-gray-700 flex items-center gap-2">
                    <i className="pi pi-lock"></i>
                    <span>Esta sección ha sido completada y guardada.</span>
                </div>
            )}
            <div className="flex flex-col gap-4">
                {
                    fields.map((f,index) =>
                        <Card key={f.id} >
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.date}
                                </label>
                                <InputText type="date"
                                    {...register(`filesList.${index}.date`, {
                                        required:
                                            translations.validation.attributes.field_required,
                                    })}
                                    className={{ "p-invalid": errors?.date, "w-full": true }}
                                />
                                {errors?.date && (
                                    <span className="text-red-600">{errors.date?.message}</span>
                                )}
                            </span>
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.description}
                                </label>
                                <InputTextarea
                                    type="number"
                                    {...register(`filesList.${index}.description`, {
                                        required:
                                            translations.validation.attributes.field_required,
                                    })}
                                    className={{ "p-invalid": errors?.description, "w-full": true }}
                                />
                                {errors?.description && (
                                    <span className="text-red-600">{errors.description?.message}</span>
                                )}
                            </span>
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.is_public}
                                </label>
                                <Controller
                                    name={`filesList.${index}.is_public`}
                                    defaultValue={0}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <div className="flex items-center gap-2">
                                            <InputSwitch
                                                trueValue={1}
                                                falseValue={0}
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                            </span>
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.support_type_id}
                                </label>
                                <Controller
                                    name={`filesList.${index}.support_type_id`}
                                    control={control}
                                    rules={{
                                        required: translations.validation.attributes.field_required,
                                    }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={expFilesSupportsType} optionValue="id" optionLabel={i => i['name_'+current_language]}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                            />
                                            {
                                                fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                            }
                                        </>
                                    )}
                                />
                            </span>
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.file}
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    {...register(`filesList.${index}.file`, {
                                        required: translations.validation.attributes.field_required
                                    })}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file || file.type !== "application/pdf") return;

                                        const reader = new FileReader();
                                        
                                        reader.onload = function(e) {
                                            const content = e.target.result;
                                            const matches = content.match(/\/Count\s+(\d+)/g);
                                            
                                            if (matches) {
                                                const lastMatch = matches[matches.length - 1];
                                                const pages = parseInt(lastMatch.match(/\d+/)[0]);
                                                
                                                setPdfPages(prev => ({
                                                    ...prev,
                                                    [index]: pages
                                                }));
                                            } else {
                                                const pageMatches = content.match(/\/Type\s*\/Page\b/g);
                                                const pages = pageMatches ? pageMatches.length : 0;
                                                
                                                setPdfPages(prev => ({
                                                    ...prev,
                                                    [index]: pages
                                                }));
                                            }
                                        };
                                        reader.readAsBinaryString(file);
                                    }}
                                />
                            </span>
                            {pdfPages[index] && (
                                <small className="text-gray-500">
                                    Total páginas: {pdfPages[index]}
                                </small>
                            )}

                            {
                                index !== 0 &&
                                <div className="text-end mt-4">
                                    <Button loading={loading} severity="danger" type="button" onClick={() => remove(index)} icon="pi pi-trash" className='col-span-2' size='small'/>
                                </div>
                            }
                        </Card>
                    )
                }
            </div>

            {/* Botones de acción: Se deshabilitan si isFinished es true */}
            <div className="text-end flex justify-end gap-2">

                <div className="text-end">
                    <Button loading={loading} severity="success" type="button" onClick={() => addFile()} icon="pi pi-plus" className='col-span-2' size='small'/>
                </div>

                <Button
                    loading={loading}
                    disabled={isFinished}
                    type="button"
                    icon="pi pi-at"
                    label={isFinished ? "Guardado" : translations.documental_gestion.exp_files.save} 
                    severity="secondary"
                    className='col-span-2' 
                    size="small"
                    onClick={handleSubmit(Guardar)}
                />
            </div>
        </form>
    );
}

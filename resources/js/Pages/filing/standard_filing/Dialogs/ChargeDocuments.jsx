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

export function ChargeDocuments({ items, onFinish, radicado = null }) {
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
        if (!initialSupports || initialSupports.length === 0) {

            fetch(route('files-exp.expFilesTypeDocs'))
                .then(res => res.json())
                .then(data => {
                    // asegúrate de cómo viene la data
                    if (data.expFilesTypeDocs) {
                        setFilesTypeDocs(data.expFilesTypeDocs);
                    }

                })
                .catch(err => console.error(err));
        }

    }, []);

    const [loading,setLoading] = useState(false)

    async function submit(data) {
        data.ids = items.map(item => item.id);
        data.radicados = radicado ?? false;

        let error = false;
        let errors = [];
        for (let i = 0; i < data.filesList.length; i++) {
            const segments = data.filesList[i].segments;

            if (!segments || segments.length === 0) {

                const message = translations.documental_gestion.exp_files.dialogs.charge_docs.classification.error_min_classification.replace(':index', i + 1);

                errors.push(message);
                error = true;
                continue;
            }
        }
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
        try {
            const res = await axios.post(route('charge-doc-filing.store'), data);

            if (res.data?.warnings?.length > 0) {
                res.data.warnings.forEach(w => {
                    toast.warning(
                        `${w.file_name}: ${translations.documental_gestion.exp_files.dialogs.charge_docs[w.message] || w.message}`
                    );
                });
            } else {
                toast.success(translations.auth.success);
            }
            onFinish();
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

    const [segmentsCount, setSegmentsCount] = useState({});

    function addFile() {
        const newIndex = fields.length;

        append({
            date: '',
            description: '',
            file: '',
            is_public: 0,
            support_type_id: ''
        });

        setSegmentsCount(prev => ({
            ...prev,
            [newIndex]: [0] // primer segmento
        }));
    }

    return (
        <form className="grid md:grid-cols-1 gap-4 p-5" onSubmit={handleSubmit(submit)}>
            {
                fields.map((f,index) =>
                    <Card key={f.id} >

                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {translations.documental_gestion.exp_files.dialogs.charge_docs.description}
                            </label>
                            <InputTextarea
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
                            <label htmlFor="is_public">
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
                                    required:
                                        translations.validation.attributes.field_required,
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
                                        // Buscamos la propiedad /Count en el contenido del archivo
                                        // Los PDF suelen tener este rastro: /Type /Pages /Count 5
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

                        <div className="section-card mt-4 border-t pt-4">
                            <h4 className="font-semibold mb-2">
                                {translations.documental_gestion.exp_files.dialogs.charge_docs.classification.page_classification}
                            </h4>

                            {(segmentsCount[index] || []).map((seg, sIndex) => (
                                <div key={sIndex} className="grid md:grid-cols-4 gap-2 mb-3 items-end">

                                    <span className="flex flex-col">
                                        <label htmlFor="username">
                                            {translations.documental_gestion.exp_files.dialogs.charge_docs.classification.type_doc_id}
                                        </label>
                                        <Controller
                                            name={`filesList.${index}.segments.${sIndex}.type_doc_id`}
                                            control={control}
                                            rules={{ required:
                                                translations.validation.attributes.field_required
                                            }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Dropdown options={expFilesTypeDocs} optionValue="id" optionLabel={i => i['name_'+current_language]}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        className={{ 'p-invalid': fieldState.error, 'w-full': true }}
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
                                            {translations.documental_gestion.exp_files.dialogs.charge_docs.classification.page_start}
                                        </label>
                                        <InputText
                                            type="number"
                                            min={1}
                                            max={pdfPages[index] || undefined}
                                            {...register(`filesList.${index}.segments.${sIndex}.page_start`, { required: true })}
                                        />
                                    </span>

                                    <span className="flex flex-col">
                                        <label htmlFor="username">
                                            {translations.documental_gestion.exp_files.dialogs.charge_docs.classification.page_end}
                                        </label>
                                        <InputText
                                            type="number"
                                            min={1}
                                            max={pdfPages[index] || undefined}
                                            {...register(`filesList.${index}.segments.${sIndex}.page_end`, { required: true })}
                                        />
                                    </span>

                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        className="flex items-center justify-center"
                                        onClick={() => {
                                            const segments = getValues(`filesList.${index}.segments`) || [];

                                            const newSegments = segments.filter((_, i) => i !== sIndex);

                                            setValue(`filesList.${index}.segments`, newSegments);

                                            setSegmentsCount(prev => ({
                                                ...prev,
                                                [index]: newSegments.map((_, i) => i)
                                            }));

                                        }}
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                icon="pi pi-plus"
                                label={translations.documental_gestion.exp_files.dialogs.charge_docs.classification.add_classification}
                                size="small"
                                onClick={() => {
                                    const current = segmentsCount[index] || [];

                                    const newSegments = [...current, current.length];

                                    setSegmentsCount(prev => ({
                                        ...prev,
                                        [index]: newSegments
                                    }));

                                }}
                            />
                        </div>

                        {
                            index !== 0 &&
                            <div className="text-end mt-4">
                                <Button loading={loading} severity="danger" type="button" onClick={() => remove(index)} icon="pi pi-trash" className='col-span-2' size='small'/>
                            </div>
                        }
                    </Card>
                )
            }
            <div className="text-end">
                <Button loading={loading} severity="success" type="button" onClick={() => addFile()} icon="pi pi-plus" className='col-span-2' size='small'/>
            </div>
            <div className="text-end">
                <Button loading={loading} label={ translations.documental_gestion.exp_files.save } className='col-span-2' size='small'/>
            </div>
        </form>
    );
}

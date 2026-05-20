import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import { toast } from "react-toastify";
import { InputSwitch } from "primereact/inputswitch";

export const CreateExpedienteForm = ({ filters, indices = [], onSuccess, clasifications, translations }) => {

    const [formValues, setFormValues] = useState({
        name: "",
        date_init: "",
        description: "",
        exist_p: 0,
        book: "",
        file_box: "",
        shelf: "",
        responsible_id: null,
        archive_id: filters.archive_id,
        dependency_id : filters.dependency_id,
        sub_exps: [],
        indices: {}
    });

    const [subExp, setSubExp] = useState(false);

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleIndiceChange = (indiceId, value) => {
        setFormValues(prev => ({
            ...prev,
            indices: {
                ...prev.indices,
                [indiceId]: value
            }
        }));
    };
    
    const handleSubmit = async () => {
        // validar índices obligatorios
        for (let item of indices) {
            if (item.obligatorio && !formValues.indices?.[item.indice.id]) {
                toast.warn(`El campo "${item.indice.nombre}" es obligatorio`);
                return;
            }
        }

        const payload = {
            ...formValues,
            serie: filters.serie,
            subserie: filters.subserie || null,
            indices: formValues.indices,
            indices_config: indices
        };
        
        try {
            const res = await axios.post(route("files-exp.store"), payload);
            toast.success(translations.documental_gestion.dependency.form.saved_successfully);
            onSuccess();

        } catch (error) {
            toast.error(translations.documental_gestion.dependency.form.error);
            console.error(error);
        }
    };

    const generarNombreExpediente = () => {

        if (!indices?.length) { return ''; }

        const indicesNombre = indices.filter(item => item.es_nombre == 1)
            .sort((a, b) => (a.orden || 999) - (b.orden || 999));

        let nombre = '';

        indicesNombre.forEach(config => {
            const indiceId = config.indice.id;
            let valor = formValues.indices?.[indiceId] || '';

            if (!valor) { return; }

            if (config.indice.tipo_dato === 'fecha') {
                valor = valor.replaceAll('-', '');
            }

            valor = valor.replace(/\s+/g, '_');
            nombre += (nombre ? '_' : '') + valor;
        });
        return nombre;
    };

    return (
        <div className="flex flex-col gap-6"> 

            {/* ÍNDICES DINÁMICOS */} 

            {indices.map((item) => {
                const indice = item.indice;

                return (
                    <div key={item.id} className="flex flex-col gap-1">

                        <label className="text-sm font-medium">
                            {indice.nombre}
                            {item.obligatorio == 1 && (<span className="text-red-500 ml-1">*</span>)}
                        </label>

                        {indice.tipo_dato === "texto" && (
                            <InputText onChange={(e) => handleIndiceChange(indice.id, e.target.value)} />
                        )}

                        {indice.tipo_dato === "numero" && (
                            <InputText type="number" onChange={(e) => handleIndiceChange(indice.id, e.target.value)} />
                        )}

                        {indice.tipo_dato === "fecha" && (
                            <InputText type="date" onChange={(e) => handleIndiceChange(indice.id, e.target.value)} />
                        )}

                        {indice.tipo_dato === "booleano" && (
                            <Dropdown
                                options={[
                                    { label: "Sí", value: 1 },
                                    { label: "No", value: 0 }
                                ]}
                                onChange={(e) => handleIndiceChange(indice.id, e.value)}
                            />
                        )}

                        {indice.tipo_dato === "lista" && (
                            <Dropdown
                                options={(indice.opciones || []).map(op => ({
                                    label: op,
                                    value: op
                                }))}
                                value={formValues.indices?.[indice.id] || ""}
                                onChange={(e) => handleIndiceChange(indice.id, e.value)}
                                placeholder={translations.auth.select_opcion}
                                className="w-full"
                            />
                        )}

                    </div>
                );
            })}
            
            {/*Clasificacion */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    { translations.filing.standard_filing.form.classification }<span className="text-red-500 ml-1">*</span>
                </label>

                <Dropdown
                    options={(clasifications || []).map(op => ({
                        label: op.name_es,
                        value: op.id
                    }))}
                    value={formValues.clasification_id || ""}
                    onChange={(e) => handleChange('clasification_id', e.value)}
                    placeholder={translations.auth.select_opcion}
                    className="w-full"
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    { translations.documental_gestion.exp_files.form.exist_p }
                </label>

                <div className="flex align-items-center gap-2">
                    <InputSwitch
                        checked={formValues.exist_p === 1}
                        onChange={(e) => handleChange("exist_p", e.value ? 1 : 0)}
                    />

                    <span className="text-sm text-gray-600">
                        {formValues.exist_p === 1 ? "Sí" : "No"}
                    </span>
                </div>
            </div>

            {/* INFORMACIÓN FÍSICA */}
            {formValues.exist_p === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded p-3 bg-gray-50">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            { translations.documental_gestion.exp_files.form.book }
                        </label>

                        <InputText
                            value={formValues.book}
                            onChange={(e) => handleChange("book", e.target.value)}
                            placeholder="Ingrese el libro"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            { translations.documental_gestion.exp_files.form.file_box }
                        </label>

                        <InputText
                            value={formValues.file_box}
                            onChange={(e) => handleChange("file_box", e.target.value)}
                            placeholder="Ingrese la caja"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            { translations.documental_gestion.exp_files.form.shelf }
                        </label>

                        <InputText
                            value={formValues.shelf}
                            onChange={(e) => handleChange("shelf", e.target.value)}
                            placeholder="Ingrese el estante"
                        />
                    </div>

                </div>
            )}

            
            {/* SUBEXPEDIENTES */} 
            <div className="flex align-items-center gap-2">
                <label>{ translations.documental_gestion.exp_files.form.add_subfile }</label>
                <input type="checkbox" checked={subExp} onChange={(e) => {
                    const checked = e.target.checked;
                    setSubExp(checked);

                    if (checked) {
                        setFormValues(prev => ({
                            ...prev,
                            sub_exps: [
                                { name: "", date_init: "", description: "", exist_p: 0 }
                            ]
                        }));
                    } else {
                        setFormValues(prev => ({
                            ...prev,
                            sub_exps: []
                        }));
                    }
                }} />
            </div>

            {subExp && (
                <div className="flex flex-col gap-4 border p-4 rounded">

                    {formValues.sub_exps.map((sub, index) => (
                        <div key={index} className="border rounded p-3 bg-gray-50 flex flex-col gap-2">

                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm text-gray-700">
                                    Subexpediente {index + 1}
                                </span>
                                <div>
                                    <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm"
                                        onClick={() => {
                                            const newSubs = formValues.sub_exps.filter((_, i) => i !== index);
                                            handleChange("sub_exps", newSubs);
                                        }}
                                    />

                                    <Button icon="pi pi-plus" className="p-button-text p-button-primary p-button-sm"
                                        onClick={() => {
                                        setFormValues(prev => ({
                                            ...prev,
                                            sub_exps: [
                                                ...prev.sub_exps,
                                                { name: "", date_init: "", description: "", exist_p: 0 }
                                            ]
                                        }));
                                    }}
                                />
                                </div>
                                
                            </div>

                            {/* CAMPOS */}
                            <InputText placeholder="Nombre" value={sub.name}
                                onChange={(e) => {
                                    const newSubs = [...formValues.sub_exps];
                                    newSubs[index].name = e.target.value;
                                    handleChange("sub_exps", newSubs);
                                }}
                            />

                            <InputText type="date" value={sub.date_init}
                                onChange={(e) => {
                                    const newSubs = [...formValues.sub_exps];
                                    newSubs[index].date_init = e.target.value;
                                    handleChange("sub_exps", newSubs);
                                }}
                            />

                            <InputTextarea placeholder="Descripción" value={sub.description}
                                onChange={(e) => {
                                    const newSubs = [...formValues.sub_exps];
                                    newSubs[index].description = e.target.value;
                                    handleChange("sub_exps", newSubs);
                                }}
                            />

                            {/* SWITCH BONITO */}
                            <div className="flex align-items-center gap-2">
                                <InputSwitch
                                    checked={sub.exist_p === 1}
                                    onChange={(e) => {
                                        const newSubs = [...formValues.sub_exps];
                                        newSubs[index].exist_p = e.value ? 1 : 0;
                                        handleChange("sub_exps", newSubs);
                                    }}
                                />
                                <span className="text-sm text-gray-600">
                                    {sub.exist_p === 1 ? "Físico" : "Digital"}
                                </span>
                            </div>

                        </div>
                    ))}

                </div>
            )}

            <div className="border rounded p-3 bg-blue-50">
                <div className="text-sm font-semibold text-blue-700 mb-1">
                    { translations.documental_gestion.exp_files.form.name_generated }
                </div>

                <div className="text-sm text-gray-700 break-all">
                    {generarNombreExpediente() ||  translations.documental_gestion.exp_files.form.not_generated}
                </div>
            </div>

            <div className="flex justify-end">
                <Button label="Guardar expediente" onClick={handleSubmit} />
            </div>

        </div>
    );
};
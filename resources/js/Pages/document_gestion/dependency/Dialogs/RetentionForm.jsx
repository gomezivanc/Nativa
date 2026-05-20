import { InputText } from "primereact/inputtext";
import { usePage } from '@inertiajs/react'
import { useEffect, useState } from "react";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';

export default function RetentionForm({ form, setForm }) {
    const { translations, current_language } = usePage()?.props;
    const [tipos, setTipos] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    const handleDisposition = (field) => {
        setForm({
            ...form,
            [field]: !form[field]
        });
    };

    const existeTipo = (value) => {
        return tipos.some(tipo => {
            const label = tipo?.[`name_${current_language}`] ?? tipo?.name_es ?? tipo?.name_en;
            return label?.toLowerCase() === value.toLowerCase();
        });
    };

    const crearTipoDocumental = async (nombre) => {
        try {
            const res = await axios.post(route('tipos.createTypeDoc'), {
                [`name_es`]: nombre,
                [`name_en`]: nombre,
            });

            const nuevo = res.data;

            setTipos(prev => [...prev, nuevo]);

            setForm({
                ...form,
                tipos_documentales: [
                    ...(form.tipos_documentales || []),
                    nuevo.id
                ]
            });

        } catch (error) {
            console.error("Error creando tipo documental");
        }
    };

    useEffect(() => {
        axios.get(route('tipos.documentales'))
            .then(res => {
                setTipos(res.data);
            })
            .catch(() => {
                console.error("Error cargando tipos documentales");
            });
    }, []);

    return (
        <div className="flex flex-col gap-6 mt-4" >

            {/* TIEMPOS DE RETENCIÓN */}
            <div className="border rounded-lg p-4 bg-gray-50">

                <h4 className="font-semibold text-sm mb-4">
                    {translations.documental_gestion.retention.table.retention_times}
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    <span className="p-float-label">
                        <InputText value={form.archivo_gestion} onChange={(e) => setForm({...form, archivo_gestion: e.target.value})} className="w-full" />
                        <label>{translations.documental_gestion.retention.table.archivo_gestion}</label>
                    </span>
                    <span className="p-float-label">
                        <InputText value={form.archivo_central} onChange={(e) => setForm({...form, archivo_central: e.target.value})} className="w-full" />
                        <label>{translations.documental_gestion.retention.table.archivo_central}</label>
                    </span>
                </div>

            </div>

            {/* SOPORTE */}
            <div className="border rounded-lg p-4">

                <h4 className="font-semibold text-sm mb-3">
                    {translations.documental_gestion.retention.table.support_documental}
                </h4>

                <div className="flex gap-6">

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.papel} onChange={(e)=>setForm({...form, papel:e.target.checked})} 
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.paper}
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.electronico} onChange={(e)=>setForm({...form, electronico:e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.electronic}
                    </label>

                </div>

            </div>

            {/* DISPOSICIÓN FINAL */}
            <div className="border rounded-lg p-4">

                <h4 className="font-semibold text-sm mb-3">
                    {translations.documental_gestion.retention.table.final_disposition}
                </h4>

                <div className="grid grid-cols-2 gap-4">

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.eliminacion} onChange={()=>handleDisposition("eliminacion")} 
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.elimination}
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.conservacion_total} onChange={()=>handleDisposition("conservacion_total")}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.conservation_total}
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.seleccion} onChange={()=>handleDisposition("seleccion")}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.selection}
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.digitalizacion_micro} onChange={()=>handleDisposition("digitalizacion_micro")}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        {translations.documental_gestion.retention.table.digitalization_micro}
                    </label>

                </div>

            </div>

            {/* PROCEDIMIENTO */}
            <div className="border rounded-lg p-4">

                <span className="p-float-label mt-4">
                    <InputTextarea 
                        value={form.procedimiento}
                        onChange={(e) => setForm({ ...form, procedimiento: e.target.value })}
                        rows={4}
                        autoResize
                        className="w-full"
                    />
                    <label>{translations.documental_gestion.retention.table.procedure_description}</label>
                </span>

            </div>

            {/* TIPOS DOCUMENTALES */}
            <div className="border rounded-lg p-4">

                <h4 className="font-semibold text-sm mb-3">
                    {translations.documental_gestion.trd_versioning.table.type_doc}

                </h4>

                {tipos.length > 0 && (
                    <MultiSelect
                        value={form.tipos_documentales || []}
                        options={tipos}
                        optionLabel={(tipo) => 
                            tipo?.[`name_${current_language}`] 
                            ?? tipo?.name_es 
                            ?? tipo?.name_en 
                            ?? 'Sin nombre'
                        }
                        optionValue="id"
                        display="chip"
                        filter
                        onFilter={(e) => setFilterValue(e.filter)}
                        placeholder="Seleccionar tipos documentales"
                        onChange={(e) => {
                            setForm({
                                ...form,
                                tipos_documentales: e.value
                            });
                        }}
                        className="w-full"
                        panelFooterTemplate={() => {
                            if (!filterValue || existeTipo(filterValue)) return null;

                            return (
                                <div className="p-2 border-t">
                                    <Button
                                        label={`Crear: "${filterValue}"`}
                                        icon="pi pi-plus"
                                        className="p-button-text p-button-sm w-full justify-content-start"
                                        onClick={() => crearTipoDocumental(filterValue)}
                                    />
                                </div>
                            );
                        }}
                    />
                )}

            </div>

        </div>
    )
}
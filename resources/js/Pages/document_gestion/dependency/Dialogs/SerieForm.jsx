import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RetentionForm from "./RetentionForm";
import { InputSwitch } from 'primereact/inputswitch';
import { usePage, router } from '@inertiajs/react'

export default function SerieForm({ dependency, serie, onFinish }) {
    
    const { translations } = usePage()?.props
    const isEdit = !!serie;
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        code: "",
        name: "",
        retencion: false,
        tipos_documentales: []
    });
    const hasSubseries = serie?.subseries?.length > 0;

    useEffect(() => {
        if (serie) {
            const ret = serie.retencion || {};
            setForm({
                code: serie.code || "",
                name: serie.name || "",
                retencion: !!serie.retencion,
                subserie: !!serie.subseries,
                archivo_gestion: ret.archivo_gestion || "",
                archivo_central: ret.archivo_central || "",
                papel: ret.papel ?? false,
                electronico: ret.electronico ?? false,
                eliminacion: ret.eliminacion ?? false,
                conservacion_total: ret.conservacion_total ?? false,
                seleccion: ret.seleccion ?? false,
                digitalizacion_micro: ret.digitalizacion_micro ?? false,
                procedimiento: ret.procedimiento || "",
                tipos_documentales: ret.tipos_documentales?.map(t => t.id) || []
            });
        }
    }, [serie]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async () => {
        setLoading(true);

        try {
            let payload = {
                code: form.code,
                name: form.name,
                retencion: form.retencion
            };

            if (form.retencion) {
                payload = {
                    ...payload,
                    archivo_gestion: form.archivo_gestion,
                    archivo_central: form.archivo_central,
                    papel: form.papel,
                    electronico: form.electronico,
                    eliminacion: form.eliminacion,
                    conservacion_total: form.conservacion_total,
                    seleccion: form.seleccion,
                    digitalizacion_micro: form.digitalizacion_micro,
                    procedimiento: form.procedimiento,
                    tipos_documentales: form.tipos_documentales
                };
            }
            
            if (isEdit) {                
                await axios.put(route('series.update', { id: serie.id }),payload);
                toast.success(translations.documental_gestion.dependency.form.updated_successfully);
            } else {
                await axios.post(route('series.create', { dependencyId: dependency.id }),payload);
                toast.success(translations.documental_gestion.dependency.form.saved_successfully );
            }

            onFinish();
            setTimeout(() => {
                router.reload()
            }, 400)

        } catch (error) {
            toast.error("Error al guardar la serie");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label>{translations.documental_gestion.retention.table.code}</label>
                <InputText name="code" value={form.code} onChange={handleChange} className="w-full"/>
            </div>

            <div>
                <label>{translations.documental_gestion.retention.table.name}</label>
                <InputText name="name" value={form.name} onChange={handleChange} className="w-full" />
            </div>

            {!hasSubseries && (
                <div className="flex items-center gap-3 p-2 border rounded">

                    <InputSwitch
                        checked={form.retencion}
                        onChange={(e) => {
                            const checked = e.value;

                            setForm({
                                ...form,
                                retencion: checked,
                                ...(checked ? {} : {
                                    archivo_gestion: null,
                                    archivo_central: null,
                                    papel: false,
                                    electronico: false,
                                    eliminacion: false,
                                    conservacion_total: false,
                                    seleccion: false,
                                    digitalizacion_micro: false,
                                    procedimiento: null,
                                    tipos_documentales: []
                                })
                            });
                        }}
                    />

                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            ¿Esta serie tiene retención?
                        </span>
                        <span className="text-xs text-gray-500">
                            Actívalo si la serie no tendrá subseries
                        </span>
                    </div>

                </div>
            )}

            {form.retencion && !hasSubseries && (
                <div className="border rounded p-3 mt-2">
                    <RetentionForm form={form} setForm={setForm} />
                </div>
            )}

            <button onClick={submit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? translations.documental_gestion.retention.table.saving : translations.documental_gestion.retention.table.save}
            </button>
        </div>
    );
}
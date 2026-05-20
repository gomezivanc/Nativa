import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import axios from 'axios';
import RetentionForm from "./RetentionForm";
import { usePage, router } from '@inertiajs/react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function SubserieForm({ serie, subserie, onFinish }) {
    const { translations } = usePage()?.props
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        code: '',
        name: '',
        retencion: true,

        archivo_gestion: '',
        archivo_central: '',
        papel: false,
        electronico: false,
        eliminacion: false,
        conservacion_total: false,
        seleccion: false,
        digitalizacion_micro: false,
        procedimiento: '',
        tipos_documentales: []

    });
    
    useEffect(() => {
        if (subserie) {
            const ret = subserie.retencion || {};

            setForm({
                code: subserie.code || '',
                name: subserie.name || '',
                retencion: !!subserie.retencion,

                archivo_gestion: ret.archivo_gestion || '',
                archivo_central: ret.archivo_central || '',
                papel: ret.papel ?? false,
                electronico: ret.electronico ?? false,
                eliminacion: ret.eliminacion ?? false,
                conservacion_total: ret.conservacion_total ?? false,
                seleccion: ret.seleccion ?? false,
                digitalizacion_micro: ret.digitalizacion_micro ?? false,
                procedimiento: ret.procedimiento || '',
                tipos_documentales: ret.tipos_documentales?.map(t => t.id) || []
            });
        }
    }, [subserie]);

    const submit = async () => {

        if (loading) return;

        if (!form.code || !form.name) {
            toast.error("Código y nombre son obligatorios");
            return;
        }

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

            let response;

            if (subserie) {
                response = await axios.put(route('subseries.update', { id: subserie.id }),payload);
            } else {
                response = await axios.post(route('subseries.create', { serie: serie.id }),payload);
            }

            toast.success(subserie ? translations.documental_gestion.dependency.form.saved_successfully : translations.documental_gestion.dependency.form.updated_successfully);

            onFinish();

            setTimeout(() => {
                router.reload();
            }, 400);

        } catch (error) {

            console.error(error);
            toast.error(error.response?.data?.message || translations.documental_gestion.dependency.form.error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">

            <span className="p-float-label mt-5">
                <InputText value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} className="w-full" />
                <label>{translations.documental_gestion.retention.table.code}</label>
            </span>

            <span className="p-float-label mt-3">
                <InputText value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full" />
                <label>{translations.documental_gestion.retention.table.name}</label>
            </span>

            <RetentionForm form={form} setForm={setForm} />

            <div className="flex justify-end gap-2 mt-4">
                <button className="p-button p-button-text" onClick={onFinish}>
                    {translations.documental_gestion.retention.table.cancel}
                </button>

                <button className="p-button p-button-primary" onClick={submit}>
                    {translations.documental_gestion.retention.table.save}
                </button>
            </div>

        </div>
    )
}
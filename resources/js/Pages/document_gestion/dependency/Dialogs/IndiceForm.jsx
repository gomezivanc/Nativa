import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import axios from "axios";

export default function IndiceForm({ retencion, indice, modo, onFinish }) {

    const [indices, setIndices] = useState([]);
    const [form, setForm] = useState({
        indice_id: null,
        obligatorio: false,
        es_nombre: false,
        orden: 1
    });
    const [loading, setLoading] = useState(false);

    // Cargar indices
    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const res = await axios.get(route('indices.list'), {
                    params: { typeData: 'all' } 
                });

                // soporta paginado o array
                const data = res.data.data ?? res.data;
                setIndices(data);

            } catch (error) {
                toast.error("Error cargando índices");
            }
        };

        fetchIndices();
    }, []);

    // Cargar datos en modo edición
    useEffect(() => {
        if (modo === 'editar' && indice) {
            setForm({
                indice_id: indice.indice_id ?? indice.id,
                obligatorio: Boolean(indice.obligatorio),
                es_nombre: Boolean(indice.es_nombre),
                orden: indice.orden ?? 1
            });
        }
    }, [indice, modo]);

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {

        if (!form.indice_id) {
            toast.warn("Debes seleccionar un índice");
            return;
        }

        if (!retencion?.id) {
            toast.error("Retención inválida");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                retencion_id: retencion.id,
                indice_id: form.indice_id,
                obligatorio: form.obligatorio ? 1 : 0,
                es_nombre: form.es_nombre ? 1 : 0,
                orden: form.orden
            };

            if (modo === 'crear') {
                await axios.post(route('retencion_indices.store'), payload);
                toast.success("Índice agregado correctamente");
            } else {
                await axios.put(route('retencion_indices.update', { id: indice.id }), payload);
                toast.success("Índice actualizado correctamente");
            }

            onFinish();

        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                toast.warn(firstError);
            } else {
                toast.error("Error guardando índice");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">

            {/* INDICE */}
            <div>
                <label className="text-sm font-medium">Índice</label>
                <Dropdown
                    value={form.indice_id}
                    options={indices}
                    optionLabel="nombre"
                    optionValue="id"
                    onChange={(e) => handleChange('indice_id', e.value)}
                    placeholder="Seleccione un índice"
                    className="w-full"
                />
            </div>

            {/* ORDEN */}
            <div>
                <label className="text-sm font-medium">Orden</label>
                <InputNumber
                    value={form.orden}
                    onValueChange={(e) => handleChange('orden', e.value)}
                    className="w-full"
                    min={1}
                />
            </div>

            {/* ES PARTE DEL NOMBRE */}
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={form.es_nombre}
                    onChange={(e) => handleChange('es_nombre', e.checked)}
                />
                <label>¿Es parte del nombre?</label>
            </div>

            {/* OBLIGATORIO */}
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={form.obligatorio}
                    onChange={(e) => handleChange('obligatorio', e.checked)}
                />
                <label>Obligatorio</label>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    label="Cancelar"
                    severity="secondary"
                    onClick={onFinish}
                    disabled={loading}
                />
                <Button
                    label={modo === 'editar' ? 'Actualizar' : 'Guardar'}
                    onClick={handleSubmit}
                    loading={loading}
                />
            </div>

        </div>
    );
}

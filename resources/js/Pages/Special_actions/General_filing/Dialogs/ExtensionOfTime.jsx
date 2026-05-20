import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import axios from 'axios'; // Importamos axios para manejar el JSON

export default function ExtensionOfTime({ visible, onHide, filingId, type, header }) {
    const [observation, setObservation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) setObservation('');
    }, [visible]);

    const handleConfirm = async () => {
        if (!observation.trim()) {
            toast.warning('La observación es obligatoria');
            return;
        }

        setLoading(true);

        try {
            // Usamos axios porque tu controlador retorna un JSON
            const response = await axios.post(route('controler.accionEspecial'), {
                id_filing: filingId,
                tipo: type,
                observation: observation,
            });

            if (response.data.success) {
                toast.success('¡Operación realizada con éxito!');
                onHide(); // Cerramos el dialog
                
                // Forzamos a Inertia a refrescar los datos de la tabla 
                // sin recargar toda la página
                router.reload({ only: ['results'] }); 
            } else {
                toast.error('El servidor no pudo procesar la solicitud');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error crítico al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div className="flex justify-end gap-2">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={onHide} 
                className="p-button-text p-button-secondary" 
                disabled={loading}
            />
            <Button 
                label="Confirmar" 
                icon="pi pi-check" 
                onClick={handleConfirm} 
                loading={loading} 
                autoFocus 
            />
        </div>
    );

    return (
        <Dialog 
            header={header} 
            visible={visible} 
            style={{ width: '450px' }} 
            onHide={onHide}
            footer={footer}
            modal
            closable={!loading} // Evita que cierren el modal mientras procesa
        >
            <div className="flex flex-col gap-2 pt-2">
                <label className="font-semibold text-gray-600">Observación obligatoria:</label>
                <InputTextarea 
                    value={observation} 
                    onChange={(e) => setObservation(e.target.value)} 
                    rows={5} 
                    className={`w-full ${!observation.trim() && 'p-invalid'}`}
                    placeholder="Escriba aquí los detalles de la acción..."
                    disabled={loading}
                />
            </div>
        </Dialog>
    );
}
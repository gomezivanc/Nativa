import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransferFilingDialog = ({ 
    visible, 
    onHide, 
    selectedFiling, 
    distributionUnits,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [transferData, setTransferData] = useState({
        distribution_id_filing: null,
        transfer_type: 'unit', // o el valor por defecto que uses
        observation: ''
    });

    const handleTransfer = async () => {
        if (!transferData.distribution_id_filing) {
            toast.warning('Por favor selecciona una unidad');
            return;
        }

        try {
            setLoading(true);
            
            if(selectedFiling.is_copy){
                await axios.post(route('filing.transfer-copy', selectedFiling.copy_id),{
                    distribution_id_filing: transferData.distribution_id_filing
                });
            }else{
                await axios.post(route('filing.transfer', selectedFiling.id), {
                    distribution_id_filing: transferData.distribution_id_filing,
                    transfer_type: transferData.transfer_type,
                    observation: transferData.observation,
                });
            }

            
            toast.success('Radicado transferido correctamente');
            onHide(); // Cerrar diálogo
            if (onSuccess) onSuccess(); // Ejecutar refresco de datos
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al transferir');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header='Transferir a otra unidad' 
            modal 
            style={{ width: '450px' }}
            breakpoints={{'960px': '75vw', '641px': '90vw'}}
        >
            <div className='flex flex-col gap-4 mt-2'>
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-700'>
                        Unidad de Distribución
                    </label>
                    <Dropdown
                        value={transferData.distribution_id_filing}
                        onChange={(e) => setTransferData({ ...transferData, distribution_id_filing: e.value })}
                        options={distributionUnits}
                        optionLabel='name'
                        optionValue='id'
                        placeholder='Selecciona una unidad'
                        className='w-full'
                        filter // Recomendado si hay muchas unidades
                    />
                </div>

                <div className='flex gap-2 justify-end mt-4'>
                    <Button
                        label='Cancelar'
                        icon='pi pi-times'
                        onClick={onHide}
                        className='p-button-secondary p-button-text'
                    />
                    <Button
                        label='Transferir'
                        icon='pi pi-check'
                        onClick={handleTransfer}
                        loading={loading}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default TransferFilingDialog;
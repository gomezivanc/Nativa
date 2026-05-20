import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const LogsIndex = ({ logs }) => {
  // Estado para manejar el modal de JSON
  const [visible, setVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Configuración de paginación
  const [first, setFirst] = useState(0); // Número de la primera fila
  const [rows, setRows] = useState(10);  // Cantidad de filas por página

  const toast = useRef(null); // Ref para mostrar notificaciones

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Mostrar el JSON en el modal
  const showJson = (log) => {
    setSelectedLog(log);
    setVisible(true);
  };

  // Cerrar el modal
  const hideDialog = () => {
    setVisible(false);
  };

  // Función para manejar el cambio de página
  const onPageChange = (event) => {
    setFirst(event.first);  // Primera fila de la página
    setRows(event.rows);    // Filas por página
  };

  return (
    <div className="container mx-auto p-6">
        <Toast ref={toast} />

        <h1 className="text-2xl font-bold mb-4">Logs de Solicitudes de Préstamo Documental</h1>
        <DataTable
            value={logs.data}  // Aquí usamos logs.data, que contiene los registros para la página actual
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            totalRecords={logs.total}  // Total de registros que proviene de la paginación
            className="p-datatable-striped p-shadow-2"
            rowsPerPageOptions={[5, 10, 20, 50]} // Opciones para el número de filas por página
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros"
        >
            <Column field="id" header="ID" />
            <Column field="description" header="Descripción" />
            <Column field="created_at" header="Fecha" body={(rowData) => formatDate(rowData.created_at)} />
            <Column field="causer" header="Usuario" body={(rowData) => rowData.causer ? `${rowData.causer.persona.nombre} ${rowData.causer.persona.apellida}` : 'Desconocido'} />
            <Column field="subject_type" header="Modelo" />
            <Column field="event" header="Acción" />
            <Column
            body={(rowData) => (
                <div className="flex justify-center gap-2">
                {rowData.properties.attributes && (
                    <Button
                    label="Ver JSON después"
                    icon="pi pi-search"
                    onClick={() => showJson(rowData.properties.attributes)}
                    className="p-button-sm p-button-info"
                    />
                )}
                {rowData.properties.old && (
                    <Button
                    label="Ver JSON antes"
                    icon="pi pi-search"
                    onClick={() => showJson(rowData.properties.old)}
                    className="p-button-sm p-button-warning"
                    />
                )}
                </div>
            )}
            header="Ver JSON"
            />
        </DataTable>

        {/* Modal para mostrar el JSON */}
        <Dialog
            visible={visible}
            style={{ width: '50vw' }}
            onHide={hideDialog}
            header="JSON de Log"
            footer={<Button label="Cerrar" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />}
        >
            <table className="table border-collapse border w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Clave</th>
                        <th className="border px-4 py-2">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedLog ? (
                        Object.keys(selectedLog).map((key) => (
                            <tr key={key} className="border-b hover:bg-gray-100">
                                <td className="border px-4 py-2 font-semibold">{key}</td>
                                <td className="border px-4 py-2">{JSON.stringify(selectedLog[key])}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center p-4 text-gray-500">
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </Dialog>
    </div>
  );
};

export default LogsIndex;

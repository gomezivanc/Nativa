import { useState, useEffect, useCallback } from "react";
import { router, usePage } from "@inertiajs/react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TIPO_DATO_LABELS = {
    texto: { label: "Texto", color: "#185FA5", bg: "#E6F1FB" },
    numero: { label: "Número", color: "#3B6D11", bg: "#EAF3DE" },
    fecha: { label: "Fecha", color: "#854F0B", bg: "#FAEEDA" },
    booleano: { label: "Booleano", color: "#993556", bg: "#FBEAF0" },
    lista: { label: "Lista", color: "#533AB7", bg: "#EEEDFE" },
};

const TipoBadge = ({ tipo }) => {
    const cfg = TIPO_DATO_LABELS[tipo] || {
        label: tipo,
        color: "#5F5E5A",
        bg: "#F1EFE8"
    };

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: 20,
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.color}22`,
            }}
        >
            {cfg.label}
        </span>
    );
};

const EstadoBadge = ({ estado }) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: 20,
            background: estado ? "#EAF3DE" : "#FCEBEB",
            color: estado ? "#3B6D11" : "#A32D2D",
            border: `1px solid ${estado ? "#3B6D1133" : "#A32D2D33"}`
        }}
    >
        <span
            style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: estado ? "#639922" : "#E24B4A",
                display: "inline-block",
            }}
        />
        {estado ? "Activo" : "Inactivo"}
    </span>
);

export default function IndicesIndex() {

    const { translations } = usePage().props;
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterTipo, setFilterTipo] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = useCallback(async () => {

        setLoading(true);

        try {
            const response = await axios.get(route('indices.list'), {
                params: {
                    search,
                    tipo_dato: filterTipo,
                }
            });

            const data = response.data;
            setIndices(Array.isArray(data) ? data : (data.data ?? []));

        } catch (error) {
            console.error(error);
            setIndices([]);
        } finally {
            setLoading(false);
        }

    }, [search, filterTipo]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = async (id) => {

        const res = await Swal.fire({
            icon: 'question',
            text: '¿Desea cambiar el estado de este índice?',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar'
        });

        if (!res.isConfirmed) return;

        try {
            setDeletingId(id);
            router.delete(route('indices.destroy', id), {
                preserveScroll: true,

                onSuccess: (page) => {
                    toast.success(page?.props?.flash?.message || "Estado actualizado correctamente" );
                    fetchData();
                },
                onError: () => {
                    toast.error("Error al procesar la solicitud.");
                },
                onFinish: () => {
                    setDeletingId(null);
                }
            });

        } catch (error) {

            console.error(error);
            toast.error("Ocurrió un error");
        }
    };

    const actionsTemplate = (rowData) => (
        <div className='flex gap-2 justify-center'>

            <Button
                icon='pi pi-pencil'
                rounded
                text
                severity='warning'
                tooltip='Editar'
                onClick={() => router.visit(route('indices.edit', rowData.id))}
            />

            <Button
                icon={rowData.estado ? 'pi pi-trash' : 'pi pi-refresh'}
                rounded
                text
                severity={rowData.estado ? 'danger' : 'success'}
                tooltip={rowData.estado ? 'Desactivar' : 'Activar'}
                loading={deletingId === rowData.id}
                onClick={() => handleToggle(rowData.id)}
            />

        </div>
    );

    const items = [
        { label: translations.menu.configuration.configuration },
        { label: 'Índices' }
    ];

    const home = {icon: 'pi pi-home', url: '/main' };

    return (

        <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>

            {/* Breadcrumb */}
            <div className='mb-4'>
                <BreadCrumb model={items} home={home} />
            </div>

            <Card className='shadow-md border-none rounded-xl overflow-hidden'>

                {/* Header */}
                <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>

                    <div className='flex items-center gap-3'>
                        <i className='pi pi-tags text-2xl text-indigo-600'></i>

                        <div>
                            <h1 className='text-2xl font-bold text-gray-800 m-0'> Índices </h1>
                            <p className='text-sm text-gray-500 mt-1'> Gestión del catálogo de índices disponibles en el sistema </p>
                        </div>

                    </div>

                    <Button label='Nuevo Índice' icon='pi pi-plus' onClick={() => router.visit(route('indices.create'))} className='bg-indigo-600 border-indigo-600 hover:bg-indigo-700'/>

                </div>

                {/* Filters */}
                <div className='flex flex-col md:flex-row gap-3 mb-5'>

                    <span className='p-input-icon-left w-full'>
                        <i className='pi pi-search' />
                        <InputText value={search}  onChange={(e) => setSearch(e.target.value)} placeholder='Buscar por nombre o código' className='w-full' />
                    </span>

                    <Dropdown value={filterTipo}
                        options={Object.entries(TIPO_DATO_LABELS).map(([key, item]) => ({
                            label: item.label,
                            value: key
                        }))}
                        onChange={(e) => setFilterTipo(e.value)}
                        placeholder='Todos los tipos'
                        showClear
                        className='w-full md:w-18rem'
                    />

                </div>

                {/* Table */}
                <div className='border border-gray-200 rounded-xl overflow-hidden'>

                    <DataTable value={indices} paginator rows={10} stripedRows responsiveLayout='scroll' rowHover loading={loading} emptyMessage='No se encontraron índices' className='p-datatable-sm'>

                        <Column field='codigo' header='Código'
                            body={(rowData) => (
                                <code className='bg-gray-100 px-2 py-1 rounded text-xs'>
                                    {rowData.codigo}
                                </code>
                            )}
                            style={{ width: '10rem' }}
                        />

                        <Column field='nombre' header='Nombre' />
                        <Column field='tipo_dato' header='Tipo de dato' body={(rowData) => ( <TipoBadge tipo={rowData.tipo_dato} /> )}/>
                        <Column field='estado' header='Estado' body={(rowData) => (<EstadoBadge estado={rowData.estado} /> )} />
                        <Column header='Acciones' body={actionsTemplate} align='center' style={{ width: '10rem' }} />

                    </DataTable>

                </div>

            </Card>

        </div>
    );
}
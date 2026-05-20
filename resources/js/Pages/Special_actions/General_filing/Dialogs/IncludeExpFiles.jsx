import { usePage , router } from "@inertiajs/react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Column } from 'primereact/column';
import { Chip } from "primereact/chip";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

export const IncludeExpFiles = ({visible, onHide, filing, archiveClasification = [], dependencies = [], defaultVals = {},
        onFinish = () => {}
    }) => {
    const { translations } = usePage()?.props;
    const { control, getValues, handleSubmit, reset } = useForm({
        defaultValues: {
            filter_exp_number: '',
            filter_exp_name: '',
            archive_id: null,
            dependency_id: null,
            serie_id: null,
            subserie_id: null,
            ...defaultVals
        }
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [tableExpFiles, setTableExpFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [filteredSubseries, setFilteredSubseries] = useState([]);

    const handleClose = () => {
        reset({
            filter_exp_number: '',
            filter_exp_name: '',
            archive_id: null,
            dependency_id: null,
            serie_id: null,
            subserie_id: null,
        });

        setSelectedItems([]);
        setTableExpFiles([]);
        setFilteredSeries([]);
        setFilteredSubseries([]);
        setSearched(false);

        onHide();
    };

    async function submit(data) {
        setLoading(true);
        data.exp_files_ids = selectedItems.map(item => item.id);
        data.ids_filing = [filing.id];

        try {
            const res = await axios.post(route("filing.include-exp-filing"), data);
            if (res.data.success) {
                if (res.data.insertedRecords.length > 0) {
                    toast.success(
                        <div>
                            <p className="font-bold">
                                {translations.filing.standard_filing.exp_files_success}
                            </p>
                            <ul className="list-disc list-inside">
                                {res.data.insertedRecords.map((item, index) => (
                                    <li key={index}>
                                        {item.filing} {item.exp_file_num} {item.exp_file}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                if (res.data.alreadyExists.length > 0) {
                    toast.warning(
                        <div>
                            <p className="font-bold">
                                {translations.filing.standard_filing.exp_files_already}
                            </p>
                            <ul className="list-disc list-inside">
                                {res.data.alreadyExists.map((item, index) => (
                                    <li key={index}>
                                        {item.filing} - {item.exp_file_num} {item.exp_file}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                onFinish();
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const searchExpFile = async () => {
        try {
            setLoading(true);
            const data = getValues();
            const serie = data.serie_id
                ? { id: data.serie_id.id, code: data.serie_id.code, name: data.serie_id.name }
                : null;
            const subserie = data.subserie_id
                ? { id: data.subserie_id.id, code: data.subserie_id.code, name: data.subserie_id.name }
                : null;

            const res = await axios.get(route('files-exp.list'), {
                params: {
                    typeData: 'todos',
                    name: data.filter_exp_name,
                    numberExp: data.filter_exp_number,
                    archive_id: data.archive_id,
                    dependency_id: data.dependency_id,
                    serie,
                    subserie
                }
            });
            setTableExpFiles(res.data || []);
            setSearched(true);
        } catch (error) {
            toast.error(translations.auth.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectionChange = (e) => setSelectedItems(e.value);
    const removeChip = (item) => setSelectedItems(prev => prev.filter(i => i.number !== item.number));

    const handleCreateExpediente = () => {
        router.get(route('files-exp.index'));
    };

    const dialogHeader = (
        <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        flexShrink: 0
                    }}
                >
                    <i className="pi pi-folder-open text-white" style={{ fontSize: '1.1rem' }} />
                </div>
                <div>
                    <p className="m-0 font-semibold text-gray-800 text-base leading-tight">
                        Archivar en Expediente
                    </p>
                    {filing?.filing_number && (
                        <p className="m-0 text-xs text-gray-400 mt-0.5">
                            Radicado #{filing.filing_number}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Dialog
            header={dialogHeader}
            visible={visible}
            onHide={handleClose}
            modal
            style={{ width: '78vw', maxWidth: 1100 }}
            breakpoints={{ '960px': '92vw', '640px': '98vw' }}
            pt={{
                root: { className: 'rounded-2xl overflow-hidden shadow-2xl' },
                header: {
                    style: {
                        background: '#f8f9ff',
                        borderBottom: '1px solid #e8eaf6',
                        padding: '1rem 1.5rem',
                    }
                },
                content: {
                    style: {
                        padding: '1.5rem',
                        background: '#ffffff'
                    }
                },
                footer: { style: { display: 'none' } }
            }}
        >
            <form onSubmit={handleSubmit(submit)}>

                {/* ── SECCIÓN 1: Identificación del radicado ── */}
                <div
                    className="flex items-center justify-between rounded-xl px-4 py-3 mb-5"
                    style={{ background: '#eef0ff', border: '1px solid #c7d0fa' }}
                >
                    <div className="flex items-center gap-2">
                        <i className="pi pi-tag text-indigo-500" style={{ fontSize: '0.9rem' }} />
                        <span className="text-sm font-medium text-indigo-700">
                            Radicado vinculado:
                        </span>
                        <span
                            className="font-bold text-sm rounded-lg px-3 py-1"
                            style={{
                                background: '#6366f1',
                                color: '#fff',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {filing?.filing_number ?? '—'}
                        </span>
                    </div>

                    {/* Botón crear expediente */}
                    <button
                        type="button"
                        onClick={handleCreateExpediente}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                        style={{
                            background: '#fff',
                            border: '1px solid #c7d0fa',
                            color: '#4f46e5',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(99,102,241,0.08)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#f0f1ff';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(99,102,241,0.08)';
                        }}
                    >
                        <i className="pi pi-plus-circle" style={{ fontSize: '0.9rem' }} />
                        Crear nuevo expediente
                        <i className="pi pi-external-link" style={{ fontSize: '0.75rem', opacity: 0.7 }} />
                    </button>
                </div>

                {/* ── SECCIÓN 2: Filtros de búsqueda ── */}
                <div
                    className="rounded-xl mb-5"
                    style={{ border: '1px solid #e5e7eb', overflow: 'hidden' }}
                >
                    {/* Header de la sección */}
                    <div
                        className="flex items-center gap-2 px-4 py-2.5"
                        style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}
                    >
                        <i className="pi pi-search text-gray-400" style={{ fontSize: '0.85rem' }} />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            {translations?.filing?.standard_filing?.find_file ?? 'Buscar expediente'}
                        </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">

                        {/* Número de expediente */}
                        <Controller
                            name="filter_exp_number"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">
                                        {translations?.filing?.standard_filing?.file_number ?? 'Número'}
                                    </label>
                                    <InputText
                                        id="filter_exp_number"
                                        {...field}
                                        placeholder="Ej: EXP-2024-001"
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                    />
                                </div>
                            )}
                        />

                        {/* Nombre de expediente */}
                        <Controller
                            name="filter_exp_name"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">
                                        {translations?.filing?.standard_filing?.file_name ?? 'Nombre'}
                                    </label>
                                    <InputText
                                        id="filter_exp_name"
                                        {...field}
                                        placeholder="Buscar por nombre..."
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {/* Segunda fila: Archivo / Dependencia / Serie / Subserie */}
                    <div
                        className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                    >
                        <Controller
                            name="archive_id"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Archivo</label>
                                    <Dropdown
                                        {...field}
                                        options={archiveClasification}
                                        optionLabel="name_es"
                                        optionValue="id"
                                        placeholder="Seleccione"
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="dependency_id"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Dependencia</label>
                                    <Dropdown
                                        {...field}
                                        options={dependencies}
                                        optionLabel="name"
                                        optionValue="id"
                                        placeholder="Seleccione"
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            const dep = dependencies.find(d => d.id === e.value);
                                            setFilteredSeries(dep?.series || []);
                                            setFilteredSubseries([]);
                                        }}
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="serie_id"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Serie</label>
                                    <Dropdown
                                        {...field}
                                        options={filteredSeries}
                                        optionLabel="name"
                                        placeholder="Seleccione"
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            setFilteredSubseries(e.value?.subseries || []);
                                        }}
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="subserie_id"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Subserie</label>
                                    <Dropdown
                                        {...field}
                                        options={filteredSubseries}
                                        optionLabel="name"
                                        placeholder="Seleccione"
                                        className="w-full"
                                        style={{ borderRadius: 8, fontSize: '0.875rem' }}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {/* Botón buscar */}
                    <div
                        className="flex justify-end px-4 pb-4"
                    >
                        <Button
                            icon="pi pi-search"
                            label={translations?.filing?.standard_filing?.find_file ?? 'Buscar'}
                            size="small"
                            type="button"
                            loading={loading}
                            onClick={searchExpFile}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.5rem 1.25rem',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                </div>

                {/* ── SECCIÓN 3: Resultados ── */}
                <div
                    className="rounded-xl mb-4"
                    style={{ border: '1px solid #e5e7eb', overflow: 'hidden' }}
                >
                    <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}
                    >
                        <div className="flex items-center gap-2">
                            <i className="pi pi-list text-gray-400" style={{ fontSize: '0.85rem' }} />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                Resultados
                            </span>
                            {tableExpFiles.length > 0 && (
                                <span
                                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                                    style={{
                                        background: '#eef0ff',
                                        color: '#4f46e5'
                                    }}
                                >
                                    {tableExpFiles.length}
                                </span>
                            )}
                        </div>

                        {selectedItems.length > 0 && (
                            <span
                                className="rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{ background: '#dcfce7', color: '#15803d' }}
                            >
                                {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <DataTable
                        value={tableExpFiles}
                        selectionMode="multiple"
                        selection={selectedItems}
                        onSelectionChange={handleSelectionChange}
                        paginator
                        rows={8}
                        emptyMessage={
                            <div className="flex flex-col items-center py-8 text-gray-400">
                                <i className="pi pi-inbox text-4xl mb-2 opacity-30" />
                                <span className="text-sm">
                                    {!searched
                                        ? 'Use los filtros y presione Buscar para encontrar expedientes'
                                        : (translations?.auth?.no_data ?? 'Sin resultados')}
                                </span>
                                {!searched && (
                                    <button
                                        type="button"
                                        onClick={handleCreateExpediente}
                                        className="mt-3 text-indigo-500 text-xs underline underline-offset-2 cursor-pointer bg-transparent border-none"
                                    >
                                        ¿No existe el expediente? Créalo aquí →
                                    </button>
                                )}
                            </div>
                        }
                        size="small"
                        rowHover
                        style={{ fontSize: '0.875rem' }}
                    >
                        <Column selectionMode="multiple" style={{ width: 40 }} />
                        <Column
                            header={translations?.filing?.standard_filing?.file_number ?? 'Número'}
                            field="number"
                            style={{ fontWeight: 500, color: '#4f46e5' }}
                        />
                        <Column
                            header={translations?.filing?.standard_filing?.file_name ?? 'Nombre'}
                            field="name"
                        />
                    </DataTable>
                </div>

                {/* ── SECCIÓN 4: Chips de selección ── */}
                {selectedItems.length > 0 && (
                    <div
                        className="rounded-xl p-4 mb-5"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                        <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                            <i className="pi pi-check-circle" style={{ fontSize: '0.85rem' }} />
                            Expedientes seleccionados para archivar
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedItems.map(item => (
                                <Chip
                                    key={item.number}
                                    label={`${item.number} — ${item.name}`}
                                    removable
                                    onRemove={() => removeChip(item)}
                                    className="p-chip"
                                    style={{
                                        background: '#dcfce7',
                                        color: '#166534',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ACCIONES FINALES ── */}
                <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid #f1f2f7' }}
                >
                    <button
                        type="button"
                        onClick={handleCreateExpediente}
                        className="flex items-center gap-2 text-sm text-indigo-500 bg-transparent border-none cursor-pointer"
                        style={{ padding: 0, fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#4338ca'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}
                    >
                        <i className="pi pi-folder-plus" style={{ fontSize: '0.9rem' }} />
                        Crear expediente nuevo
                    </button>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            label="Cancelar"
                            outlined
                            severity="secondary"
                            size="small"
                            onClick={handleClose}
                        />
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={selectedItems.length === 0}
                            label={translations?.documental_gestion?.exp_files?.save ?? 'Archivar seleccionados'}
                            size="small"
                            style={{
                                background: selectedItems.length > 0
                                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                    : undefined,
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                opacity: selectedItems.length === 0 ? 0.5 : 1
                            }}
                        />
                    </div>
                </div>

            </form>
        </Dialog>
    );
};

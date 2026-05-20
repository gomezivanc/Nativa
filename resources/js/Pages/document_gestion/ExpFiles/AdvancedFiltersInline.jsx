import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import axios from 'axios'

const FILTER_DEFS = [
    { label: 'Creado por', value: 'usuario' },
    { label: 'Estado',     value: 'estado'  },
]

export const AdvancedFiltersInline = ({ onSearch, filters = {}, setFilters, officialsOptions = [] }) => {
    const [users, setUsers] = useState([])
    const [open,  setOpen]  = useState(false)
    const [active, setActive] = useState([])

    useEffect(() => {
        axios.get(route('usuarios.list'), { params: { typeData: 'todos' } })
            .then(r => setUsers(r.data ?? []))
    }, [])

    const patch = (field, value) => {
        if (typeof setFilters === 'function') {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
    };

    function addChip(type) {
        if (!active.includes(type)) {
            setActive(prev => [...prev, type])
        }
    };

    function removeChip(type) {
        setActive(prev => prev.filter(i => i !== type))
        const resets = {
            usuario: { creado_por_id: null },
            estado:  { active: null },
        }
        setFilters(prev => ({ ...prev, ...(resets[type] || {}) }))
    };

    const availableToAdd = FILTER_DEFS
        .filter(f => !active.includes(f.value))
        .map(f => ({
            ...f,
            disabled: f.value === 'usuario' && !filters?.dependency_id
        }));

    return (
        <div className="mb-4">
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    text
                    size="small"
                    icon={`pi pi-${open ? 'chevron-up' : 'plus-circle'}`}
                    label={open ? 'Menos criterios' : 'Más criterios de búsqueda'}
                    onClick={() => setOpen(v => !v)}
                    className="text-gray-500 hover:text-blue-600 p-0 text-xs shadow-none"
                />

                {/* filtros activos */}
                <div className="flex gap-2">
                    {active.map(a => (
                        <Tag key={a} severity="info" className="bg-blue-50 text-blue-700 border border-blue-100 font-normal text-xs px-2" style={{ borderRadius: '12px' }}>
                            <span className="flex items-center gap-2"> {FILTER_DEFS.find(f => f.value === a)?.label}
                                <i className="pi pi-times cursor-pointer text-[10px]" onClick={() => removeChip(a)} />
                            </span>
                        </Tag>
                    ))}
                </div>
            </div>

            {open && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 p-4 bg-white border border-dashed border-gray-300 rounded-lg animate-fade-in">
                    
                    {/* Búsqueda por Texto (Nombre/Número) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Palabra clave</label>
                        <InputText
                            size="small"
                            value={filters?.text || ''} // Uso de Optional Chaining (?.) y fallback (|| '')
                            onChange={e => patch('text', e.target.value)}
                            placeholder="Nombre o descripción..."
                            className="p-inputtext-sm"
                        />
                    </div>

                    {/* Agregar otros criterios dinámicos */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Añadir criterio</label>
                        <Dropdown
                            size="small"
                            placeholder="Seleccione campo..."
                            options={availableToAdd}
                            optionLabel="label"
                            optionValue="value"
                            onChange={e => addChip(e.value)}
                            className="p-inputtext-sm"
                            disabled={availableToAdd.length === 0}
                        />
                    </div>

                    {/* Input dinámico: Usuario */}
                    {active.includes('usuario') && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600">
                                Funcionario
                            </label>

                            <Dropdown
                                value={filters.creado_por_id}
                                options={officialsOptions}
                                onChange={(e) => patch('creado_por_id', e.value)}
                                placeholder={
                                    !filters?.dependency_id
                                        ? "Seleccione una dependencia primero"
                                        : "Seleccione funcionario"
                                }
                                disabled={!filters?.dependency_id}
                                filter
                                showClear
                                className="p-inputtext-sm w-full"
                            />
                        </div>
                    )}

                    {/* Input dinámico: Estado */}
                    {active.includes('estado') && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600">Estado del registro</label>
                            <Dropdown
                                size="small"
                                options={[
                                    { label: 'Activo', value: true },
                                    { label: 'Inactivo', value: false }
                                ]}
                                value={filters.active}
                                onChange={e => patch('active', e.value)}
                                placeholder="Estado..."
                                className="p-inputtext-sm"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
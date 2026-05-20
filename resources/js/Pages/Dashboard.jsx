import { useState } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { router } from "@inertiajs/react";

// Tarjetas de Estadísticas Principales (Rediseñadas con gradientes sutiles)
const StatCard = ({ title, value, icon, colorClass, iconColorClass, subtext }) => {
    return (
        <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-white/40 bg-white relative overflow-hidden`}>
            {/* Efecto decorativo de fondo */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
                    <div className="text-3xl font-bold text-slate-800">{value}</div>
                    {subtext && <div className="text-sm text-slate-400 mt-2 font-medium">{subtext}</div>}
                </div>
                <div className={`flex items-center justify-center w-14 h-14 rounded-xl shadow-inner ${colorClass}`}>
                    <i className={`pi ${icon} text-2xl ${iconColorClass}`}></i>
                </div>
            </div>
        </div>
    );
};

// Componente de barra de progreso
const MiniProgress = ({ title, value, total, colorStr, icon }) => {
    const percentage = Math.round((value / total) * 100) || 0;
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-${colorStr}-100 text-${colorStr}-600`}>
                        <i className={`pi ${icon} text-sm`}></i>
                    </div>
                    <span className="font-semibold text-slate-700">{title}</span>
                </div>
                <div className="text-right">
                    <span className="font-bold text-slate-800">{value}</span>
                    <span className="text-slate-400 text-sm ml-1">/ {total}</span>
                </div>
            </div>
            <ProgressBar value={percentage} color={`var(--${colorStr}-500)`} className="h-2 rounded-full" showValue={false} />
            <div className="text-right mt-1 text-xs text-slate-500 font-medium">{percentage}% completado</div>
        </div>
    );
};

// Tarjeta para los gráficos
const ChartCard = ({ title, type, data, options, subtitle }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[250px] relative">
                <div className="w-full h-full absolute inset-0">
                    <Chart type={type} data={data} options={options} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};

const depFilterConfig = [
    { key: 'total', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'expired', label: 'Vencidos' },
    { key: 'finished_count', label: 'Finalizados' },
    { key: 'cancelled', label: 'Anulados' },
    { key: 'responded', label: 'Con respuesta' },
];

const depFilterActiveClass = {
    total:   'bg-slate-100 text-slate-700 ring-1 ring-slate-300',
    active:  'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300',
    expired: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    finished_count: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300',
    cancelled: 'bg-rose-100 text-rose-700 ring-1 ring-rose-300',
    responded: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300',
};

const Dashboard = ({ stats, logs, roles, usersPerRole, dependencies, usersPerDependency, filingsByDay, filingsByDependency, filingsByRegional, topApplicants, dateFrom, dateTo, totalFilingsInRange, totalEntrada, totalSalida }) => {
    const totalReports = stats.reports.reduce((prev, acc) => prev + (acc.total || 0), 0);

    // Estado para filtros de fecha
    const [filters, setFilters] = useState({ date_from: dateFrom, date_to: dateTo });

    // Estado para filtro de dependencias
    const [depFilter, setDepFilter] = useState('total');

    // Paletas de colores
    const colors = {
        primary: ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6"],
        background: ["rgba(79, 70, 229, 0.8)", "rgba(14, 165, 233, 0.8)", "rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(139, 92, 246, 0.8)", "rgba(236, 72, 153, 0.8)", "rgba(239, 68, 68, 0.8)", "rgba(20, 184, 166, 0.8)"]
    };

    // 1. Datos para gráfica de radicados por día
    const filingsByDayData = {
        labels: filingsByDay.map(d => d.day),
        datasets: [{
            label: 'Radicados',
            data: filingsByDay.map(d => d.total),
            backgroundColor: colors.background[0],
            borderColor: colors.primary[0],
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { grid: { display: false } }
        }
    };

    // 2. Datos para dependencias (filtrados dinámicamente)
    const dependencyLabels = filingsByDependency.map(d => d.dependency_name);
    const dependencyValues = filingsByDependency.map(d => Number(d[depFilter]) || 0);

    const dependencyData = {
        labels: dependencyLabels,
        datasets: [{
            label: 'Radicados',
            data: dependencyValues,
            backgroundColor: colors.background,
            borderColor: "white",
            borderWidth: 2,
            hoverOffset: 4
        }],
    };

    // 3. Datos para tipos de radicado (asunto)
    const reportsLabels = stats.reports.map(r => r.name);
    const reportsValues = stats.reports.map(r => r.total);
    const reportsData = {
        labels: reportsLabels,
        datasets: [{
            data: reportsValues,
            backgroundColor: colors.background,
            borderColor: "white",
            borderWidth: 2,
            hoverOffset: 4
        }],
    };

    // 4. Datos para sedes
    const regionalLabels = filingsByRegional.map(r => r.regional_name);
    const regionalValues = filingsByRegional.map(r => r.total);
    const regionalData = {
        labels: regionalLabels,
        datasets: [{
            data: regionalValues,
            backgroundColor: [...colors.background].reverse(),
            borderColor: "white",
            borderWidth: 2,
            hoverOffset: 4
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { usePointStyle: true, padding: 20, font: { family: "'Inter', sans-serif", size: 12 } },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 13 },
                bodyFont: { size: 14, weight: 'bold' },
            },
        },
        cutout: "65%",
    };

    // 5. Top solicitantes con porcentajes
    const maxApplicant = topApplicants.length > 0 ? topApplicants[0].total : 1;

    const applyFilters = () => {
        router.get(route('main'), { date_from: filters.date_from, date_to: filters.date_to }, { preserveState: true });
    };

    return (
        <div className="bg-slate-50/50 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header con filtros de fecha */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Control</h1>
                        <p className="text-slate-500 mt-1">Resumen general y métricas del sistema.</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Desde</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Hasta</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <Button
                            label="Aplicar"
                            icon="pi pi-search"
                            size="small"
                            className="mt-5"
                            onClick={applyFilters}
                        />
                    </div>
                </div>

                {/* Top Cards - KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Usuarios Activos"
                        value={stats.users.active}
                        icon="pi-users"
                        colorClass="bg-indigo-50"
                        iconColorClass="text-indigo-600"
                        subtext={`De ${stats.users.total} registrados`}
                    />
                    <StatCard
                        title="Clientes Activos"
                        value={stats.clients.active}
                        icon="pi-briefcase"
                        colorClass="bg-emerald-50"
                        iconColorClass="text-emerald-600"
                        subtext={`De ${stats.clients.total} registrados`}
                    />
                    <StatCard
                        title="Radicados"
                        value={totalFilingsInRange}
                        icon="pi-folder-open"
                        colorClass="bg-violet-50"
                        iconColorClass="text-violet-600"
                        subtext={
                            <div className="flex gap-3 mt-2 text-sm">
                                <span className="text-emerald-600 font-semibold">
                                    <i className="pi pi-arrow-down-left text-xs mr-1"></i>
                                    Entrada: {totalEntrada}
                                </span>
                                <span className="text-rose-600 font-semibold">
                                    <i className="pi pi-arrow-up-right text-xs mr-1"></i>
                                    Salida: {totalSalida}
                                </span>
                            </div>
                        }
                    />

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Métricas Generales</h3>
                        <MiniProgress title="Usuarios" value={stats.users.active} total={stats.users.total} colorStr="indigo" icon="pi-user" />
                        <div className="my-2 border-t border-slate-50"></div>
                        <MiniProgress title="Clientes" value={stats.clients.active} total={stats.clients.total} colorStr="emerald" icon="pi-building" />
                    </div>
                </div>

                {/* Sección 1: Radicados por Día */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Radicados por Día</h3>
                        <p className="text-sm text-slate-500">Distribución diaria de radicados generados</p>
                    </div>
                    <div className="h-[300px] relative">
                        {filingsByDay.length > 0 ? (
                            <Chart type="bar" data={filingsByDayData} options={barChartOptions} className="w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                No hay radicados en el período seleccionado
                            </div>
                        )}
                    </div>
                </div>

                {/* Sección 2: Radicados por Dependencia */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Radicados por Dependencia</h3>
                            <p className="text-sm text-slate-500">Total de radicados asignados por dependencia</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {depFilterConfig.map((cfg) => (
                                <button
                                    key={cfg.key}
                                    onClick={() => setDepFilter(cfg.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        depFilter === cfg.key
                                            ? depFilterActiveClass[cfg.key]
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {filingsByDependency.map((dep, index) => {
                                    const val = Number(dep[depFilter]) || 0;
                                    const pct = dep.total > 0 ? Math.round((val / dep.total) * 100) : 0;
                                    return (
                                        <div key={index} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-50">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 shrink-0">
                                                    <i className="pi pi-building text-slate-500 text-sm"></i>
                                                </div>
                                                <span className="font-medium text-slate-700 truncate text-sm">{dep.dependency_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="font-bold text-slate-800">{val}</span>
                                                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                                    {pct}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="lg:col-span-2 h-[400px] relative">
                            {filingsByDependency.length > 0 ? (
                                <Chart type="bar" data={dependencyData} options={barChartOptions} className="w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    No hay datos para mostrar
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección 3: Radicados por Asunto + Sedes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Radicados por Tipo"
                        subtitle="Distribución por tipo de procedimiento"
                        type="doughnut"
                        data={reportsData}
                        options={chartOptions}
                    />
                    <ChartCard
                        title="Radicados por Sedes"
                        subtitle="Estadísticas agrupadas por sede o regional"
                        type="doughnut"
                        data={regionalData}
                        options={chartOptions}
                    />
                </div>

                {/* Sección 4: Top Solicitantes + Actividad */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Solicitantes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Radicados por Solicitante</h3>
                            <p className="text-sm text-slate-500">Top solicitantes más frecuentes</p>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                            {topApplicants.map((item, index) => {
                                const percentage = Math.round((item.total / maxApplicant) * 100);
                                const globalPct = totalFilingsInRange > 0 ? Math.round((item.total / totalFilingsInRange) * 100) : 0;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-slate-700 text-sm truncate">{item.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="font-bold text-slate-800 text-sm">{item.total}</span>
                                                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                                    {globalPct}%
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressBar value={percentage} className="h-1.5 rounded-full" showValue={false} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actividad Reciente */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Actividad Reciente</h3>
                                <p className="text-sm text-slate-500">Últimos movimientos en el sistema</p>
                            </div>
                            <Button
                                label="Ver todo"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                size="small"
                                text
                                onClick={() => router.visit(route("logs.index"))}
                            />
                        </div>
                        <div className="space-y-4">
                            {logs.slice(0, 5).map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <Avatar
                                        icon="pi pi-bolt"
                                        className="bg-amber-100 text-amber-600"
                                        shape="circle"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                {log.log_name} <span className="text-slate-400 font-normal ml-2">ID: {log.id}</span>
                                            </p>
                                            <span className="text-xs text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
                                                {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">{log.description}</p>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <i className="pi pi-user text-slate-400"></i>
                                            {log.causer ? `${log.causer.persona.nombre} ${log.causer.persona.apellido}` : "Sistema"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
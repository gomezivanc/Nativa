import { useState, useEffect, useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { router } from "@inertiajs/react";

/* ================================================================
   PALETA IBAGUÉ — colores usados en TODO el dashboard
   ================================================================ */
const C = {
    ibg700: '#3c648b',
    ibg900: '#1e3a5f',
    amber: '#d4a843',
    terracotta: '#c45c4a',
    emerald: '#10b981',
    violet: '#8b5cf6',
    sky: '#0ea5e9',
    rose: '#ef4444',
    teal: '#14b8a6',
};

const chartColors = {
    primary: [C.ibg700, C.amber, C.terracotta, C.emerald, C.violet, C.sky, C.rose, C.teal],
    bg: [
        'rgba(60,100,139,0.85)', 'rgba(212,168,67,0.85)', 'rgba(196,92,74,0.85)',
        'rgba(16,185,129,0.85)', 'rgba(139,92,246,0.85)', 'rgba(14,165,233,0.85)',
        'rgba(239,68,68,0.85)', 'rgba(20,184,166,0.85)'
    ],
    bgSoft: [
        'rgba(60,100,139,0.12)', 'rgba(212,168,67,0.12)', 'rgba(196,92,74,0.12)',
        'rgba(16,185,129,0.12)', 'rgba(139,92,246,0.12)', 'rgba(14,165,233,0.12)',
        'rgba(239,68,68,0.12)', 'rgba(20,184,166,0.12)'
    ],
};

/* ================================================================
   HOOK — contador animado
   ================================================================ */
function useCountUp(target, duration = 1200, startOnMount = true) {
    const [val, setVal] = useState(0);
    const raf = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
        if (!startOnMount) return;
        const animate = (ts) => {
            if (!startTime.current) startTime.current = ts;
            const progress = Math.min((ts - startTime.current) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setVal(Math.round(eased * target));
            if (progress < 1) {
                raf.current = requestAnimationFrame(animate);
            }
        };
        raf.current = requestAnimationFrame(animate);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }, [target, duration, startOnMount]);

    return val;
}

/* ================================================================
   COMPONENTE — Tarjeta KPI animada
   ================================================================ */
const StatCard = ({ title, value, icon, colorKey = 'ibg700', delay = 0, subtext }) => {
    const display = useCountUp(value, 1500);
    const colorMap = {
        ibg700: { bg: 'bg-ibg-700/10', text: 'text-ibg-700', darkText: 'dark:text-ibg-300', iconBg: 'bg-ibg-700' },
        amber: { bg: 'bg-amber-450/10', text: 'text-amber-600', darkText: 'dark:text-amber-300', iconBg: 'bg-amber-450' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', darkText: 'dark:text-emerald-300', iconBg: 'bg-emerald-500' },
        terracotta: { bg: 'bg-terracotta-500/10', text: 'text-terracotta-600', darkText: 'dark:text-terracotta-300', iconBg: 'bg-terracotta-500' },
    };
    const c = colorMap[colorKey] || colorMap.ibg700;

    return (
        <div
            className="relative p-6 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden group"
            style={{ animation: `fadeInUp 0.6s ease-out ${delay}s both` }}
        >
            {/* Glow decorativo */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 ${c.bg}`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{title}</div>
                    <div className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{display.toLocaleString()}</div>
                    {subtext && <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{subtext}</div>}
                </div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg ${c.iconBg} text-white`}>
                    <i className={`pi ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   COMPONENTE — Tarjeta de gráfica (glass)
   ================================================================ */
const GlassCard = ({ title, subtitle, children, className = '', delay = 0 }) => (
    <div
        className={`p-6 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm h-full flex flex-col ${className}`}
        style={{ animation: `fadeInUp 0.7s ease-out ${delay}s both` }}
    >
        <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex-1 min-h-[220px] relative">
            {children}
        </div>
    </div>
);

/* ================================================================
   COMPONENTE — Timeline de actividad
   ================================================================ */
const TimelineItem = ({ log, index }) => {
    const colors = ['bg-ibg-700', 'bg-amber-450', 'bg-emerald-500', 'bg-terracotta-500', 'bg-violet-500'];
    const color = colors[index % colors.length];
    return (
        <div className="relative pl-8 pb-6 last:pb-0" style={{ animation: `fadeInLeft 0.5s ease-out ${index * 0.1}s both` }}>
            {/* Línea conectora */}
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
            {/* Punto */}
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${color} flex items-center justify-center shadow-md`}>
                <i className="pi pi-bolt text-white text-[10px]"></i>
            </div>
            {/* Card */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{log.log_name}</p>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                        {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{log.description}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <i className="pi pi-user text-slate-400 dark:text-slate-500"></i>
                    {log.causer ? `${log.causer.persona.nombre} ${log.causer.persona.apellido}` : "Sistema"}
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   COMPONENTE — Barra de competencia (Top Solicitantes)
   ================================================================ */
const CompetitorBar = ({ item, index, max, total, delay = 0 }) => {
    const pct = max > 0 ? Math.round((item.total / max) * 100) : 0;
    const globalPct = total > 0 ? Math.round((item.total / total) * 100) : 0;
    const colors = [C.ibg700, C.amber, C.terracotta, C.emerald, C.violet, C.sky, C.rose, C.teal];
    const barColor = colors[index % colors.length];

    return (
        <div className="space-y-2" style={{ animation: `fadeInRight 0.5s ease-out ${delay}s both` }}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: barColor }}>
                        {index + 1}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">{item.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{item.total}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                        {globalPct}%
                    </span>
                </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: barColor, transitionDelay: `${delay}ms` }}
                ></div>
            </div>
        </div>
    );
};

/* ================================================================
   DASHBOARD PRINCIPAL
   ================================================================ */
const Dashboard = ({ stats, logs, roles, usersPerRole, dependencies, usersPerDependency, filingsByDay, filingsByDependency, filingsByRegional, topApplicants, dateFrom, dateTo, totalFilingsInRange, totalEntrada, totalSalida }) => {
    // Estado filtros
    const [filters, setFilters] = useState({ date_from: dateFrom, date_to: dateTo });
    const [depFilter, setDepFilter] = useState('total');

    const applyFilters = () => {
        router.get(route('main'), { date_from: filters.date_from, date_to: filters.date_to }, { preserveState: true });
    };

    /* ----------------------------------------------------------
       1. SPLINE AREA — Radicados por Día
       ---------------------------------------------------------- */
    const filingsByDayData = {
        labels: filingsByDay.map(d => d.day),
        datasets: [{
            label: 'Radicados',
            data: filingsByDay.map(d => d.total),
            fill: true,
            backgroundColor: (ctx) => {
                const canvas = ctx.chart.ctx;
                const gradient = canvas.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(60,100,139,0.25)');
                gradient.addColorStop(1, 'rgba(60,100,139,0.0)');
                return gradient;
            },
            borderColor: C.ibg700,
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#fff',
            pointBorderColor: C.ibg700,
            pointBorderWidth: 2,
        }]
    };

    const splineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 14,
                cornerRadius: 10,
                titleFont: { size: 13, family: 'Inter' },
                bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(148,163,184,0.1)', borderDash: [4, 4] },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
                border: { display: false },
            }
        }
    };

    /* ----------------------------------------------------------
       2. RADAR — Métricas Generales del Sistema
       ---------------------------------------------------------- */
    const radarData = {
        labels: ['Usuarios', 'Clientes', 'Radicados', 'Activos', 'Finalizados', 'Vencidos'],
        datasets: [{
            label: 'Métricas',
            data: [
                stats.users.active,
                stats.clients.active,
                totalFilingsInRange,
                stats.users.active,
                filingsByDependency.reduce((s, d) => s + (d.finished_count || 0), 0),
                filingsByDependency.reduce((s, d) => s + (d.expired || 0), 0),
            ],
            backgroundColor: 'rgba(212,168,67,0.15)',
            borderColor: C.amber,
            borderWidth: 2,
            pointBackgroundColor: C.amber,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: C.amber,
        }]
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: { legend: { display: false } },
        scales: {
            r: {
                beginAtZero: true,
                grid: { color: 'rgba(148,163,184,0.15)' },
                angleLines: { color: 'rgba(148,163,184,0.1)' },
                pointLabels: { color: '#64748b', font: { size: 11, family: 'Inter' } },
                ticks: { display: false },
            }
        }
    };

    /* ----------------------------------------------------------
       3. BUBBLE — Mapa de Puntos Conceptual (Dependencias)
       ---------------------------------------------------------- */
    const bubbleData = {
        datasets: filingsByDependency.map((dep, i) => ({
            label: dep.dependency_name,
            data: [{
                x: (i % 5) * 20 + 10 + (Math.random() * 10 - 5),
                y: Math.floor(i / 5) * 20 + 10 + (Math.random() * 10 - 5),
                r: Math.max(8, Math.min(40, (dep.total || 0) / 5)),
            }],
            backgroundColor: chartColors.bg[i % chartColors.bg.length],
            borderColor: 'rgba(255,255,255,0.6)',
            borderWidth: 2,
        }))
    };

    const bubbleOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 2000, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.r * 5} radicados`,
                }
            },
        },
        scales: {
            x: { display: false, min: 0, max: 100 },
            y: { display: false, min: 0, max: 100 },
        }
    };

    /* ----------------------------------------------------------
       4. BARRAS HORIZONTALES — Dependencias
       ---------------------------------------------------------- */
    const dependencyLabels = filingsByDependency.map(d => d.dependency_name);
    const dependencyValues = filingsByDependency.map(d => Number(d[depFilter]) || 0);

    const horizontalBarData = {
        labels: dependencyLabels,
        datasets: [{
            label: 'Radicados',
            data: dependencyValues,
            backgroundColor: chartColors.bg,
            borderRadius: 8,
            barThickness: 18,
        }]
    };

    const horizontalBarOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 10,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: 'rgba(148,163,184,0.1)', borderDash: [4, 4] },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
                border: { display: false },
            },
            y: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
                border: { display: false },
            }
        }
    };

    /* ----------------------------------------------------------
       5. DOUGHNUTS — Tipo + Sede
       ---------------------------------------------------------- */
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart', animateScale: true, animateRotate: true },
        cutout: '78%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true, padding: 16, font: { family: 'Inter', size: 11 }, color: '#64748b' },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 14,
                cornerRadius: 10,
                bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
            },
        },
    };

    const reportsData = {
        labels: stats.reports.map(r => r.name),
        datasets: [{
            data: stats.reports.map(r => r.total),
            backgroundColor: chartColors.bg,
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 2,
            hoverOffset: 8,
        }],
    };

    const regionalData = {
        labels: filingsByRegional.map(r => r.regional_name),
        datasets: [{
            data: filingsByRegional.map(r => r.total),
            backgroundColor: [...chartColors.bg].reverse(),
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 2,
            hoverOffset: 8,
        }],
    };

    /* ----------------------------------------------------------
       6. FILTROS DEPENDENCIAS
       ---------------------------------------------------------- */
    const depFilterConfig = [
        { key: 'total', label: 'Todos', color: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300' },
        { key: 'active', label: 'Activos', color: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' },
        { key: 'expired', label: 'Vencidos', color: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' },
        { key: 'finished_count', label: 'Finalizados', color: 'bg-ibg-100 text-ibg-700 ring-1 ring-ibg-300' },
        { key: 'cancelled', label: 'Anulados', color: 'bg-rose-100 text-rose-700 ring-1 ring-rose-300' },
        { key: 'responded', label: 'Con respuesta', color: 'bg-sky-100 text-sky-700 ring-1 ring-sky-300' },
    ];

    const maxApplicant = topApplicants.length > 0 ? topApplicants[0].total : 1;

    return (
        <div className="relative min-h-screen bg-slate-50/40 dark:bg-slate-950/60 transition-colors duration-500">
            {/* Fondo mesh sutil */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full opacity-[0.07] dark:opacity-[0.08] blur-3xl bg-gradient-to-br from-ibg-400 to-ibg-700"></div>
                <div className="absolute top-1/2 -right-1/4 w-[60%] h-[60%] rounded-full opacity-[0.05] dark:opacity-[0.06] blur-3xl bg-gradient-to-tl from-amber-400 to-terracotta-500"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* ===== HEADER FLOTANTE ===== */}
                <div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm"
                    style={{ animation: 'fadeInUp 0.6s ease-out both' }}
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Panel de Control</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestor Documental — Métricas en tiempo real</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Desde</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                                className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ibg-500 transition-all"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Hasta</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                                className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ibg-500 transition-all"
                            />
                        </div>
                        <Button
                            label="Aplicar"
                            icon="pi pi-search"
                            size="small"
                            className="mt-5 bg-ibg-900 hover:bg-ibg-950 text-white border-none rounded-xl shadow-md shadow-ibg-900/20 transition-all"
                            onClick={applyFilters}
                        />
                    </div>
                </div>

                {/* ===== KPIs ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard title="Usuarios Activos" value={stats.users.active} icon="pi-users" colorKey="ibg700" delay={0} subtext={`De ${stats.users.total} registrados`} />
                    <StatCard title="Clientes Activos" value={stats.clients.active} icon="pi-briefcase" colorKey="emerald" delay={0.1} subtext={`De ${stats.clients.total} registrados`} />
                    <StatCard title="Radicados" value={totalFilingsInRange} icon="pi-folder-open" colorKey="amber" delay={0.2} subtext={
                        <span className="flex gap-3 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold"><i className="pi pi-arrow-down-left text-xs mr-1"></i>Entrada: {totalEntrada}</span>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold"><i className="pi pi-arrow-up-right text-xs mr-1"></i>Salida: {totalSalida}</span>
                        </span>
                    } />
                    <StatCard title="Dependencias" value={filingsByDependency.length} icon="pi-building" colorKey="terracotta" delay={0.3} subtext={`Con radicados activos`} />
                </div>

                {/* ===== MAIN CHART (2/3) + RADAR (1/3) ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <GlassCard title="Radicados por Día" subtitle="Evolución diaria con tendencia suavizada" delay={0.2}>
                            {filingsByDay.length > 0 ? (
                                <Chart type="line" data={filingsByDayData} options={splineOptions} className="w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">No hay radicados en el período</div>
                            )}
                        </GlassCard>
                    </div>
                    <div className="lg:col-span-1">
                        <GlassCard title="Métricas del Sistema" subtitle="Distribución general" delay={0.3}>
                            <Chart type="radar" data={radarData} options={radarOptions} className="w-full h-full" />
                        </GlassCard>
                    </div>
                </div>

                {/* ===== BUBBLE MAP ===== */}
                <div style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>
                    <GlassCard title="Mapa de Dependencias" subtitle="Tamaño = volumen de radicados · Color = tipo">
                        {filingsByDependency.length > 0 ? (
                            <Chart type="bubble" data={bubbleData} options={bubbleOptions} className="w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">Sin datos de dependencias</div>
                        )}
                    </GlassCard>
                </div>

                {/* ===== DEPENDENCIAS: Lista (1/3) + Barras horizontales (2/3) ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
                    {/* Lista lateral */}
                    <GlassCard title="Resumen por Dependencia" subtitle="Filtra por estado" delay={0.4}>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {depFilterConfig.map((cfg) => (
                                <button
                                    key={cfg.key}
                                    onClick={() => setDepFilter(cfg.key)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                                        depFilter === cfg.key ? cfg.color : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                            {filingsByDependency.map((dep, index) => {
                                const val = Number(dep[depFilter]) || 0;
                                const pct = dep.total > 0 ? Math.round((val / dep.total) * 100) : 0;
                                const barColors = [C.ibg700, C.amber, C.terracotta, C.emerald, C.violet, C.sky];
                                const bc = barColors[index % barColors.length];
                                return (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: bc }}>
                                            {dep.dependency_name?.charAt(0)?.toUpperCase() || 'D'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">{dep.dependency_name}</span>
                                                <span className="font-bold text-slate-800 dark:text-white text-sm">{val}</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: bc }}></div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full shrink-0">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    {/* Barras horizontales */}
                    <div className="lg:col-span-2">
                        <GlassCard title="Distribución por Dependencia" subtitle="Volumen de radicados asignados" delay={0.5}>
                            {filingsByDependency.length > 0 ? (
                                <Chart type="bar" data={horizontalBarData} options={horizontalBarOptions} className="w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">No hay datos para mostrar</div>
                            )}
                        </GlassCard>
                    </div>
                </div>

                {/* ===== DOUGHNUTS ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}>
                    <GlassCard title="Radicados por Tipo" subtitle="Distribución por procedimiento" delay={0.5}>
                        <Chart type="doughnut" data={reportsData} options={doughnutOptions} className="w-full h-full" />
                    </GlassCard>
                    <GlassCard title="Radicados por Sede" subtitle="Estadísticas por regional" delay={0.6}>
                        <Chart type="doughnut" data={regionalData} options={doughnutOptions} className="w-full h-full" />
                    </GlassCard>
                </div>

                {/* ===== TIMELINE + TOP SOLICITANTES ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
                    {/* Top Solicitantes */}
                    <GlassCard title="Top Solicitantes" subtitle="Ranking por frecuencia" delay={0.6}>
                        <div className="space-y-5">
                            {topApplicants.map((item, index) => (
                                <CompetitorBar key={index} item={item} index={index} max={maxApplicant} total={totalFilingsInRange} delay={index * 100} />
                            ))}
                        </div>
                    </GlassCard>

                    {/* Actividad Reciente — Timeline */}
                    <div className="lg:col-span-2">
                        <GlassCard title="Actividad Reciente" subtitle="Últimos movimientos en el sistema" delay={0.7} className="relative">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Timeline</span>
                                <Button
                                    label="Ver todo"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    size="small"
                                    text
                                    className="text-ibg-700 dark:text-ibg-300"
                                    onClick={() => router.visit(route("logs.index"))}
                                />
                            </div>
                            <div>
                                {logs.slice(0, 6).map((log, idx) => (
                                    <TimelineItem key={log.id} log={log} index={idx} />
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>

            </div>

            {/* ===== ANIMACIONES CSS ===== */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-15px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(15px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

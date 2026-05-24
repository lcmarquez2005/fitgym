// src/pages/erp/marketing/DashboardMarketing.tsx
import { useEffect, useState } from 'react';
import {
    getMarketingDashboard,
    ejecutarPreVencimiento,
    ejecutarRecuperacion,
    ejecutarCumpleanios,
} from '../../../services/marketing.service';

interface DashboardData {
    totalSocios: number;
    sociosActivos: number;
    sociosInactivos: number;
    tasaRetencion: number;
    vencenEn7Dias: number;
    enRiesgo: number;
    totalLeads: number;
    leadsCerrados: number;
    tasaConversion: number;
    leadsPorEtapa: Record<string, number>;
    leadsPorFuente: Record<string, number>;
    campanasActivas: number;
    campanasTotales: number;
    promocionesActivas: number;
    cumpleaniosHoy: number;
    distribucionMembresia: Record<string, number>;
}

export default function DashboardMarketing() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        getMarketingDashboard()
            .then(res => { if (res.success) setData(res.data); })
            .finally(() => setLoading(false));
    }, []);

    const ejecutar = async (fn: () => Promise<any>, label: string) => {
        setMsg('Ejecutando...');
        const res = await fn();
        setMsg(res.message || label);
        setTimeout(() => setMsg(''), 4000);
    };

    if (loading) return <p className="text-gray-500">Cargando dashboard...</p>;
    if (!data) return <p className="text-red-500">Error al cargar datos.</p>;

    const ETAPAS = ['CAPTACION', 'CONTACTO', 'VISITA', 'SEGUIMIENTO', 'CERRADO', 'PERDIDO'];

    return (
        <div className="space-y-6">

            {msg && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-700 text-sm">
                    {msg}
                </div>
            )}

            {/* KPIs principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Socios activos" value={data.sociosActivos} color="green" />
                <KpiCard label="Tasa de retención" value={`${data.tasaRetencion}%`} color="blue" />
                <KpiCard label="Vencen en 7 días" value={data.vencenEn7Dias} color="yellow" />
                <KpiCard label="En riesgo" value={data.enRiesgo} color="red" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Total leads" value={data.totalLeads} color="blue" />
                <KpiCard label="Leads convertidos" value={data.leadsCerrados} color="green" />
                <KpiCard label="Tasa de conversión" value={`${data.tasaConversion}%`} color="blue" />
                <KpiCard label="Cumpleaños hoy" value={data.cumpleaniosHoy} color="pink" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pipeline de leads */}
                <div className="border rounded p-4 bg-white">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Pipeline de leads</p>
                    <div className="space-y-2">
                        {ETAPAS.map(etapa => (
                            <div key={etapa} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{etapa}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeEtapa(etapa)}`}>
                                    {data.leadsPorEtapa[etapa] ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribución membresías */}
                <div className="border rounded p-4 bg-white">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Por membresía</p>
                    <div className="space-y-2">
                        {Object.entries(data.distribucionMembresia).map(([tipo, count]) => (
                            <div key={tipo} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{tipo}</span>
                                <span className="text-sm font-semibold text-gray-800">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fuentes de leads */}
                <div className="border rounded p-4 bg-white">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Fuente de leads</p>
                    <div className="space-y-2">
                        {Object.entries(data.leadsPorFuente).map(([fuente, count]) => (
                            <div key={fuente} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{fuente}</span>
                                <span className="text-sm font-semibold text-gray-800">{count}</span>
                            </div>
                        ))}
                        {Object.keys(data.leadsPorFuente).length === 0 && (
                            <p className="text-xs text-gray-400">Sin leads registrados</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Campañas automatizadas */}
            <div className="border rounded p-4 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
                    Campañas automatizadas
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <AutoCard
                        titulo="Pre-vencimiento"
                        descripcion="Envía emails a socios cuya membresía vence en 15, 7 y 3 días"
                        onEjecutar={() => ejecutar(ejecutarPreVencimiento, 'Campaña pre-vencimiento ejecutada')}
                    />
                    <AutoCard
                        titulo="Recuperación"
                        descripcion="Contacta ex-socios inactivos a los 30, 60 y 90 días de baja"
                        onEjecutar={() => ejecutar(ejecutarRecuperacion, 'Campaña recuperación ejecutada')}
                    />
                    <AutoCard
                        titulo="Cumpleaños"
                        descripcion="Felicita a los socios que cumplen años hoy con oferta especial"
                        onEjecutar={() => ejecutar(ejecutarCumpleanios, 'Campaña cumpleaños ejecutada')}
                    />
                </div>
            </div>

            {/* Stats campañas y promos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoCard label="Campañas totales" value={String(data.campanasTotales)} />
                <InfoCard label="Campañas activas" value={String(data.campanasActivas)} />
                <InfoCard label="Promociones activas" value={String(data.promocionesActivas)} />
            </div>

        </div>
    );
}

// ── Sub-componentes ───────────────────────────────────────────────

function KpiCard({ label, value, color }: { label: string; value: string | number; color: string }) {
    const colors: Record<string, string> = {
        green: 'border-green-400 bg-green-50',
        blue: 'border-blue-400 bg-blue-50',
        red: 'border-red-400 bg-red-50',
        yellow: 'border-yellow-400 bg-yellow-50',
        pink: 'border-pink-400 bg-pink-50',
    };
    return (
        <div className={`border-l-4 rounded p-4 ${colors[color] ?? colors.blue}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="border rounded p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
    );
}

function AutoCard({ titulo, descripcion, onEjecutar }: {
    titulo: string;
    descripcion: string;
    onEjecutar: () => void;
}) {
    return (
        <div className="border rounded p-4 bg-gray-50 flex flex-col gap-3">
            <p className="font-semibold text-gray-700 text-sm">{titulo}</p>
            <p className="text-xs text-gray-500 flex-1">{descripcion}</p>
            <button
                onClick={onEjecutar}
                className="w-full py-2 bg-[#606de5] hover:bg-[#4f5bd1] text-white text-sm rounded-lg transition-all"
            >
                Ejecutar ahora
            </button>
        </div>
    );
}

function badgeEtapa(etapa: string): string {
    const map: Record<string, string> = {
        CAPTACION: 'bg-blue-100 text-blue-700',
        CONTACTO: 'bg-purple-100 text-purple-700',
        VISITA: 'bg-yellow-100 text-yellow-700',
        SEGUIMIENTO: 'bg-orange-100 text-orange-700',
        CERRADO: 'bg-green-100 text-green-700',
        PERDIDO: 'bg-red-100 text-red-700',
    };
    return map[etapa] ?? 'bg-gray-100 text-gray-700';
}
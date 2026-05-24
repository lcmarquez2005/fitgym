import { useState } from 'react';
import DashboardReservas from './DashboardReservas';
import HorarioSemanal from './HorarioSemanal';
import CatalogosReservas from './CatalogosReservas';

type Tab = 'dashboard' | 'horario' | 'catalogos';

const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { key: 'horario', label: 'Horario y Reservas', emoji: '🗓️' },
    { key: 'catalogos', label: 'Gestión de Salones y Clases', emoji: '⚙️' }
];

export default function ReservasPage() {
    const [tab, setTab] = useState<Tab>('horario');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header del módulo */}
            <div className="bg-white border-b px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">🗓️ Módulo de Clases y Reservas</h1>
                <p className="text-sm text-gray-500">Administra el calendario de actividades, instructores y reservas de socios.</p>
            </div>

            {/* Navegación por tabs */}
            <div className="bg-white border-b px-6">
                <div className="flex gap-1 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                tab === t.key
                                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {t.emoji} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido del tab activo */}
            <div className="max-w-7xl mx-auto py-6">
                {tab === 'dashboard' && <DashboardReservas />}
                {tab === 'horario' && <HorarioSemanal />}
                {tab === 'catalogos' && <CatalogosReservas />}
            </div>
        </div>
    );
}

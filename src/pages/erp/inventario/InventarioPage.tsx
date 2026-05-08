import { useState } from 'react';
import DashboardInventario from './DashboardInventario';
import EquiposPage from './EquiposPage';
import SuplementosPage from './SuplementosPage';
import MantenimientoPage from './MantenimientoPage';
import ProveedoresPage from './ProveedoresPage';

type Tab = 'dashboard' | 'equipos' | 'suplementos' | 'mantenimiento' | 'proveedores';

const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { key: 'suplementos', label: 'Suplementos (Punto de Venta)', emoji: '💊' },
    { key: 'equipos', label: 'Equipos', emoji: '🏋️' },
    { key: 'mantenimiento', label: 'Mantenimientos', emoji: '🔧' },
    { key: 'proveedores', label: 'Proveedores', emoji: '🏢' },
];

export default function InventarioPage() {
    const [tab, setTab] = useState<Tab>('dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header del módulo */}
            <div className="bg-white border-b px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">📦 Módulo Inventario</h1>
                <p className="text-sm text-gray-500">Gestión de activos, productos y stock</p>
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
                {tab === 'dashboard' && <DashboardInventario />}
                {tab === 'suplementos' && <SuplementosPage />}
                {tab === 'equipos' && <EquiposPage />}
                {tab === 'mantenimiento' && <MantenimientoPage />}
                {tab === 'proveedores' && <ProveedoresPage />}
            </div>
        </div>
    );
}

// src/pages/erp/finanzas/FinanzasPage.tsx
// Layout contenedor del Módulo de Finanzas con navegación por tabs
import { useState } from 'react';
import DashboardFinanzas from './DashboardFinanzas';
import CajaPage from './CajaPage';
import EstadoResultadosPage from './EstadoResultadosPage';
import ImpuestosPage from './ImpuestosPage';
import NominaPage from './NominaPage';

type Tab = 'dashboard' | 'caja' | 'resultados' | 'impuestos' | 'nomina';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { key: 'caja', label: 'Caja', emoji: '💰' },
  { key: 'resultados', label: 'Estado de Resultados', emoji: '📈' },
  { key: 'impuestos', label: 'Impuestos', emoji: '🏛️' },
  { key: 'nomina', label: 'Nómina', emoji: '👷' },
];

export default function FinanzasPage() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del módulo */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">💼 Módulo Finanzas</h1>
        <p className="text-sm text-gray-500">Gestión financiera integral del gimnasio</p>
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
      <div className="max-w-7xl mx-auto">
        {tab === 'dashboard' && <DashboardFinanzas />}
        {tab === 'caja' && <CajaPage />}
        {tab === 'resultados' && <EstadoResultadosPage />}
        {tab === 'impuestos' && <ImpuestosPage />}
        {tab === 'nomina' && <NominaPage />}
      </div>
    </div>
  );
}

// src/pages/erp/finanzas/reportes/ReportesLayout.tsx
import { useState } from 'react';
import { BarChart3, FileText, PieChart, Activity, TrendingUp, DollarSign, Users, CreditCard } from 'lucide-react';

// Importaremos los componentes aquí conforme los vayamos creando
// import ViewEstadoResultados from './ViewEstadoResultados';
// import ViewBalanceGeneral from './ViewBalanceGeneral';
// import ViewFlujoEfectivo from './ViewFlujoEfectivo';
// import ViewOperacionesDiarias from './ViewOperacionesDiarias';
// import ViewCuentasCobrar from './ViewCuentasCobrar';
// import ViewMembresias from './ViewMembresias';
import ViewOperacionesDiarias from './ViewOperacionesDiarias';
import ViewEstadoResultados from './ViewEstadoResultados';
import ViewBalanceGeneral from './ViewBalanceGeneral';
import ViewFlujoEfectivo from './ViewFlujoEfectivo';
import ViewCuentasCobrar from './ViewCuentasCobrar';
import ViewMembresias from './ViewMembresias';
import ViewVentasCategoria from './ViewVentasCategoria';
import ViewKpisPredictivos from './ViewKpisPredictivos';

type TabId = 
  | 'estado_resultados' | 'balance_general' | 'flujo_efectivo'
  | 'operaciones_diarias' | 'cuentas_cobrar' | 'membresias' | 'ventas_categoria'
  | 'kpis';

interface TabConfig {
  id: TabId;
  label: string;
  icon: any;
  category: string;
}

const TABS: TabConfig[] = [
  // Core Financiero
  { id: 'estado_resultados', label: 'Estado de Resultados', icon: FileText, category: 'Core Financiero' },
  { id: 'balance_general', label: 'Balance General', icon: BarChart3, category: 'Core Financiero' },
  { id: 'flujo_efectivo', label: 'Flujo de Efectivo', icon: TrendingUp, category: 'Core Financiero' },
  
  // Operaciones
  { id: 'operaciones_diarias', label: 'Operaciones Diarias', icon: Activity, category: 'Operaciones' },
  { id: 'cuentas_cobrar', label: 'Cuentas por Cobrar', icon: CreditCard, category: 'Operaciones' },
  { id: 'membresias', label: 'Análisis Membresías', icon: Users, category: 'Operaciones' },
  { id: 'ventas_categoria', label: 'Ventas Categoría', icon: PieChart, category: 'Operaciones' },
  
  // Inteligencia
  { id: 'kpis', label: 'KPIs Predictivos', icon: DollarSign, category: 'Inteligencia' },
];

export default function ReportesLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('operaciones_diarias'); // Start with a working tab

  const renderContent = () => {
    switch (activeTab) {
      case 'estado_resultados': return <ViewEstadoResultados />;
      case 'balance_general': return <ViewBalanceGeneral />;
      case 'flujo_efectivo': return <ViewFlujoEfectivo />;
      case 'operaciones_diarias': return <ViewOperacionesDiarias />;
      case 'cuentas_cobrar': return <ViewCuentasCobrar />;
      case 'membresias': return <ViewMembresias />;
      case 'ventas_categoria': return <ViewVentasCategoria />;
      case 'kpis': return <ViewKpisPredictivos />;
      default: return null;
    }
  };

  // Agrupar tabs por categoría
  const groupedTabs = TABS.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, TabConfig[]>);

  return (
    <div className="flex h-[800px] border rounded-xl overflow-hidden mt-6 bg-white shadow-sm">
      {/* Sidebar interno de reportes */}
      <div className="w-64 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Reportes & BI
          </h2>
          <p className="text-xs text-gray-500 mt-1">Inteligencia de Negocios</p>
        </div>
        
        <div className="p-3 space-y-6">
          {Object.entries(groupedTabs).map(([category, tabs]) => (
            <div key={category}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de contenido del reporte */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

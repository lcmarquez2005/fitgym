import { useState } from 'react';
import DashboardInventario from './DashboardInventario';
import EquiposPage from './EquiposPage';
import SuplementosPage from './SuplementosPage';
import MantenimientoPage from './MantenimientoPage';
import ProveedoresPage from './ProveedoresPage';
import Header from '@layout/Header';
import Footer from '@layout/Footer';
import {
  Package,
  LayoutDashboard,
  ShoppingBag,
  Dumbbell,
  Wrench,
  Truck
} from 'lucide-react';

type Tab = 'dashboard' | 'equipos' | 'suplementos' | 'mantenimiento' | 'proveedores';

interface TabItem {
  key: Tab;
  label: string;
  icon: React.ReactNode;
}

export default function InventarioPage() {
    const [tab, setTab] = useState<Tab>('dashboard');

    const TABS: TabItem[] = [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { key: 'suplementos', label: 'Suplementos (Punto de Venta)', icon: <ShoppingBag size={18} /> },
        { key: 'equipos', label: 'Equipos', icon: <Dumbbell size={18} /> },
        { key: 'mantenimiento', label: 'Mantenimientos', icon: <Wrench size={18} /> },
        { key: 'proveedores', label: 'Proveedores', icon: <Truck size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#F6F8FE] font-inter">
            {/* Brand Header & floating Sidebar */}
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Module Title Card */}
                <div 
                    className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                    style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)" }}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#606DE5]/10 rounded-2xl text-[#606DE5]">
                                <Package size={28} />
                            </div>
                            <h1 className="text-3xl font-bakbak text-black uppercase tracking-wide">Módulo Inventario</h1>
                        </div>
                        <p className="text-gray-500 font-medium italic pl-16">Gestión de activos, productos y stock</p>
                    </div>
                    
                    {/* Glassmorphic Tabs Navigation */}
                    <div className="bg-[#F6F8FE] p-2 rounded-[24px] border border-gray-100/50 flex flex-wrap gap-1">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-[18px] text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                    tab === t.key
                                        ? 'bg-[#606DE5] text-white shadow-lg shadow-indigo-200'
                                        : 'text-gray-500 hover:text-black hover:bg-white/80'
                                }`}
                            >
                                {t.icon}
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content Section with deep shadow */}
                <div 
                    className="bg-white rounded-[40px] p-6 md:p-8 border border-gray-100 min-h-[500px]"
                    style={{ boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.05)" }}
                >
                    {tab === 'dashboard' && <DashboardInventario />}
                    {tab === 'suplementos' && <SuplementosPage />}
                    {tab === 'equipos' && <EquiposPage />}
                    {tab === 'mantenimiento' && <MantenimientoPage />}
                    {tab === 'proveedores' && <ProveedoresPage />}
                </div>
            </main>

            <Footer />
        </div>
    );
}

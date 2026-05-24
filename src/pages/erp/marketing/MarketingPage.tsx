// src/pages/erp/marketing/MarketingPage.tsx
import { useState } from 'react';
import Sidebar from '@layout/Sidebar';
import DashboardMarketing from './DashboardMarketing.tsx';
import LeadsPage from './LeadsPage.tsx';
import CampanasPage from './CampanasPage.tsx';
import PromocionesPage from './PromocionesPage.tsx';
import SegmentacionPage from './SegmentacionPage.tsx';

type Tab = 'dashboard' | 'leads' | 'campanas' | 'promociones' | 'segmentacion';

const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'leads', label: 'Leads' },
    { key: 'campanas', label: 'Campañas' },
    { key: 'promociones', label: 'Promociones' },
    { key: 'segmentacion', label: 'Segmentación' },
];

export default function MarketingPage() {
    const [tab, setTab] = useState<Tab>('dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="p-6 pt-20">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Marketing</h1>

                {/* Sub-navegación */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 flex-wrap">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px
                ${tab === t.key
                                    ? 'border-[#606de5] text-[#606de5]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Contenido */}
                {tab === 'dashboard' && <DashboardMarketing />}
                {tab === 'leads' && <LeadsPage />}
                {tab === 'campanas' && <CampanasPage />}
                {tab === 'promociones' && <PromocionesPage />}
                {tab === 'segmentacion' && <SegmentacionPage />}
            </div>
        </div>
    );
}
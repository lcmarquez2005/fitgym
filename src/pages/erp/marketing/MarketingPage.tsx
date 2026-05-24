import { useState } from 'react';
import DashboardMarketing from './DashboardMarketing.tsx';
import LeadsPage from './LeadsPage.tsx';
import CampanasPage from './CampanasPage.tsx';
import PromocionesPage from './PromocionesPage.tsx';
import SegmentacionPage from './SegmentacionPage.tsx';
import Header from '@layout/Header';
import Footer from '@layout/Footer';

type Tab = 'dashboard' | 'leads' | 'campanas' | 'promociones' | 'segmentacion';

const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { key: 'leads', label: 'Leads', emoji: '🎯' },
    { key: 'campanas', label: 'Campañas', emoji: '📢' },
    { key: 'promociones', label: 'Promociones', emoji: '🏷️' },
    { key: 'segmentacion', label: 'Segmentación', emoji: '👥' },
];

export default function MarketingPage() {
    const [tab, setTab] = useState<Tab>('dashboard');

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
                            <span className="text-3xl">📢</span>
                            <h1 className="text-3xl font-bakbak text-black uppercase tracking-wide">Módulo Marketing</h1>
                        </div>
                        <p className="text-gray-500 font-medium italic pl-10">Campañas, promociones, segmentación de socios y seguimiento de prospectos.</p>
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
                                <span className="text-base">{t.emoji}</span>
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
                    {tab === 'dashboard' && <DashboardMarketing />}
                    {tab === 'leads' && <LeadsPage />}
                    {tab === 'campanas' && <CampanasPage />}
                    {tab === 'promociones' && <PromocionesPage />}
                    {tab === 'segmentacion' && <SegmentacionPage />}
                </div>
            </main>

            <Footer />
        </div>
    );
}
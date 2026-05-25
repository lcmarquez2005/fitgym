import React from 'react';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

interface ChartSectionProps {
  inscritos: number;
  sinPagar: number;
  onInscritosChange?: (value: number) => void;
  onSinPagarChange?: (value: number) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  inscritos,
  sinPagar,
}) => {
  const total = inscritos + sinPagar;
  const percentageUnpaid = total > 0 ? (sinPagar / total) * 100 : 0;
  const strokeDasharray = `${percentageUnpaid} ${100 - percentageUnpaid}`;

  return (
    <div className="flex flex-col items-center bg-white p-8 gap-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden group">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500" />
      
      <div className="w-full flex items-center justify-between relative z-10">
        <div className="flex flex-col">
            <h3 className="text-lg font-bakbak text-black uppercase tracking-tight">Estado de Membresías</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resumen General</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <TrendingUp size={20} />
        </div>
      </div>

      {/* Gráfica Donut Moderna */}
      <div className="relative w-[200px] h-[200px] flex items-center justify-center drop-shadow-2xl">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Círculo Principal (Inscritos) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#606DE5"
            strokeWidth="3.5"
            strokeDasharray="100 0"
            strokeLinecap="round"
          />
          {/* Círculo Secundario (Sin Pagar) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="3.5"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-syne font-black text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Total Socios</span>
        </div>
      </div>

      {/* Leyenda y KPI Cards */}
      <div className="grid grid-cols-2 gap-4 w-full relative z-10">
        <div className="bg-indigo-50/50 p-4 rounded-[24px] border border-indigo-100 flex flex-col gap-1 transition-all hover:bg-indigo-50">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#606DE5]" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Inscritos</span>
            </div>
            <span className="text-2xl font-syne font-black text-indigo-700">{inscritos}</span>
            <div className="flex items-center gap-1 mt-1">
                <Users size={12} className="text-indigo-300" />
                <span className="text-[9px] font-bold text-indigo-400/80 italic">Activos ahora</span>
            </div>
        </div>

        <div className="bg-red-50/50 p-4 rounded-[24px] border border-red-100 flex flex-col gap-1 transition-all hover:bg-red-50">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">Sin Pagar</span>
            </div>
            <span className="text-2xl font-syne font-black text-red-700">{sinPagar}</span>
            <div className="flex items-center gap-1 mt-1">
                <AlertCircle size={12} className="text-red-300" />
                <span className="text-[9px] font-bold text-red-400/80 italic">Pago pendiente</span>
            </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between opacity-60">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Actualizado en tiempo real</span>
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

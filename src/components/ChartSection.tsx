import React from 'react';
import { Users } from 'lucide-react';

interface ChartSectionProps {
  inscritos: number;
  sinPagar: number;
  onInscritosChange: (value: number) => void;
  onSinPagarChange: (value: number) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  inscritos,
  sinPagar,
  onInscritosChange,
  onSinPagarChange,
}) => {
  const total = inscritos + sinPagar;
  const percentageUnpaid = total > 0 ? (sinPagar / total) * 100 : 0;
  const strokeDasharray = `${percentageUnpaid} ${100 - percentageUnpaid}`;

  return (
    <div className="flex flex-col items-center bg-white p-10 gap-6 rounded-[26px] shadow-sm border border-gray-200">
      <div className="relative w-[220px] h-[220px]">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#D4B62C"
            strokeWidth="3.8"
          />
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#8B1A1A"
            strokeWidth="3.8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Users className="text-gray-200" size={40} />
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-50" />

      <div className="flex flex-col gap-3 text-center font-bakbak">
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#D4B62C]" />
          <span className="text-black text-2xl leading-tight">Personas Inscritas = {inscritos}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#8B1A1A]" />
          <span className="text-black text-2xl leading-tight">Personas sin pagar = {sinPagar}</span>
        </div>
      </div>

      <div className="mt-2 flex hidden gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 font-inter">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Inscritos</span>
          <input 
            type="number" 
            value={inscritos} 
            onChange={(e) => onInscritosChange(Number(e.target.value))}
            className="w-16 p-1 bg-white border rounded text-center text-gray-700 outline-none font-bold"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Deudores</span>
          <input 
            type="number" 
            value={sinPagar} 
            onChange={(e) => onSinPagarChange(Number(e.target.value))}
            className="w-16 p-1 bg-white border rounded text-center text-red-600 outline-none font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

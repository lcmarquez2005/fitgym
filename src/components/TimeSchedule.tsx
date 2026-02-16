import React from 'react';
import { Clock, CreditCard } from 'lucide-react';

const TimeSchedule: React.FC = () => {
  return (
    <div className="flex flex-col items-start bg-white p-8 gap-8 rounded-[26px] shadow-sm border border-gray-200 font-bakbak">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Clock className="text-blue-600" size={32} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-black text-4xl">6:33 PM</span>
          <span className="text-gray-400 text-lg font-inter font-bold tracking-tight">
            Martes 17 Febrero de 2026
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-orange-50 p-3 rounded-2xl">
          <CreditCard className="text-orange-600" size={32} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-black text-xl">Horario de Hoy:</span>
          <span className="text-orange-600 text-xl font-bakbak">05:00 AM - 11:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSchedule;

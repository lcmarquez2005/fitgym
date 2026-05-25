import React from 'react';
import ChartSection from '@layout/ChartSection';
import TimeSchedule from '@common/TimeSchedule';
import { ExternalLink } from 'lucide-react';
import { GenerarDatosPrueba } from '@/components';

interface RightPanelProps {
  inscritos: number;
  sinPagar: number;
  onInscritosChange: (value: number) => void;
  onSinPagarChange: (value: number) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  inscritos,
  sinPagar,
  onInscritosChange,
  onSinPagarChange,
}) => {
  return (
    <div className="flex flex-col shrink-0 w-full lg:w-[440px] gap-8">
      <ChartSection
        inscritos={inscritos}
        sinPagar={sinPagar}
        onInscritosChange={onInscritosChange}
        onSinPagarChange={onSinPagarChange}
      />
      <TimeSchedule />

      {/* Botón Modo Kiosco (Control de Acceso) */}
      <button 
        onClick={() => window.open('/control-acceso', '_blank')}
        className="w-full py-4 bg-indigo-600 text-white rounded-[26px] font-bakbak text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
      >
        <ExternalLink size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        ABRIR MODO KIOSCO
      </button>

      <GenerarDatosPrueba />
    </div>
  );
};

export default RightPanel;

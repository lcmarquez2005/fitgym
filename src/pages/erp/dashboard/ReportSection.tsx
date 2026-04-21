import React from 'react';
import { Info } from 'lucide-react';

interface ReportSectionProps {
  inscritos: number;
  sinPagar: number;
}

const ReportSection: React.FC<ReportSectionProps> = ({ inscritos, sinPagar }) => {
  return (
    <div className="flex flex-col self-stretch gap-6 mt-4">
      <div className="flex flex-col items-start self-stretch gap-4">
        <span className="text-black text-2xl flex items-center gap-2 font-bakbak">
          <Info size={24} className="text-blue-500" /> Reporte
        </span>
        <div className="w-full h-[1px] bg-gray-100" />
      </div>
      <span className="text-gray-500 text-lg leading-relaxed whitespace-pre-wrap font-inter font-medium">
        En Este Momento se encuentran {inscritos} personas inscritas en un plan del gimnasio.{"\n"}
        El rendimiento de las inscripciones ha subido un 12% respecto al mes pasado.{"\n"}
        Recuerde revisar los {sinPagar} pagos pendientes en la sección de facturación.
      </span>
    </div>
  );
};

export default ReportSection;

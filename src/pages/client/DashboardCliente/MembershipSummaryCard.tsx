import React from "react";
import type { ClienteResumen } from "@services/dashboard.service";

interface MembershipSummaryCardProps {
  images: {
    purpleCircle: string;
    orangeTicket: string;
  };
  data: ClienteResumen | null;
  onViewHistory?: () => void;
}

const MembershipSummaryCard: React.FC<MembershipSummaryCardProps> = ({ images, data, onViewHistory }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "S/D";
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row w-full xl:w-7/12 items-center gap-8 overflow-visible">
      {/* SECCIÓN GRÁFICA (Izquierda dentro de la tarjeta) */}
      <div className="relative w-[280px] h-[300px] shrink-0">
        {/* Círculo Morado (FONDO) */}
        <img 
          src={images.purpleCircle} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] object-contain z-0" 
          alt="Circle Bg" 
        />
        
        {/* Ticket Naranja (FRENTE) - Desplazado ligeramente para efecto 3D */}
        <img 
          src={images.orangeTicket} 
          className="absolute top-0 left-4 w-full h-full object-contain z-10 drop-shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500" 
          alt="Ticket" 
        />
      </div>

      {/* SECCIÓN DATOS (Derecha dentro de la tarjeta) */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-black text-2xl font-bakbak uppercase mb-4 tracking-tight">Resumen de membresía</h3>
        
        <div className="space-y-4 text-sm font-inter">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Tipo actual</span>
            <span className="text-slate-700 font-extrabold">{data?.tipoMembresia || "Cargando..."}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Fecha inicio</span>
            <span className="text-slate-700 font-extrabold">{formatDate(data?.fechaInicio)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Vencimiento</span>
            <span className="text-[#3ACAFF] font-extrabold underline decoration-2 underline-offset-4">{formatDate(data?.fechaFin)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Costo Mensual</span>
            <span className="text-slate-700 font-extrabold">${data?.costoMensual} MXN</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-2xl">
            <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-widest">Próximo Mes Pagado</span>
            <span className="text-indigo-600 font-black uppercase text-base">{data?.mesPagado}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <button 
            onClick={onViewHistory}
            className="bg-[#3ACAFF] hover:bg-[#32b2e0] text-white text-[10px] font-black uppercase tracking-[2px] py-4 px-10 rounded-2xl shadow-xl shadow-cyan-100 transition-all active:scale-95 cursor-pointer"
          >
            Ver historial de pagos
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSummaryCard;

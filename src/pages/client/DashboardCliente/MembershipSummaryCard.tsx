import React, { useState } from "react";
import type { ClienteResumen } from "@services/dashboard.service";
import { ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";

interface MembershipSummaryCardProps {
  images: {
    purpleCircle: string;
    orangeTicket: string;
  };
  data: ClienteResumen | null;
  onViewHistory?: () => void;
}

const MembershipSummaryCard: React.FC<MembershipSummaryCardProps> = ({ images, data, onViewHistory }) => {
  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "S/D";
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col lg:flex-row w-full xl:w-7/12 items-center gap-8 backdrop-blur-md relative z-20 ${
      isDarkMode 
        ? "bg-[#111827]/70 border-gray-800 shadow-2xl" 
        : "bg-white border-gray-100 shadow-xl"
    }`}>
      
      {/* SECCIÓN GRÁFICA (Izquierda dentro de la tarjeta - Posicionamiento absoluto original recuperado) */}
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
      <div className="flex flex-col gap-2 w-full min-w-0 relative z-20">
        <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#606DE5]" /> Resumen del Plan
        </h3>
        
        <div className="space-y-3.5 text-xs font-inter">
          <div className="flex justify-between items-center border-b border-gray-855/5 dark:border-gray-155/5 pb-2">
            <span className={`font-bold uppercase text-[10px] tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Tipo de membresía
            </span>
            <span className="font-extrabold truncate ml-4">{data?.tipoMembresia || "Cargando..."}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-855/5 dark:border-gray-155/5 pb-2">
            <span className={`font-bold uppercase text-[10px] tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Fecha de Inicio
            </span>
            <span className="font-extrabold ml-4">{formatDate(data?.fechaInicio)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-855/5 dark:border-gray-155/5 pb-2">
            <span className={`font-bold uppercase text-[10px] tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Fecha de Vencimiento
            </span>
            <span className="text-cyan-500 font-extrabold underline decoration-2 underline-offset-4 ml-4">
              {formatDate(data?.fechaFin)}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-855/5 dark:border-gray-155/5 pb-2">
            <span className={`font-bold uppercase text-[10px] tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Inversión Mensual
            </span>
            <span className="font-extrabold ml-4">${data?.costoMensual} MXN</span>
          </div>

          <div className={`flex justify-between items-center p-3.5 rounded-2xl border ${
            isDarkMode ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-300" : "bg-indigo-50/50 border-indigo-50 text-indigo-600"
          }`}>
            <span className="font-bold uppercase text-[10px] tracking-wider">Próxima Renovación</span>
            <span className="font-black uppercase text-sm flex items-center gap-1.5 ml-4 shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> {data?.mesPagado || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <button 
            onClick={onViewHistory}
            className="w-full md:w-auto bg-[#3ACAFF] hover:bg-[#2cb2e0] text-white text-[10px] font-black uppercase tracking-[2px] py-4 px-8 rounded-2xl shadow-md hover:shadow-lg shadow-cyan-500/10 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            Ver historial de pagos <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSummaryCard;

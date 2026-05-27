import React from "react";
import type { ClienteResumen } from "@services/dashboard.service";
import { ChevronRight, Sparkles, CheckCircle2, Bookmark, Calendar, DollarSign } from "lucide-react";

interface MembershipSummaryCardProps {
  images: {
    purpleCircle: string;
    orangeTicket: string;
  };
  data: ClienteResumen | null;
  onViewHistory?: () => void;
  isDarkMode: boolean;
}

const MembershipSummaryCard: React.FC<MembershipSummaryCardProps> = ({ data, onViewHistory, isDarkMode }) => {
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
    <div className={`rounded-3xl p-8 border transition-all duration-500 flex flex-col lg:flex-row w-full xl:w-7/12 items-center gap-8 backdrop-blur-md relative z-20 hover:translate-y-[-4px] ${
      isDarkMode 
        ? "bg-slate-900/60 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
        : "bg-white/95 border-slate-100 shadow-[0_20px_50px_rgba(96,109,229,0.05)]"
    }`}>
      
      {/* SECCIÓN GRÁFICA: Pase de Membresía 3D en CSS */}
      <div className="relative w-[260px] h-[220px] shrink-0 flex items-center justify-center select-none">
        {/* Esfera de luz de fondo (reemplaza purpleCircle) */}
        <div className={`absolute w-36 h-36 rounded-full opacity-35 blur-2xl animate-pulse z-0 ${
          isDarkMode ? "bg-indigo-650" : "bg-indigo-400"
        }`} />
        
        {/* Tarjeta Mockup 3D (reemplaza orangeTicket) */}
        <div className={`relative w-[220px] h-[135px] rounded-2xl p-4 z-10 shadow-2xl border transition-all duration-500 transform rotate-[-6deg] hover:rotate-0 hover:scale-105 hover:shadow-[0_25px_50px_rgba(96,109,229,0.3)] flex flex-col justify-between cursor-pointer overflow-hidden ${
          isDarkMode 
            ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-white/10 text-white" 
            : "bg-gradient-to-br from-[#606DE5] via-indigo-600 to-[#3ACAFF] border-white/20 text-white shadow-indigo-500/30"
        }`}>
          {/* Brillo glassmorphic */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
          
          {/* Logo y Nombre */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-white">FITGYM</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-extrabold uppercase scale-90">PASS</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
          </div>

          {/* Información del Plan en el centro */}
          <div className="my-2">
            <span className="block text-[7px] uppercase tracking-wider text-white/60">Membresía</span>
            <span className="text-[11px] font-black uppercase truncate block max-w-[170px] text-white">
              {data?.tipoMembresia || "Plan Activo"}
            </span>
          </div>

          {/* Footer de Tarjeta con Barcode */}
          <div className="flex justify-between items-end border-t border-white/10 pt-2">
            <div>
              <span className="block text-[7px] uppercase tracking-wider text-white/50">Socio ID</span>
              <span className="text-[9px] font-mono font-black text-white">{data?.idSocio || "P-PENDIENTE"}</span>
            </div>
            {/* Pequeño código de barras decorativo */}
            <div className="flex gap-[1.5px] h-4 items-stretch opacity-60">
              {[1,2,1,3,1,2,1,2,3,1].map((w, idx) => (
                <div key={idx} className="bg-white" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DATOS (Derecha dentro de la tarjeta) */}
      <div className="flex flex-col gap-2 w-full min-w-0 relative z-20">
        <h3 className={`text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2 ${
          isDarkMode ? "text-white" : "text-slate-800"
        }`}>
          <Sparkles className="w-4.5 h-4.5 text-[#606DE5] animate-pulse" /> Resumen del Plan
        </h3>
        
        <div className="space-y-4 text-xs font-inter">
          {/* Membresía */}
          <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <Bookmark size={14} className="text-indigo-400" />
              <span className={`font-bold uppercase text-[9px] tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Tipo de membresía
              </span>
            </div>
            <span className={`font-extrabold truncate ml-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {data?.tipoMembresia || "Cargando..."}
            </span>
          </div>
          
          {/* Inicio */}
          <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#3ACAFF]" />
              <span className={`font-bold uppercase text-[9px] tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Fecha de Inicio
              </span>
            </div>
            <span className={`font-extrabold ml-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {formatDate(data?.fechaInicio)}
            </span>
          </div>
          
          {/* Vencimiento */}
          <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-500" />
              <span className={`font-bold uppercase text-[9px] tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Fecha de Vencimiento
              </span>
            </div>
            <span className="text-cyan-500 font-extrabold underline decoration-2 underline-offset-4 ml-4">
              {formatDate(data?.fechaFin)}
            </span>
          </div>
          
          {/* Inversión */}
          <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#606DE5]" />
              <span className={`font-bold uppercase text-[9px] tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Inversión Mensual
              </span>
            </div>
            <span className={`font-black ml-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              ${data?.costoMensual} MXN
            </span>
          </div>

          {/* Próxima Renovación */}
          <div className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
            isDarkMode 
              ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-300" 
              : "bg-indigo-50/50 border-[#606DE5]/10 text-indigo-650"
          }`}>
            <span className="font-bold uppercase text-[9px] tracking-wider">Próxima Renovación</span>
            <span className="font-black uppercase text-xs flex items-center gap-1.5 ml-4 shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> {data?.mesPagado || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <button 
            onClick={onViewHistory}
            className="w-full md:w-auto bg-[#3ACAFF] hover:bg-[#2cb2e0] text-white text-[9px] font-black uppercase tracking-[2px] py-4 px-8 rounded-2xl shadow-md hover:shadow-lg shadow-cyan-500/10 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            Ver historial de pagos <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSummaryCard;

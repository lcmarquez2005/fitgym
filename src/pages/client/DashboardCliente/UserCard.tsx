import React from "react";
import type { ClienteResumen } from "@services/dashboard.service";
import { Award, User, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";
import peopleImage from "@assets/people.png";
import { BASE_URL } from "@services/api.config";

interface UserCardProps {
  data: ClienteResumen | null;
  onRenew?: () => void;
  isDarkMode: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ data, isDarkMode }) => {
  const handleRenewClick = () => {
    toast.info("Para renovaciones de membresía, por favor acude a la recepción física de FitGym. El pago de renovaciones en línea estará disponible próximamente.");
  };

  const getImageUrl = (path?: string): string => {
    if (!path) return peopleImage;
    if (path.startsWith('data:image')) return path;
    if (path.startsWith('/uploads/')) {
      const host = BASE_URL.replace('/api', '');
      return `${host}${path}`;
    }
    return path;
  };

  const isActive = data?.estatus === "ACTIVO";

  return (
    <div className={`rounded-3xl p-8 border transition-all duration-500 flex flex-col items-center w-full xl:w-5/12 relative backdrop-blur-md hover:translate-y-[-4px] ${
      isDarkMode 
        ? "bg-slate-900/60 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
        : "bg-white/95 border-slate-100 shadow-[0_20px_50px_rgba(96,109,229,0.05)]"
    }`}>
      {/* Icono de estatus de membresía arriba a la izquierda */}
      <div className={`absolute top-6 left-6 p-2.5 rounded-xl border transition-all duration-300 ${
        isDarkMode 
          ? "bg-indigo-500/10 border-indigo-500/15 text-indigo-400" 
          : "bg-[#606DE5]/10 border-[#606DE5]/10 text-[#606DE5]"
      }`}>
        <Award className="w-5 h-5" />
      </div>

      {/* Imagen Central (Avatar de Usuario) */}
      <div className="mt-4 mb-6 relative">
        {/* Glow de fondo animado */}
        <div className={`w-40 h-40 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 blur-xl transition-all duration-500 ${
          isActive 
            ? (isDarkMode ? "bg-emerald-500" : "bg-emerald-400")
            : (isDarkMode ? "bg-rose-500" : "bg-rose-450")
        }`}></div>
        
        {/* Anillo exterior de estatus */}
        <div className={`w-36 h-36 rounded-full border-4 shadow-xl overflow-hidden relative z-10 transition-all duration-500 flex items-center justify-center ${
          isActive
            ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            : "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
        }`}>
          <img 
            src={getImageUrl(data?.foto)} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            alt="User Avatar" 
          />
        </div>

        {/* Pequeña insignia de estatus flotante */}
        <div className={`absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full z-20 flex items-center justify-center border-2 ${
          isDarkMode ? "border-slate-900" : "border-white"
        } ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}>
          {isActive ? (
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </div>

      {/* Control ID */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-[1.5px] mb-2 ${
          isDarkMode ? "bg-slate-800/80 text-slate-400 border border-slate-700/50" : "bg-slate-100 text-slate-500 border border-slate-200/50"
        }`}>
          N° Control / Socio
        </div>
        <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          {data?.idSocio || "P-PENDIENTE"}
        </h2>
      </div>

      {/* Información del Perfil */}
      <div className="w-full flex flex-col gap-3 text-sm font-inter">
        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
          isDarkMode 
            ? "bg-slate-850/50 border-slate-800/80 hover:bg-slate-850" 
            : "bg-slate-50/70 border-slate-100 hover:bg-slate-50"
        }`}>
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#606DE5]" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Socio Activo
            </span>
          </div>
          <span className={`font-extrabold text-xs uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {data?.nombreCompleto || "Cargando..."}
          </span>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
          isDarkMode 
            ? "bg-slate-850/50 border-slate-800/80 hover:bg-slate-850" 
            : "bg-slate-50/70 border-slate-100 hover:bg-slate-50"
        }`}>
          <div className="flex items-center gap-2">
            <Clock size={14} className={isActive ? "text-emerald-500" : "text-rose-500"} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Días Restantes
            </span>
          </div>
          <span className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
            data && data.diasRestantes < 5 
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          }`}>
            {data?.diasRestantes} DÍAS
          </span>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
          isDarkMode 
            ? "bg-slate-850/50 border-slate-800/80 hover:bg-slate-850" 
            : "bg-slate-50/70 border-slate-100 hover:bg-slate-50"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#3ACAFF]" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Estatus
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
            isActive 
              ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-500' 
              : 'bg-rose-500/15 border-rose-500/20 text-rose-500'
          }`}>
            {data?.estatus || "PENDIENTE"}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-8 w-full">
        <button 
          onClick={handleRenewClick}
          className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] text-white text-[10px] font-black tracking-[1.5px] py-4 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-650/15 hover:shadow-indigo-650/25 active:scale-[0.98] uppercase cursor-pointer flex items-center justify-center gap-2"
        >
          Renovar Membresía
        </button>
      </div>
    </div>
  );
};

export default UserCard;

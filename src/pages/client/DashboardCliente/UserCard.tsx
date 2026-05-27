import React, { useState } from "react";
import type { ClienteResumen } from "@services/dashboard.service";
import { Award } from "lucide-react";
import { toast } from "sonner";
import peopleImage from "@assets/people.png";

interface UserCardProps {
  data: ClienteResumen | null;
  onRenew?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ data }) => {
  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleRenewClick = () => {
    toast.info("Para renovaciones de membresía, por favor acude a la recepción física de FitGym. El pago de renovaciones en línea estará disponible próximamente.");
  };

  return (
    <div className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col items-center w-full xl:w-5/12 relative backdrop-blur-md ${
      isDarkMode 
        ? "bg-[#111827]/70 border-gray-800 shadow-2xl" 
        : "bg-white border-gray-100 shadow-xl"
    }`}>
      {/* Icono de estatus de membresía arriba a la izquierda */}
      <div className={`absolute top-8 left-8 p-2.5 rounded-xl ${
        isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-[#606DE5]/10 text-[#606DE5]"
      }`}>
        <Award className="w-5 h-5" />
      </div>

      {/* Imagen Central (Avatar de Usuario) */}
      <div className="mt-4 mb-6 relative">
        <div className={`w-40 h-40 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25 blur-xl ${
          isDarkMode ? "bg-[#606DE5]" : "bg-indigo-400"
        }`}></div>
        <div className={`w-36 h-36 rounded-full border-4 shadow-xl overflow-hidden relative z-10 ${
          isDarkMode ? "border-gray-700 bg-gray-850" : "border-white bg-indigo-50"
        }`}>
          <img src={peopleImage} className="w-full h-full object-cover" alt="User Avatar" />
        </div>
      </div>

      {/* Control ID */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
          isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}>
          N° CONTROL / SOCIO
        </div>
        <h2 className="text-2xl font-black tracking-tight">{data?.idSocio || "P-PENDIENTE"}</h2>
      </div>

      {/* Información del Perfil */}
      <div className="w-full flex flex-col gap-3.5 text-sm font-inter">
        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors duration-200 ${
          isDarkMode ? "bg-[#1F2937]/50 border-gray-800" : "bg-gray-50/70 border-gray-100"
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Socio Activo
          </span>
          <span className={`font-extrabold uppercase text-xs ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {data?.nombreCompleto || "Cargando..."}
          </span>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors duration-200 ${
          isDarkMode ? "bg-[#1F2937]/50 border-gray-800" : "bg-gray-50/70 border-gray-100"
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Días Restantes
          </span>
          <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded-full ${
            data && data.diasRestantes < 5 
              ? 'bg-red-500/10 text-red-500' 
              : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {data?.diasRestantes} DÍAS
          </span>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors duration-200 ${
          isDarkMode ? "bg-[#1F2937]/50 border-gray-800" : "bg-gray-50/70 border-gray-100"
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Estatus
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            data?.estatus === 'ACTIVO' 
              ? 'bg-emerald-500/15 text-emerald-500' 
              : 'bg-rose-500/15 text-rose-500'
          }`}>
            {data?.estatus || "PENDIENTE"}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-8 w-full">
        <button 
          onClick={handleRenewClick}
          className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] text-white text-xs font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-wider cursor-pointer"
        >
          Renovar Membresía
        </button>
      </div>
    </div>
  );
};

export default UserCard;

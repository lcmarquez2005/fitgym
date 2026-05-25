import React from "react";
import type { ClienteResumen } from "@services/dashboard.service";
import peopleImage from "@assets/people.png";

interface UserCardProps {
  images: {
    iconCard: string;
    idCardImage: string;
  };
  data: ClienteResumen | null;
  onRenew?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ images, data, onRenew }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center w-full xl:w-5/12 relative">
      {/* Estrella Roja (Icono) - Posición absoluta arriba izq */}
      <img src={images.iconCard} className="absolute top-8 left-8 w-10 h-10 object-contain" alt="Star" />

      {/* Imagen Central (Avatar de Usuario) */}
      <div className="mt-4 mb-8 relative">
        {/* Círculo morado decorativo detrás del avatar */}
        <div className="w-40 h-40 bg-[#6B5AED] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 blur-2xl"></div>
        <div className="w-44 h-44 rounded-full border-8 border-white shadow-2xl overflow-hidden relative z-10">
          <img src={peopleImage} className="w-full h-full object-cover" alt="User Avatar" />
        </div>
      </div>

      <h2 className="text-black text-2xl font-bakbak uppercase mb-6 tracking-tight">
        {data?.idSocio || "SIN ID"} <span className="text-indigo-500 text-sm ml-2">ID DE SOCIO</span>
      </h2>

      {/* Tabla de Datos */}
      <div className="w-full flex flex-col gap-4 text-sm font-inter">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Nombre</span>
          <span className="text-[#3851EE] font-extrabold uppercase">{data?.nombreCompleto || "Cargando..."}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Días restantes</span>
          <span className={`font-extrabold ${data && data.diasRestantes < 5 ? 'text-red-500' : 'text-green-600'}`}>
            {data?.diasRestantes} DÍAS
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Estatus</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${data?.estatus === 'ACTIVO' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {data?.estatus || "PENDIENTE"}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-8 w-full justify-center">
        <button 
          onClick={onRenew}
          className="bg-black text-white text-xs font-bakbak py-3 px-8 rounded-2xl shadow-xl hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-wider cursor-pointer"
        >
          Renovar Membresía
        </button>
      </div>
    </div>
  );
};

export default UserCard;

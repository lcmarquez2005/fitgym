import React from "react";

interface UserCardProps {
  images: {
    iconCard: string;
    idCardImage: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ images }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center w-full xl:w-5/12 relative">
      {/* Estrella Roja (Icono) - Posición absoluta arriba izq */}
      <img src={images.iconCard} className="absolute top-8 left-8 w-10 h-10 object-contain" alt="Star" />

      {/* Imagen Central (Chico Pesas) */}
      <div className="mt-4 mb-6 relative">
        {/* Círculo morado decorativo detrás del chico */}
        <div className="w-48 h-48 bg-[#6B5AED] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 blur-xl"></div>
        <img src={images.idCardImage} className="w-64 h-48 object-contain relative z-10" alt="ID Card" />
      </div>

      <h2 className="text-black text-2xl font-bold mb-6">21515161 (ID DE SOCIO)</h2>

      {/* Tabla de Datos */}
      <div className="w-full flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-black font-bold">Nombre</span>
          <span className="text-[#3851EE] font-bold">Fulanito Guhdiuh</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-black font-bold">Días restantes de membresía</span>
          <span className="text-black font-bold">15 días</span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-8 w-full justify-center">
        <button className="bg-[#FBBB62] hover:bg-[#eeb15b] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px]">
          Renovar
        </button>
        <button className="bg-[#FF6500] hover:bg-[#e55b00] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px]">
          Cobrar
        </button>
        <button className="bg-[#5BBBFF] hover:bg-[#4ba8eb] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px]">
          Editar
        </button>
      </div>
    </div>
  );
};

export default UserCard;

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // URLs extraídas de tu diseño original para que se vean los iconos a color
  const images = {
    userAvatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/byp19s9s_expires_30_days.png",
    editIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/6jgmeu5i_expires_30_days.png",
    // Iconos del menú a color
    altaIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/1z2dfnwb_expires_30_days.png", 
    proveedoresIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/it2s9i8t_expires_30_days.png",
    controlIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/p8gh7v4i_expires_30_days.png",
  };

  return (
    <div className="h-screen p-6 bg-[#F6F8FE] shrink-0 flex flex-col justify-between w-[340px]">
      
      {/* Tarjeta del Sidebar (Fondo Blanco con sombra) */}
      <div className="flex flex-col w-full h-full bg-white py-8 rounded-[30px] shadow-xl relative overflow-hidden">
        
        {/* --- HEADER USUARIO --- */}
        <div className="flex justify-between items-center px-8 mb-8">
          <div className="flex flex-col">
            <span className="text-black text-2xl font-bold">Luis</span>
            <span className="text-gray-400 text-lg">Admin</span>
          </div>
          
          <div className="flex items-center gap-2">
             <img src={images.userAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="User" />
             {/* Botón de editar pequeño */}
             <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <img src={images.editIcon} className="w-4 h-4 object-contain" alt="Edit" />
             </button>
          </div>
        </div>

        {/* Separador Negro Grueso */}
        <div className="w-[80%] h-1.5 bg-black mx-auto rounded-full mb-10 opacity-90"></div>

        {/* --- MENÚ --- */}
        <div className="flex flex-col gap-8 px-8">
            
            {/* Título Dashboard */}
            <div className="pl-2">
                <h2 className="text-black text-2xl font-bold">Dashboard</h2>
            </div>

            {/* Opción 1: Alta de Usuario */}
            <div className="flex items-center gap-5 cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img src={images.altaIcon} className="w-full h-full object-contain" alt="Alta" />
                </div>
                <span className="text-black text-xl font-medium group-hover:text-blue-600 transition-colors">Alta de Usuario</span>
            </div>

            {/* Opción 2: Proveedores */}
            <div className="flex items-center gap-5 cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img src={images.proveedoresIcon} className="w-full h-full object-contain" alt="Proveedores" />
                </div>
                <span className="text-black text-xl font-medium group-hover:text-blue-600 transition-colors">Proveedores</span>
            </div>

            {/* Opción 3: Control Acceso */}
            <div className="flex items-center gap-5 cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img src={images.controlIcon} className="w-full h-full object-contain" alt="Control" />
                </div>
                <span className="text-black text-xl font-medium group-hover:text-blue-600 transition-colors">Control Acceso</span>
            </div>
        </div>

        {/* Espaciador flexible */}
        <div className="flex-1"></div>

        {/* Separador Inferior */}
        <div className="w-[80%] h-1.5 bg-black mx-auto rounded-full mb-8 opacity-90"></div>

        {/* Botón Log Out */}
        <div className="px-8 pb-4">
            <button 
                className="w-full bg-[#5C6BF0] hover:bg-[#4b5bd6] py-3 rounded-[20px] transition-all active:scale-95 shadow-lg shadow-indigo-200"
                onClick={() => navigate("/")}
            >
              <span className="text-white text-xl font-bold">Log Out</span>
            </button>
        </div>

      </div>
    </div>
  );
}
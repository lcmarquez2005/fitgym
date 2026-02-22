import React from "react";
import Sidebar from "../../components/Sidebar.tsx";
import Footer from "../../components/Footer.tsx";
import Navbar from "../../components/Navbar.jsx";

export default function Dashboard() {
  
  const images = {
    iconCard: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ruvgt3n0_expires_30_days.png", // Estrella roja
    idCardImage: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ory280oa_expires_30_days.png", // Chico pesas
    
    // --- IMÁGENES DE LA GRÁFICA (DERECHA) ---
    // Usaremos el ticket detallado y el círculo de fondo
    purpleCircle: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/9m4a9baw_expires_30_days.png", 
    orangeTicket: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/r149okud_expires_30_days.png", 
    
    logoFooter: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/xx9qbpqk_expires_30_days.png",
  };

  return (
    <div className="flex h-screen bg-[#9FDDFF] overflow-hidden font-sans">
      {/* NOTA: Puse el fondo general azul (#9FDDFF) para que coincida con el header superior, 
          y luego el contenido tendrá fondo blanco o gris claro según corresponda */}
      
      {/* 1. SIDEBAR IZQUIERDO */}

      {/* 2. CONTENIDO DERECHA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F6F8FE]">
        
        <Navbar/>
        {/* HEADER AZUL (Ahora es parte del fondo superior, pero ponemos el título aquí) */}
        <div className="bg-[#9FDDFF] w-full py-10 px-12">
            <h1 className="text-black text-4xl font-normal opacity-80">Menu principal de opciones</h1>
        </div>

        {/* CONTENEDOR DE TARJETAS */}
        <div className="flex flex-col xl:flex-row gap-6 px-10 mt-6 pb-12 items-stretch">
            
            {/* --- TARJETA 1: Usuario (Izquierda) --- */}
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

            {/* --- TARJETA 2: Membresía (Derecha) --- */}
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
                    <h3 className="text-black text-xl font-bold mb-4">Resumen de membresía</h3>
                    
                    <div className="space-y-3 text-sm text-gray-800">
                        <p><span className="font-bold">Tipo actual</span> <span className="text-gray-500">/ Individual</span></p>
                        <p><span className="font-bold">Fecha inicio</span> <span className="text-gray-500">/ xx/xx/xxxx</span></p>
                        <p><span className="font-bold">Fecha vencimiento</span> <span className="text-gray-500">/ xx/xx/xxxx</span></p>
                        <p><span className="font-bold">Precio pagado</span> <span className="text-gray-500">/ $xxx</span></p>
                        <p><span className="font-bold">Método de pago</span> <span className="text-gray-500">/ T,E,TR</span></p>
                        <p className="font-bold text-gray-500">Rp 199.000 / 3 Month</p>
                    </div>

                    <div className="mt-4 flex justify-start">
                        <button className="bg-[#3ACAFF] hover:bg-[#32b2e0] text-white text-sm font-bold py-3 px-8 rounded-3xl shadow-lg shadow-cyan-100">
                            Historial de pagos
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- FOOTER NEGRO --- */}
      <Footer />
      </div>
    </div>
  );
}
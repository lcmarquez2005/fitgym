import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#9FDDFF] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F6F8FE] rounded-tl-[40px]">

        {/* TÍTULO */}
        <div className="bg-[#9FDDFF] w-full py-8 px-8 shrink-0 flex items-center gap-4">
          {/* Botón hamburguesa (visible solo en móvil/tablet) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="xl:hidden p-2 rounded-xl bg-white/60 hover:bg-white transition-colors"
          >
            <Icon name="menu" size={22} color="#000" />
          </button>
          <h1 className="text-black text-3xl font-normal opacity-80">
            Menu principal de opciones
          </h1>
        </div>

        {/* CONTENEDOR DE TARJETAS */}
        <div className="flex flex-col xl:flex-row gap-6 px-8 -mt-6 pb-10 items-stretch">

          {/* --- TARJETA IZQUIERDA: Usuario --- */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center w-full xl:w-5/12 relative">

            {/* Estrella */}
            <div className="absolute top-8 left-8">
              <Icon name="star" size={36} />
            </div>

            {/* Avatar con gradiente CSS */}
            <div className="mt-4 mb-6 relative">
              <div className="w-48 h-48 bg-[#6B5AED] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-xl" />
              <div className="w-40 h-40 bg-gradient-to-br from-[#8B5CF6] to-[#3851EE] rounded-full flex items-center justify-center relative z-10 shadow-xl">
                <Icon name="dumbbell" size={56} color="white" />
              </div>
            </div>

            <h2 className="text-black text-xl font-bold mb-6">21515161 (ID DE SOCIO)</h2>

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

            <div className="flex gap-3 mt-8 w-full justify-center flex-wrap">
              <button className="bg-[#FBBB62] hover:bg-[#eeb15b] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px] transition-transform active:scale-95">
                Renovar
              </button>
              <button className="bg-[#FF6500] hover:bg-[#e55b00] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px] transition-transform active:scale-95">
                Cobrar
              </button>
              <button
                className="bg-[#5BBBFF] hover:bg-[#4ba8eb] text-white text-sm font-bold py-3 px-6 rounded-3xl min-w-[100px] transition-transform active:scale-95"
                onClick={() => navigate("/socios")}
              >
                Ver socio
              </button>
            </div>
          </div>

          {/* --- TARJETA DERECHA: Membresía --- */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row w-full xl:w-7/12 items-center gap-8 relative overflow-hidden">

            {/* Ticket visual (CSS puro) */}
            <div className="relative w-[240px] h-[280px] shrink-0 flex items-center justify-center">
              {/* Círculo morado */}
              <div className="absolute w-[200px] h-[200px] bg-[#8B5CF6] rounded-full z-0 shadow-2xl opacity-90" />
              {/* Ticket naranja */}
              <div
                className="absolute z-10 w-[160px] bg-[#FF6B35] rounded-[20px] shadow-xl flex flex-col items-center py-5 px-4 gap-2"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-8deg)" }}
              >
                <div className="w-full h-1 bg-white/30 rounded" />
                <div className="text-white text-xs font-black tracking-widest mt-1">FITGYM</div>
                <div className="w-full h-[2px] bg-white/20 my-1" />
                {/* Código de barras simulado */}
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`bg-white rounded-sm ${i % 3 === 0 ? "w-[3px] h-8" : "w-[1.5px] h-8"}`} />
                  ))}
                </div>
                <div className="text-white text-[9px] opacity-70 mt-1">MEMBRESÍA ACTIVA</div>
              </div>
            </div>

            {/* Datos membresía */}
            <div className="flex flex-col gap-2 w-full z-30">
              <h3 className="text-black text-xl font-bold mb-4">Resumen de membresía</h3>
              <div className="space-y-3 text-sm text-gray-800">
                <p><span className="font-bold">Tipo actual</span> <span className="text-gray-500">/ Individual</span></p>
                <p><span className="font-bold">Fecha inicio</span> <span className="text-gray-500">/ 20/01/2024</span></p>
                <p><span className="font-bold">Fecha vencimiento</span> <span className="text-gray-500">/ 20/02/2024</span></p>
                <p><span className="font-bold">Precio pagado</span> <span className="text-gray-500">/ $500</span></p>
                <p><span className="font-bold">Método de pago</span> <span className="text-gray-500">/ Tarjeta</span></p>
                <p className="font-bold text-gray-500">Plan trimestral</p>
              </div>
              <div className="mt-4 flex justify-start">
                <button className="bg-[#3ACAFF] hover:bg-[#32b2e0] text-white text-sm font-bold py-3 px-8 rounded-3xl shadow-lg shadow-cyan-100 transition-transform active:scale-95">
                  Historial de pagos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-black rounded-[30px] p-10 text-white mx-8 mb-8 mt-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon name="dumbbell" size={18} color="white" />
                </div>
                <span className="text-2xl font-bold tracking-wide">FITCAMP</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Largest gym in indonesian, top-tier facilities, premium amenities...
              </p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white mb-1">More to Know</span>
                <span className="text-xs text-gray-400">Blog</span>
                <span className="text-xs text-gray-400">Subscription</span>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white mb-1">Contact Us</span>
                <span className="text-xs text-gray-400">021-0892-2323</span>
                <span className="text-xs text-gray-400">admin@fitcamp.com</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

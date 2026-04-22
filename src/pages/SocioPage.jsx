import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";

export default function SocioPage() {
  const [extras, setExtras] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#9FDDFF] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto bg-[#CCF1FF]">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#CCF1FF] sticky top-0 z-20">
          {/* Botón volver */}
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl bg-white/60 hover:bg-white transition-colors"
            title="Volver al inicio"
          >
            <Icon name="back" size={22} color="#000" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Icon name="dumbbell" size={18} color="white" />
            </div>
            <span className="text-black text-2xl font-black tracking-wide">FITGYM</span>
          </div>

          {/* Botón abrir menú */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/60 hover:bg-white transition-colors"
          >
            <Icon name="menu" size={22} color="#000" />
          </button>
        </header>

        {/* TARJETAS */}
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 pb-10 gap-6">

          {/* --- TARJETA AMARILLA: Datos Personales --- */}
          <div className="flex flex-col items-center w-full bg-[#FFFECD] rounded-[32px] p-8 shadow-sm mt-4">

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 w-full border-b border-black/10 pb-6">
              {/* Avatar CSS */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3851EE] flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                <Icon name="users" size={60} color="white" />
              </div>
              <h2 className="text-black text-3xl font-bold uppercase text-center md:text-left">
                Información del socio
              </h2>
            </div>

            {/* Grid de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-y-6 gap-x-12">
              {[
                ["Nombre completo",        "Juan Carlos Roa"],
                ["Teléfono",               "085258974410"],
                ["Email",                  "ejemplo@gmail.com"],
                ["Fecha de nacimiento",    "24/05/1990"],
                ["Sexo",                   "Masculino"],
                ["Contacto de emergencia", "Maria Roa - 7777777777"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="block text-gray-600 text-xs font-bold uppercase mb-1">{label}</span>
                  <span className="block text-black text-lg font-medium break-words">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- TARJETA BLANCA: Membresía + Médica --- */}
          <div className="flex flex-col w-full bg-[#F6F8FE] rounded-[32px] p-4 gap-4">

            {/* Bloque membresía */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <h3 className="text-[25px] font-bold text-black mb-6">ID de socio : 10238</h3>

              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <span className="text-gray-600 font-bold">Fecha de registro</span>
                <span className="text-black font-medium">10/01/2024</span>
              </div>

              {/* Estatus */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="status" size={22} color="#22c55e" />
                </div>
                <div>
                  <span className="block font-bold text-black">Estatus</span>
                  <span className="block text-sm text-green-500 font-medium">Activo</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-black">Tipo de membresía</span>
                <span>Individual</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-black">Promo ó descuento</span>
                <span className="text-red-500 font-bold">-10%</span>
              </div>

              <div className="bg-[#D0EEFF] rounded-2xl p-4 flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-black">Costo mensual</span>
                <span className="text-xl font-bold text-black">$500</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-600">Inicio: 01/01/2024</span>
                <span className="font-bold text-gray-600">Fin: 01/02/2024</span>
              </div>
            </div>

            {/* Bloque médico / extras */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <h3 className="text-[25px] font-bold text-black mb-6">Información médica / Extras</h3>

              <div className="space-y-4 mb-6">
                {[["Lesiones", "Ninguna"], ["Alergias", "Ninguna"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-bold text-black">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>

              <input
                placeholder="Escribe extras aquí..."
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                className="w-full bg-[#D0EEFF] text-black text-lg py-4 px-6 rounded-2xl border-none outline-none mb-6 placeholder-gray-500"
              />

              <div className="flex justify-between items-center">
                <span className="font-bold text-black text-lg">Huella digital o QR</span>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Icon name="fingerprint" size={44} color="#6B5AED" />
                </div>
              </div>
            </div>

            {/* Botón guardar */}
            <button
              className="w-full bg-[#21CB62] hover:bg-[#1db556] text-white text-2xl font-bold py-4 rounded-[24px] shadow-lg active:scale-95 transition-transform mt-2"
              onClick={() => alert("Guardado exitoso")}
            >
              Guardar
            </button>

            {/* FOOTER NEGRO */}
            <div className="bg-black rounded-[28px] p-8 text-white mt-8">
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                <div className="max-w-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                      <Icon name="dumbbell" size={16} color="white" />
                    </div>
                    <span className="text-xl font-bold">FITCAMP</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Largest gym in indonesia, top-tier facilities, premium amenities.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 text-xs text-gray-400">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-white">More to Know</span>
                    <span>Blog</span>
                    <span>Subscription</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-white">Contact Us</span>
                    <span>021-0892-2323</span>
                    <span>admin@fitcamp.com</span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-white/20 w-full mb-4" />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>2024 fitcampcorporation</span>
                <div className="flex gap-4">
                  <span>Terms</span>
                  <span>Privacy</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

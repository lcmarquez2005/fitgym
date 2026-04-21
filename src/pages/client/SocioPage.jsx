import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer"
import Header from "../../components/Header"

export default function SocioPage() {

  const [extras, setExtras] = useState("");
  const navigate = useNavigate();

  // URLs de tus imágenes de Figma
  const images = {
    menuIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/cmbs0dk5_expires_30_days.png",
    logoHeader: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/549xinh5_expires_30_days.png",
    userPhoto: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/bp4d6fgu_expires_30_days.png",
    statusIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/7rubqqgd_expires_30_days.png",
    fingerprint: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/z8h8ojz9_expires_30_days.png",
    logoFooter: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/8og8kinx_expires_30_days.png"
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#CCF1FF] font-sans">
      
      {/* --- HEADER --- */}
        <Header />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 pb-10 gap-6">
        
        {/* --- TARJETA AMARILLA (Datos Personales) --- */}
        <div className="flex flex-col items-center w-full bg-[#FFFECD] rounded-[32px] p-8 shadow-sm relative mt-4">
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 w-full border-b border-black/10 pb-6">
                {/* Foto del Socio de Figma */}
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 shrink-0">
                    <img
                        src={images.userPhoto}
                        className="w-full h-full object-cover"
                        alt="Foto Socio"
                    />
                </div>
                <h2 className="text-black text-3xl font-bold uppercase text-center md:text-left">Información del socio</h2>
            </div>

            {/* Grid de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-y-6 gap-x-12">
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Nombre completo</span>
                    <span className="block text-black text-lg font-medium">Juan Carlos Roa</span>
                </div>
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Teléfono</span>
                    <span className="block text-black text-lg font-medium">085258974410</span>
                </div>
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Email</span>
                    <span className="block text-black text-lg font-medium break-words">ejemplo@gmail.com</span>
                </div>
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Fecha de nacimiento</span>
                    <span className="block text-black text-lg font-medium">24/05/1990</span>
                </div>
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Sexo</span>
                    <span className="block text-black text-lg font-medium">Masculino</span>
                </div>
                <div>
                    <span className="block text-gray-600 text-xs font-bold uppercase mb-1">Contacto de emergencia</span>
                    <span className="block text-black text-lg font-medium">Maria Roa - 7777777777</span>
                </div>
            </div>
        </div>

        {/* --- TARJETA BLANCA DE DATOS --- */}
        <div className="flex flex-col w-full bg-[#F6F8FE] rounded-[32px] p-4 gap-4">
            
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
                <h3 className="text-[25px] font-bold text-black mb-6">ID de socio : 10238</h3>
                
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-600 font-bold">Fecha de registro</span>
                    <span className="text-black font-medium">10/01/2024</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    {/* Icono Estatus de Figma */}
                    <img 
                        src={images.statusIcon} 
                        className="w-10 h-10 object-contain" 
                        alt="Estatus"
                    />
                    <div>
                        <span className="block font-bold text-black">Estatus</span>
                        <span className="block text-sm text-gray-500">Activo, Suspendido...</span>
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

            <div className="bg-white rounded-[24px] p-8 shadow-sm">
                <h3 className="text-[25px] font-bold text-black mb-6">Información médica / Extras</h3>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="font-bold text-black">Lesiones</span>
                        <span>Ninguna</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="font-bold text-black">Alergias</span>
                        <span>Ninguna</span>
                    </div>
                </div>

                <input
                    placeholder="Escribe extras aquí..."
                    value={extras}
                    onChange={(e) => setExtras(e.target.value)}
                    className="w-full bg-[#D0EEFF] text-black text-lg py-4 px-6 rounded-2xl border-none outline-none mb-6 placeholder-gray-500"
                />

                <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-lg">Huella digital o QR</span>
                    {/* Huella Digital de Figma */}
                    <img 
                        src={images.fingerprint} 
                        className="w-20 h-20 object-contain" 
                        alt="Huella"
                    />
                </div>
            </div>
            
<div className="flex flex-col gap-4 w-full mt-2">
                {/* <-- NUEVO BOTÓN ESTADO DE CUENTA --> */}
                <button 
                    className="w-full bg-[#3851EE] hover:bg-[#2b41cc] text-white text-2xl font-bold py-4 rounded-[24px] shadow-lg active:scale-95 transition-transform"
                    onClick={() => navigate("/estado-cuenta")} // Asegúrate de que esta sea la ruta correcta en tu App.jsx
                >
                    Estado de cuenta
                </button>

                {/* BOTÓN GUARDAR ORIGINAL */}
                <button 
                    className="w-full bg-[#21CB62] hover:bg-[#1db556] text-white text-2xl font-bold py-4 rounded-[24px] shadow-lg active:scale-95 transition-transform"
                    onClick={() => alert("Guardado exitoso")}
                >
                    Guardar
                </button>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
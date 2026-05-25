import React from "react";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Printer, Shield, ArrowRight } from "lucide-react";

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails;

  const ticketId = paymentDetails?.pagoId ? `#FG-${paymentDetails.pagoId}` : "#FG-10238";
  const planName = paymentDetails?.planName ? paymentDetails.planName.toUpperCase() : "FITPLAN REGULAR";
  const vigencia = paymentDetails?.nuevaFechaFin ? paymentDetails.nuevaFechaFin : "3 MESES";
  const totalPaid = paymentDetails?.monto ? `MXN ${paymentDetails.monto.toFixed(2)}` : "MXN 720.00";
  const socioName = paymentDetails?.socio ? paymentDetails.socio : "SOCIO INVITADO";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FE] font-inter">
      {/* Añadimos estilos de impresión inline para ocultar todo lo que no sea el ticket al imprimir */}
      <style>
        {`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            nav, footer, .no-print {
              display: none !important;
            }
            .print-container {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-w: 100% !important;
            }
          }
        `}
      </style>

      <div className="no-print">
        <Navbar />
      </div>

      <div className="flex flex-col items-center py-16 px-4 flex-grow">
        {/* Ticket Container */}
        <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100/50 w-full max-w-xl overflow-hidden print-container transition-all hover:shadow-gray-200/50">
          
          {/* Top Success Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white flex flex-col items-center relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-inner">
              <Check className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bakbak uppercase tracking-wide">¡Pago Confirmado!</h2>
            <p className="text-emerald-100 text-xs mt-1">Tu suscripción en FitGym ya se encuentra activa.</p>
            
            {/* Círculos laterales de boleto */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#F6F8FE] rounded-full no-print" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F6F8FE] rounded-full no-print" />
          </div>

          <div className="p-8 md:p-10 flex flex-col items-center">
            
            {/* Saludo */}
            <div className="text-center mb-8">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Titular de Cuenta</span>
              <h3 className="text-xl font-bold text-gray-800">{socioName}</h3>
            </div>

            {/* Detalles del Recibo */}
            <div className="w-full border border-dashed border-gray-200 rounded-2xl p-6 mb-8 bg-gray-50/50">
              <div className="flex justify-between mb-4 border-b border-gray-150 pb-3 text-sm">
                <span className="text-gray-400 font-semibold">Código de Transacción</span>
                <span className="font-mono font-bold text-indigo-600">{ticketId}</span>
              </div>
              
              <div className="flex justify-between mb-4 border-b border-gray-150 pb-3 text-sm">
                <span className="text-gray-400 font-semibold">Plan Contratado</span>
                <span className="font-bold text-gray-800">{planName}</span>
              </div>
              
              <div className="flex justify-between mb-4 border-b border-gray-150 pb-3 text-sm">
                <span className="text-gray-400 font-semibold">Vigencia de Membresía</span>
                <span className="font-bold text-gray-800 uppercase">{vigencia}</span>
              </div>

              <div className="flex justify-between mb-4 border-b border-gray-150 pb-3 text-sm">
                <span className="text-gray-400 font-semibold">Método de Pago</span>
                <span className="font-bold text-gray-800">Tarjeta (Simulada)</span>
              </div>

              <div className="flex justify-between pt-2 text-base">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-wider flex items-center gap-1">
                  <Shield size={14} className="text-emerald-500" /> Total Pagado
                </span>
                <span className="font-bakbak text-lg text-emerald-600">{totalPaid}</span>
              </div>
            </div>

            {/* Simulación Código de Barras */}
            <div className="flex flex-col items-center w-full mb-8 pt-4 border-t border-gray-100">
              <div className="flex justify-center items-stretch h-12 w-48 gap-[1.5px] opacity-80">
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
              </div>
              <span className="text-[9px] font-mono text-gray-400 tracking-[0.25em] mt-1.5">{ticketId}</span>
            </div>

            {/* Botones de acción (no se imprimen) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full no-print">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 bg-[#606DE5] hover:bg-[#4d5bc4] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 cursor-pointer"
              >
                Ir a mi Dashboard
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={handlePrint}
                className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer size={18} />
                Imprimir
              </button>
            </div>

            <button 
              onClick={() => navigate('/')} 
              className="mt-6 text-xs text-gray-400 hover:text-gray-600 font-bold hover:underline no-print block cursor-pointer"
            >
              Volver a la página principal
            </button>
          </div>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};

export default TicketPage;


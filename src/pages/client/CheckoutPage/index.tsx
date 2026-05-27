import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { LandingService } from "@services/landing.service";
import { toast } from "sonner";
import QRCode from "qrcode";
import { QrCode, CreditCard, Laptop, RefreshCw, Sparkles, Check } from "lucide-react";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { checkoutData, email } = location.state || {};

  useEffect(() => {
    if (!checkoutData) {
      toast.warning("No hay sesión de pago activa. Regístrate para iniciar el pago.");
      navigate("/registro");
      return;
    }

    if (canvasRef.current && checkoutData.qrData) {
      QRCode.toCanvas(
        canvasRef.current,
        checkoutData.qrData,
        {
          width: 250,
          margin: 1.5,
          color: {
            dark: "#0B0F19",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Error al generar QR:", error);
        }
      );
    }

    const startPolling = () => {
      let totalAttempts = 0;
      const maxAttempts = 100;

      pollIntervalRef.current = setInterval(async () => {
        totalAttempts++;
        if (totalAttempts > maxAttempts) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          toast.error("El tiempo de espera para el pago ha expirado. Por favor, intenta de nuevo.");
          navigate("/registro");
          return;
        }

        try {
          const res = await LandingService.verificarPago(checkoutData.sessionId);
          if (res.estatus === "PAGADO") {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            toast.success("¡Pago confirmado con éxito! 🎉");
            navigate(`/registro-exitoso?session_id=${checkoutData.sessionId}`);
          } else if (res.estatus === "EXPIRADO") {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            toast.error("La sesión de Stripe ha expirado. Regístrate de nuevo.");
            navigate("/registro");
          }
        } catch (error) {
          console.error("Error en polling:", error);
        }
      }, 3000);
    };

    startPolling();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [checkoutData, navigate]);

  if (!checkoutData) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col font-inter transition-colors duration-300 relative overflow-hidden ${
      isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F8FAFC] text-gray-900"
    }`}>
      {/* Background Decorative Glows */}
      <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? "bg-[#606DE5]/10" : "bg-[#606DE5]/5"
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? "bg-indigo-500/10" : "bg-indigo-500/5"
      }`} />

      <Navbar isDark={isDarkMode} />

      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-10 animate-fade-in">
        
        {/* Step Progress Tracker */}
        <div className="w-full max-w-xl mb-12">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold mt-2 text-emerald-500">Registro</span>
            </div>
            
            {/* Line 1 */}
            <div className="h-1 flex-grow mx-2 rounded-full bg-emerald-500" />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-[#606DE5] text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30 ring-4 ring-[#606DE5]/20">
                2
              </div>
              <span className="text-xs font-bold mt-2 text-[#606DE5]">Pago Seguro</span>
            </div>

            {/* Line 2 */}
            <div className={`h-1 flex-grow mx-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-150 text-gray-400"
              }`}>
                3
              </div>
              <span className={`text-xs mt-2 font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Activación</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl">
          {/* Card principal */}
          <div className={`p-8 md:p-12 rounded-3xl border transition-all duration-300 backdrop-blur-md ${
            isDarkMode
              ? "bg-[#111827]/70 border-gray-800/80 shadow-2xl shadow-indigo-950/20"
              : "bg-white border-gray-100 shadow-xl shadow-gray-100/50"
          }`}>
            
            {/* Header del Plan */}
            <div className="text-center mb-10 pb-8 border-b border-gray-850/10 dark:border-gray-150/10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#606DE5]/10 text-[#606DE5] text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" /> Transacción Segura Stripe
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                Resumen de Compra
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1">{checkoutData.planNombre}</h1>
              <p className="text-3xl font-black text-[#606DE5] mt-2">{checkoutData.monto}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* QR Panel */}
              <div className="flex flex-col items-center">
                <div className={`p-4.5 rounded-2xl bg-white shadow-lg inline-block border ${
                  isDarkMode ? "border-gray-800" : "border-gray-100"
                }`}>
                  <canvas ref={canvasRef} className="rounded-xl" />
                </div>
                <div className="text-center mt-5">
                  <h3 className="font-bold text-sm flex items-center gap-1.5 justify-center">
                    <QrCode className="w-4 h-4 text-[#606DE5]" /> Pago móvil con QR
                  </h3>
                  <p className={`text-xs mt-1.5 max-w-[240px] leading-relaxed ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Abre la cámara de tu móvil para escanear y pagar cómodamente con Google Pay o Tarjeta.
                  </p>
                </div>
              </div>

              {/* Botón Desktop & Espera */}
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-[#606DE5]" /> ¿Prefieres pagar en la Web?
                  </h3>
                  <p className={`text-xs leading-relaxed ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Haz clic aquí para abrir de forma segura el portal de pagos de Stripe en una nueva pestaña:
                  </p>
                  
                  <a
                    href={checkoutData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] active:scale-[0.98] text-white font-extrabold py-4 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 text-center text-sm"
                  >
                    <CreditCard className="w-4 h-4" /> Pagar en este dispositivo
                  </a>
                </div>

                {/* Spinner indicando espera */}
                <div className={`p-4.5 rounded-2xl border flex items-start gap-3.5 ${
                  isDarkMode ? "bg-gray-850/40 border-gray-800" : "bg-gray-50/70 border-gray-100"
                }`}>
                  <RefreshCw className="w-5 h-5 text-[#606DE5] animate-spin shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">Sincronización en tiempo real</h4>
                    <p className={`text-[10px] leading-relaxed mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Una vez que finalices el pago en tu móvil o en la pestaña externa, la aplicación web lo detectará de inmediato.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email de envío */}
            {email && (
              <div className={`mt-10 text-center text-xs pt-6 border-t border-gray-850/10 dark:border-gray-150/10 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                Las credenciales se generarán al correo: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{email}</strong>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

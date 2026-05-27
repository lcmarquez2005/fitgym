import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { LandingService, type VerificarPagoResponse } from "@services/landing.service";
import { AuthService } from "@services/auth.service";
import { useAuth } from "@context/AuthContext";
import { toast } from "sonner";
import { PartyPopper, Mail, Calendar, Key, ArrowRight, ShieldCheck, Check, Sparkles, UserCheck } from "lucide-react";

export const RegistroExitoso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [loading, setLoading] = useState(true);
  const [pagoData, setPagoData] = useState<VerificarPagoResponse | null>(null);
  const [autoLoginSuccess, setAutoLoginSuccess] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      toast.error("Falta el identificador de la sesión de pago.");
      setLoading(false);
      return;
    }

    const fetchPagoDataAndLogin = async () => {
      try {
        const data = await LandingService.verificarPago(sessionId);
        setPagoData(data);

        // Intentar auto-login si hay una contraseña pendiente en sessionStorage
        const savedPassword = sessionStorage.getItem("pending_register_password");
        if (data.email && savedPassword) {
          try {
            const authRes = await AuthService.login({
              email: data.email,
              password: savedPassword,
            });

            if (authRes.success && authRes.data) {
              login(authRes.data.user, authRes.data.token);
              setAutoLoginSuccess(true);
              toast.success(`¡Sesión iniciada como ${authRes.data.user.name}!`);
            }
          } catch (loginErr) {
            console.error("Error en auto-login:", loginErr);
            toast.info("Pago confirmado. Por favor inicia sesión manualmente.");
          } finally {
            // Limpiar la contraseña temporal por seguridad
            sessionStorage.removeItem("pending_register_password");
          }
        }
      } catch (error: any) {
        console.error("Error al verificar pago:", error);
        toast.error("No pudimos cargar los detalles de confirmación, pero tu pago fue registrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagoDataAndLogin();
  }, [sessionId, login]);

  const handleNextAction = () => {
    if (isAuthenticated || autoLoginSuccess) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

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
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 animate-scale-in">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold mt-2 text-emerald-500">Registro</span>
            </div>
            
            {/* Line 1 */}
            <div className="h-1 flex-grow mx-2 rounded-full bg-emerald-500" />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 animate-scale-in">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold mt-2 text-emerald-500">Pago Seguro</span>
            </div>

            {/* Line 2 */}
            <div className="h-1 flex-grow mx-2 rounded-full bg-emerald-500" />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/20 animate-scale-in">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold mt-2 text-emerald-500">Activación</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#606DE5] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Confirmando alta de tu membresía...
              </p>
            </div>
          ) : (
            <div className={`p-8 md:p-12 rounded-3xl border transition-all duration-300 backdrop-blur-md text-center ${
              isDarkMode
                ? "bg-[#111827]/70 border-gray-800/80 shadow-2xl shadow-indigo-950/20"
                : "bg-white border-gray-100 shadow-xl shadow-gray-100/50"
            }`}>
              
              {/* Celeb Icon with Ring */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping opacity-75"></div>
                <PartyPopper className="w-12 h-12 relative z-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" /> Transacción Confirmada
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                ¡Bienvenido a la Tribu!
              </h1>
              <p className={`text-sm mb-10 max-w-[360px] mx-auto leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Tu membresía en <strong className="text-[#606DE5]">FitGym</strong> ha sido activada correctamente en el sistema.
              </p>

              {/* Caja de Detalles */}
              {pagoData && (
                <div className={`text-left p-6.5 rounded-2xl border mb-10 space-y-4.5 ${
                  isDarkMode ? "bg-[#1F2937]/45 border-gray-800" : "bg-gray-50/70 border-gray-100"
                }`}>
                  <div className="flex items-center gap-3.5">
                    <ShieldCheck className="w-5 h-5 text-[#606DE5] shrink-0" />
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wide block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Membresía Contratada
                      </span>
                      <strong className="text-sm font-bold tracking-tight">{pagoData.planNombre || "Membresía FitGym"}</strong>
                    </div>
                  </div>

                  {pagoData.email && (
                    <div className="flex items-center gap-3.5">
                      <Mail className="w-5 h-5 text-[#606DE5] shrink-0" />
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wide block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Correo del Socio
                        </span>
                        <strong className="text-sm font-bold tracking-tight">{pagoData.email}</strong>
                      </div>
                    </div>
                  )}

                  {pagoData.fechaFin && (
                    <div className="flex items-center gap-3.5">
                      <Calendar className="w-5 h-5 text-[#606DE5] shrink-0" />
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wide block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Próxima Renovación
                        </span>
                        <strong className="text-sm font-bold tracking-tight">{pagoData.fechaFin}</strong>
                      </div>
                    </div>
                  )}

                  {autoLoginSuccess ? (
                    <div className="flex items-center gap-3.5 pt-3.5 border-t border-gray-850/10 dark:border-gray-150/10">
                      <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <p className="text-xs leading-relaxed font-bold text-emerald-500">
                        Sesión iniciada automáticamente en este navegador. Ya puedes ingresar directamente a tu portal.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3.5 pt-3.5 border-t border-gray-850/10 dark:border-gray-150/10">
                      <Key className="w-5 h-5 text-[#606DE5] shrink-0 mt-0.5" />
                      <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Por favor, inicia sesión con el correo y contraseña que proporcionaste durante el registro.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Nota de control físico */}
              <p className={`text-xs leading-relaxed mb-8 ${isDarkMode ? "text-gray-550" : "text-gray-400"}`}>
                💡 Cuando acudas al gimnasio físico por primera vez, presenta tu confirmación en recepción para dar de alta tu huella y asignarte tu número de acceso.
              </p>

              {/* Botón de Login o Dashboard */}
              <button
                onClick={handleNextAction}
                className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 flex items-center justify-center gap-2"
              >
                {isAuthenticated || autoLoginSuccess ? (
                  <>
                    Ir al Dashboard de Socio <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Ingresar al Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default RegistroExitoso;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { PlanesService, type Plan } from "@services/planes.service";
import { LandingService } from "@services/landing.service";
import { AuthService } from "@services/auth.service";
import { toast } from "sonner";
import { Dumbbell, User, Mail, Phone, Check, ArrowRight, Sparkles, Lock } from "lucide-react";

export const RegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlanes, setLoadingPlanes] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
  });

  useEffect(() => {
    const loadPlanes = async () => {
      try {
        const data = await PlanesService.getAll();
        const activePlanes = data.filter(p => p.activo);
        setPlanes(activePlanes);

        const pendingPlan = location.state?.planPendingSelection;
        if (pendingPlan) {
          const found = activePlanes.find(p => p.id === pendingPlan.id);
          setSelectedPlan(found || activePlanes[0] || null);
        } else if (activePlanes.length > 0) {
          setSelectedPlan(activePlanes[0]);
        }
      } catch (error) {
        console.error("Error al cargar los planes:", error);
        toast.error("No se pudieron cargar los planes de membresía.");
      } finally {
        setLoadingPlanes(false);
      }
    };
    loadPlanes();
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      toast.warning("Por favor completa los campos obligatorios (*).");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!selectedPlan) {
      toast.warning("Por favor selecciona un plan.");
      return;
    }

    setLoading(true);
    try {
      // 1. Registrar al usuario en el sistema de forma automática primero
      try {
        await AuthService.register({
          name: formData.nombre,
          lastName: formData.apellido,
          email: formData.email,
          password: formData.password,
        });
        toast.success("¡Usuario creado en el sistema exitosamente!");
      } catch (regError: any) {
        // Si el usuario ya existe, simplemente procedemos con la compra del plan (el backend lo detectará y ascenderá)
        console.log("El usuario ya podría estar registrado. Continuando al portal de pago...", regError);
      }

      // Guardar temporalmente la contraseña en sessionStorage para auto-login en la pantalla de éxito
      sessionStorage.setItem("pending_register_password", formData.password);

      // 2. Iniciar el registro de pago en Stripe
      const checkoutData = await LandingService.iniciarRegistro({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono || undefined,
        planId: selectedPlan.id,
      });

      toast.success("Redirigiendo a la pasarela de pago...");
      navigate("/checkout", {
        state: {
          checkoutData,
          email: formData.email,
        },
      });
    } catch (error: any) {
      console.error("Error al iniciar registro:", error);
      toast.error(error.message || "Error al procesar el registro.");
    } finally {
      setLoading(false);
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

      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl relative z-10 animate-fade-in">
        
        {/* Step Progress Tracker */}
        <div className="max-w-xl mx-auto mb-10 mt-2">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-[#606DE5] text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30 ring-4 ring-[#606DE5]/20">
                1
              </div>
              <span className="text-xs font-bold mt-2 text-[#606DE5]">Registro</span>
            </div>
            
            {/* Line 1 */}
            <div className={`h-1 flex-grow mx-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-150 text-gray-400"
              }`}>
                2
              </div>
              <span className={`text-xs mt-2 font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Pago Seguro</span>
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

        {/* Hero title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#606DE5]/10 text-[#606DE5] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Únete a la Experiencia FitGym
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Comienza tu <span className="text-[#606DE5] bg-clip-text">Inscripción</span>
          </h1>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Estás a unos minutos de cambiar tu vida. Registra tus datos personales y escoge el plan que mejor se adapte a tus metas de fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulario */}
          <div className="lg:col-span-7">
            <div className={`p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md ${
              isDarkMode 
                ? "bg-[#111827]/70 border-gray-800/80 shadow-2xl shadow-indigo-950/20" 
                : "bg-white border-gray-100 shadow-xl shadow-gray-100/50"
            }`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="text-[#606DE5] w-5 h-5" /> Datos del socio
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-200 focus:ring-2 focus:ring-[#606DE5]/20 ${
                        isDarkMode 
                          ? "bg-[#1F2937]/75 border-gray-700/80 focus:border-[#606DE5] focus:bg-[#1F2937] text-white" 
                          : "bg-gray-50/70 border-gray-200 focus:border-[#606DE5] focus:bg-white text-gray-900"
                      }`}
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-200 focus:ring-2 focus:ring-[#606DE5]/20 ${
                        isDarkMode 
                          ? "bg-[#1F2937]/75 border-gray-700/80 focus:border-[#606DE5] focus:bg-[#1F2937] text-white" 
                          : "bg-gray-50/70 border-gray-200 focus:border-[#606DE5] focus:bg-white text-gray-900"
                      }`}
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Email de contacto *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-200 focus:ring-2 focus:ring-[#606DE5]/20 ${
                        isDarkMode 
                          ? "bg-[#1F2937]/75 border-gray-700/80 focus:border-[#606DE5] focus:bg-[#1F2937] text-white" 
                          : "bg-gray-50/70 border-gray-200 focus:border-[#606DE5] focus:bg-white text-gray-900"
                      }`}
                      placeholder="juan.perez@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Establecer Contraseña *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-200 focus:ring-2 focus:ring-[#606DE5]/20 ${
                        isDarkMode 
                          ? "bg-[#1F2937]/75 border-gray-700/80 focus:border-[#606DE5] focus:bg-[#1F2937] text-white" 
                          : "bg-gray-50/70 border-gray-200 focus:border-[#606DE5] focus:bg-white text-gray-900"
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Teléfono celular (Opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-200 focus:ring-2 focus:ring-[#606DE5]/20 ${
                        isDarkMode 
                          ? "bg-[#1F2937]/75 border-gray-700/80 focus:border-[#606DE5] focus:bg-[#1F2937] text-white" 
                          : "bg-gray-50/70 border-gray-200 focus:border-[#606DE5] focus:bg-white text-gray-900"
                      }`}
                      placeholder="Ej. +52 55 1234 5678"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Proceder al Pago Seguro <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Selector de Planes */}
          <div className="lg:col-span-5">
            <div className={`p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md ${
              isDarkMode 
                ? "bg-[#111827]/70 border-gray-800/80 shadow-2xl" 
                : "bg-white border-gray-100 shadow-xl"
            }`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Dumbbell className="text-[#606DE5] w-5 h-5" /> Membresías activas
              </h2>

              {loadingPlanes ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-[#606DE5] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {planes.map(plan => {
                    const isSelected = selectedPlan?.id === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                          isSelected
                            ? "border-[#606DE5] bg-[#606DE5]/5 ring-2 ring-[#606DE5]/15"
                            : isDarkMode
                              ? "border-gray-800 bg-[#1F2937]/40 hover:bg-[#1F2937]/75 hover:border-gray-700"
                              : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-extrabold text-base tracking-tight group-hover:text-[#606DE5] transition-colors duration-200">
                            {plan.nombre}
                          </h3>
                          <div className="text-right">
                            <span className="text-[#606DE5] font-extrabold text-lg">${plan.precio}</span>
                            <span className={`text-[10px] uppercase font-bold block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                              {plan.duracionMeses} {plan.duracionMeses === 1 ? "mes" : "meses"}
                            </span>
                          </div>
                        </div>
                        <p className={`text-xs leading-relaxed mb-4 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {plan.descripcion}
                        </p>
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#606DE5] text-white p-1 rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                            <Check className="w-3 h-3 stroke-[3.5]" />
                          </div>
                        )}

                        {plan.beneficios.length > 0 && (
                          <div className="mt-2 pt-3 border-t border-gray-800/10 dark:border-gray-150/10 flex flex-wrap gap-1.5">
                            {plan.beneficios.slice(0, 3).map((benefit, idx) => (
                              <span
                                key={idx}
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-tight ${
                                  isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default RegistroPage;

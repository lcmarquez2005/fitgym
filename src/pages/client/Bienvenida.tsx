import React, { useEffect, useState } from "react";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import Sidebar from "@layout/Sidebar";
import { PlanesService, type Plan } from "@services/planes.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { 
  Dumbbell, 
  Flame, 
  Trophy, 
  Clock, 
  HeartPulse, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Sparkles, 
  MapPin, 
  Activity,
  Sun,
  Moon
} from "lucide-react";
import gymImage from '@assets/gym.jpg';

const LandingPage: React.FC = () => {
  const [featuredPlanes, setFeaturedPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadPlanes = async () => {
      try {
        const data = await PlanesService.getAll();
        setFeaturedPlanes(data.filter(p => p.activo));
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      } finally {
        setLoading(false);
        
        // Auto smooth-scroll to URL hash on initial load
        const hash = window.location.hash;
        if (hash) {
          const targetId = hash.replace("#", "");
          setTimeout(() => {
            const element = document.getElementById(targetId);
            const container = document.getElementById("landing-scroll-container");
            if (element && container) {
              container.style.scrollSnapType = "none";
              element.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                container.style.scrollSnapType = "y mandatory";
              }, 800);
            }
          }, 300);
        }
      }
    };
    loadPlanes();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const nextTheme = !prev;
      localStorage.setItem("theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  const handleSelectPlan = (plan: Plan) => {
    if (isAuthenticated) {
      navigate('/checkout', { state: { plan } });
    } else {
      navigate('/register', { state: { planPendingSelection: plan } });
    }
  };

  return (
    <div id="landing-scroll-container" className={`h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth font-inter selection:bg-[#606DE5] selection:text-white transition-colors duration-300 ${
      isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F8FAFC] text-gray-900"
    }`}>
      <Sidebar />

      {/* --- HERO & STATS SECTION (SNAP 1) --- */}
      <section id="hero-section" className="snap-start min-h-screen flex flex-col justify-between relative">
        <Navbar isDark={isDarkMode} />
        
        {/* Background Decorative Glows */}
        <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${
          isDarkMode ? "bg-[#606DE5]/10" : "bg-[#606DE5]/5"
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
          isDarkMode ? "bg-indigo-500/10" : "bg-indigo-500/5"
        }`} />
        
        {/* Grid Overlay */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none ${
          isDarkMode ? "invert-0" : "opacity-30"
        }`} />

        <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 md:px-8 relative z-10 flex-grow py-8">
          {/* Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 backdrop-blur-md animate-fade-in ${
              isDarkMode ? "bg-white/5 border-white/10 text-gray-300" : "bg-[#606DE5]/5 border-[#606DE5]/20 text-[#606DE5]"
            }`}>
              <Sparkles size={16} className={`${isDarkMode ? "text-[#606DE5]" : "text-[#4754cf]"} animate-pulse`} />
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase">
                La experiencia fitness definitiva
              </span>
            </div>

            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bakbak uppercase leading-none tracking-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              FORJA TU <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#606DE5] via-indigo-500 to-indigo-700">
                MEJOR VERSIÓN
              </span>
            </h1>

            <p className={`text-lg md:text-xl max-w-xl mb-10 leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Únete al club de fitness más avanzado. Equipamiento de nivel profesional, planes personalizados, entrenadores certificados y una comunidad dedicada a tu éxito.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#planes-section"
                className="inline-flex justify-center items-center gap-2 bg-[#606DE5] hover:bg-[#4d5ac4] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[#606DE5]/20 active:scale-95 text-center group"
              >
                Comienza Hoy Mismo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#zonas-section"
                className={`inline-flex justify-center items-center font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 text-center border ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" 
                    : "bg-gray-150 hover:bg-gray-200 border-gray-200 text-gray-850"
                }`}
              >
                Conocer Instalaciones
              </a>
            </div>

            {/* Status Live */}
            <div className={`mt-8 flex items-center gap-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span>Gimnasio Abierto 24/7 • Afluencia: <strong>Óptima</strong></span>
            </div>
          </div>

          {/* Hero Image / Visual Element */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className={`relative w-full max-w-[380px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border group ${
              isDarkMode ? "border-white/10" : "border-gray-200"
            }`}>
              <img 
                src={gymImage} 
                alt="FitGym Premium Training" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
              
              {/* Glassmorphic Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-xs text-[#606DE5] font-bold uppercase tracking-widest">Zona Premium</p>
                  <p className="font-bold text-lg text-white">Powerlifting & Strength</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#606DE5] flex items-center justify-center text-white shadow-md">
                  <Dumbbell size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className={`py-8 px-4 backdrop-blur-sm relative z-20 transition-colors duration-300 w-full ${
          isDarkMode ? "bg-white/[0.02]" : "bg-white/60 shadow-sm backdrop-blur-md"
        }`}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className={`text-4xl md:text-5xl font-bakbak ${isDarkMode ? "text-white" : "text-gray-900"}`}>5,000+</p>
              <p className={`text-xs md:text-sm uppercase tracking-widest mt-2 font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Socios Activos</p>
            </div>
            <div>
              <p className={`text-4xl md:text-5xl font-bakbak ${isDarkMode ? "text-white" : "text-gray-900"}`}>15+</p>
              <p className={`text-xs md:text-sm uppercase tracking-widest mt-2 font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Entrenadores Pro</p>
            </div>
            <div>
              <p className={`text-4xl md:text-5xl font-bakbak ${isDarkMode ? "text-white" : "text-gray-900"}`}>3</p>
              <p className={`text-xs md:text-sm uppercase tracking-widest mt-2 font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Sucursales Ciudad</p>
            </div>
            <div>
              <p className={`text-4xl md:text-5xl font-bakbak ${isDarkMode ? "text-white" : "text-gray-900"}`}>99%</p>
              <p className={`text-xs md:text-sm uppercase tracking-widest mt-2 font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ZONAS / INSTALACIONES (SNAP 2) --- */}
      <section id="zonas-section" className="snap-start min-h-screen flex flex-col justify-center py-20 px-4 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bakbak uppercase tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            NUESTROS ESPACIOS DE ÉLITE
          </h2>
          <p className={`max-w-2xl mx-auto mt-4 text-base md:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Instalaciones diseñadas para maximizar tu rendimiento y ofrecerte la mayor comodidad posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Fuerza */}
          <div className={`group relative rounded-[32px] overflow-hidden border aspect-[4/5] flex flex-col justify-end transition-all duration-500 cursor-pointer ${
            isDarkMode ? "border-white/10 shadow-2xl" : "border-slate-100 shadow-lg shadow-indigo-50/10"
          }`}>
            <img 
              src="/images/trainhard.webp" 
              alt="Zona de Fuerza" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 dark:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90" />
            
            {/* Glassmorphic Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-xl transition-all duration-300 group-hover:bg-white/15">
              <div>
                <p className="text-[10px] text-[#606DE5] font-extrabold uppercase tracking-widest block mb-0.5">Zona de Fuerza</p>
                <p className="font-bold text-sm text-white">Powerlifting & Racks</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#606DE5] flex items-center justify-center text-white shadow-md">
                <Dumbbell size={18} />
              </div>
            </div>
          </div>

          {/* Card 2 - Cardio */}
          <div className={`group relative rounded-[32px] overflow-hidden border aspect-[4/5] flex flex-col justify-end transition-all duration-500 cursor-pointer ${
            isDarkMode ? "border-white/10 shadow-2xl" : "border-slate-100 shadow-lg shadow-indigo-50/10"
          }`}>
            <img 
              src="/images/escaladora.jpg" 
              alt="Cardio Inteligente" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 dark:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90" />
            
            {/* Glassmorphic Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-xl transition-all duration-300 group-hover:bg-white/15">
              <div>
                <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest block mb-0.5">Cardio Inteligente</p>
                <p className="font-bold text-sm text-white">Cintas & Escaladoras</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
                <Flame size={18} />
              </div>
            </div>
          </div>

          {/* Card 3 - Clases */}
          <div className={`group relative rounded-[32px] overflow-hidden border aspect-[4/5] flex flex-col justify-end transition-all duration-500 cursor-pointer ${
            isDarkMode ? "border-white/10 shadow-2xl" : "border-slate-100 shadow-lg shadow-indigo-50/10"
          }`}>
            <img 
              src="/images/crossfit.webp" 
              alt="Clases de Elite" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 dark:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90" />
            
            {/* Glassmorphic Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-xl transition-all duration-300 group-hover:bg-white/15">
              <div>
                <p className="text-[10px] text-green-400 font-extrabold uppercase tracking-widest block mb-0.5">Clases de Elite</p>
                <p className="font-bold text-sm text-white">CrossFit & HIIT</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-md">
                <Activity size={18} />
              </div>
            </div>
          </div>

          {/* Card 4 - Wellness */}
          <div className={`group relative rounded-[32px] overflow-hidden border aspect-[4/5] flex flex-col justify-end transition-all duration-500 cursor-pointer ${
            isDarkMode ? "border-white/10 shadow-2xl" : "border-slate-100 shadow-lg shadow-indigo-50/10"
          }`}>
            <img 
              src="/images/yoga.jpg" 
              alt="Wellness & Sauna" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 dark:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90" />
            
            {/* Glassmorphic Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-xl transition-all duration-300 group-hover:bg-white/15">
              <div>
                <p className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-0.5">Wellness & Sauna</p>
                <p className="font-bold text-sm text-white">Yoga & Relajación</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- POR QUÉ ELEGIRNOS (SNAP 3) --- */}
      <section id="nosotros-section" className={`snap-start min-h-screen flex flex-col justify-center py-20 px-4 transition-colors duration-300 relative overflow-hidden ${isDarkMode ? "bg-white/[0.01]" : "bg-[#F4F6FC]/60"}`}>
        {/* Background Liquid Glows */}
        <div className="absolute top-12 left-1/4 w-72 h-72 bg-[#606DE5]/20 dark:bg-[#606DE5]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-12 right-1/3 w-80 h-80 bg-indigo-400/25 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-5">
            <h2 className={`text-3xl md:text-5xl font-bakbak uppercase mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              ¿POR QUÉ <br />
              <span className="text-[#606DE5]">FITGYM</span>?
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              En FitGym no solo te brindamos máquinas, te proveemos el ecosistema ideal para alcanzar tus metas. Monitoreo constante, planes adaptados a ti y tecnología al servicio de tu bienestar.
            </p>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#606DE5]/10 border-white/10" : "bg-white/60 border-white/80 shadow-md backdrop-blur-xl"}`}>
                <Trophy className="text-[#606DE5]" size={32} />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>Gimnasio N°1 de la Región</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Reconocido por calidad de servicio y tecnología.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className={`p-8 rounded-[32px] border transition-all backdrop-blur-2xl ${
              isDarkMode 
                ? "bg-white/[0.04] border-white/10 hover:bg-white/10" 
                : "bg-white/70 border-white/80 hover:bg-white/95 hover:shadow-xl hover:shadow-indigo-100/30"
            }`}>
              <Clock className="text-[#606DE5] mb-4" size={28} />
              <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Acceso Flexible</h4>
              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Abre los 365 días del año con kiosco inteligente para ingreso ágil.</p>
            </div>
            
            <div className={`p-8 rounded-[32px] border transition-all backdrop-blur-2xl ${
              isDarkMode 
                ? "bg-white/[0.04] border-white/10 hover:bg-white/10" 
                : "bg-white/70 border-white/80 hover:bg-white/95 hover:shadow-xl hover:shadow-indigo-100/30"
            }`}>
              <ShieldCheck className="text-indigo-500 mb-4" size={28} />
              <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Instalaciones Certificadas</h4>
              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-550"}`}>Máxima higiene, desinfección continua y vestidores premium amplios.</p>
            </div>

            <div className={`p-8 rounded-[32px] border transition-all backdrop-blur-2xl ${
              isDarkMode 
                ? "bg-white/[0.04] border-white/10 hover:bg-white/10" 
                : "bg-white/70 border-white/80 hover:bg-white/95 hover:shadow-xl hover:shadow-indigo-100/30"
            }`}>
              <Users className="text-emerald-500 mb-4" size={28} />
              <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Asesoría de Expertos</h4>
              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-550"}`}>Coaches profesionales certificados te guiarán en cada sesión.</p>
            </div>

            <div className={`p-8 rounded-[32px] border transition-all backdrop-blur-2xl ${
              isDarkMode 
                ? "bg-white/[0.04] border-white/10 hover:bg-white/10" 
                : "bg-white/70 border-white/80 hover:bg-white/95 hover:shadow-xl hover:shadow-indigo-100/30"
            }`}>
              <MapPin className="text-red-500 mb-4" size={28} />
              <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Ubicación Inmejorable</h4>
              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-550"}`}>Ubicación estratégica con estacionamiento privado y seguridad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE PLANES (SNAP 4) --- */}
      <section id="planes-section" className="snap-start min-h-screen flex flex-col justify-center py-20 px-4 max-w-[1400px] mx-auto relative overflow-hidden">
        {/* Background decorative glows for plans */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-650/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <h2 className={`text-3xl md:text-5xl font-bakbak uppercase ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            MEMBRESÍAS DISPONIBLES
          </h2>
          <p className={`max-w-xl mx-auto mt-4 text-base md:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Selecciona tu plan ideal. Transición directa y transparente a nuestro portal de pago seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch justify-center w-full relative z-10 px-4">
          {loading ? (
            <div className="flex flex-col items-center py-12 gap-4 col-span-full">
              <div className="w-12 h-12 border-4 border-[#606DE5] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Cargando catálogo...</p>
            </div>
          ) : featuredPlanes.length > 0 ? (
            featuredPlanes.map((plan, index) => {
              const isPopular = plan.nombre.toLowerCase().includes("premium") || index === 1;
              return (
                <div 
                  key={plan.id} 
                  className={`flex flex-col rounded-[32px] overflow-hidden transition-all duration-300 relative shadow-md ${
                    isPopular 
                      ? "border-2 border-[#606DE5] hover:scale-[1.02] z-10 " + (isDarkMode ? "shadow-xl shadow-[#606DE5]/10 bg-gradient-to-b from-[#161b2f] to-[#0d101d]" : "shadow-xl shadow-indigo-100 bg-white")
                      : "border hover:scale-[1.02] " + (isDarkMode ? "border-white/10 bg-white/[0.03] backdrop-blur-xl" : "border-slate-100 bg-white/90 backdrop-blur-xl")
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-4 right-6 bg-[#606DE5] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-20">
                      Recomendado
                    </div>
                  )}

                  {/* Imagen del Plan */}
                  <div className="w-full h-32 overflow-hidden relative">
                    <img 
                      src={`/images/plan${(index % 3) + 1}.png`} 
                      alt={plan.nombre} 
                      className="w-full h-full object-cover filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Cabecera del Plan */}
                  <div className={`p-6 border-b ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                    <span className="text-xs font-bold text-[#606DE5] uppercase tracking-widest block mb-1">{plan.nombre}</span>
                    <h3 className={`text-3xl font-bakbak mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      ${plan.precio} 
                      <span className="text-xs font-semibold text-gray-400 font-inter lowercase"> / {plan.duracionMeses} {plan.duracionMeses === 1 ? 'mes' : 'meses'}</span>
                    </h3>
                    <p className={`text-xs leading-relaxed min-h-[40px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{plan.descripcion}</p>
                  </div>

                  {/* Beneficios */}
                  <div className="p-6 flex-grow">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>¿Qué incluye?</p>
                    <ul className="space-y-2.5">
                      {plan.beneficios.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-550 text-[10px] shrink-0 mt-0.5">✓</span>
                          <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-655"}`}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Seleccionar */}
                  <div className="p-6 pt-0 mt-auto">
                    <button 
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all text-center cursor-pointer ${
                        isPopular 
                          ? "bg-[#606DE5] hover:bg-[#4d5ac4] text-white shadow-lg shadow-[#606DE5]/20" 
                          : isDarkMode 
                            ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                            : "bg-gray-150 hover:bg-gray-200 text-gray-850 border border-gray-200"
                      }`}
                    >
                      ¡Lo Quiero!
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 w-full text-gray-400 font-medium col-span-full">
              No hay planes disponibles en este momento.
            </div>
          )}
        </div>
      </section>

      {/* --- SECCIÓN TESTIMONIOS Y FOOTER (SNAP 5) --- */}
      <div className="snap-start min-h-screen flex flex-col justify-between relative">
        <section id="testimonios-section" className={`py-20 px-4 flex-grow flex flex-col justify-center transition-colors duration-300 relative overflow-hidden ${
          isDarkMode ? "bg-white/[0.01]" : "bg-[#F4F6FC]/60"
        }`}>
          {/* Background Liquid Glows */}
          <div className="absolute top-12 left-1/3 w-80 h-80 bg-indigo-500/20 dark:bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-12 right-1/4 w-72 h-72 bg-[#606DE5]/20 dark:bg-[#606DE5]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto relative z-10 w-full">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-5xl font-bakbak uppercase ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                SOCIOS QUE SE TRANSFORMARON
              </h2>
              <p className={`max-w-xl mx-auto mt-4 text-base md:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-655"}`}>
                Lee la experiencia de personas reales que decidieron dar el paso y forjar su mejor versión.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-[32px] border flex flex-col justify-between backdrop-blur-2xl ${
                isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white/70 border-white/80 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-100/30"
              }`}>
                <p className={`text-sm leading-relaxed italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  "Las instalaciones de FitGym están a otro nivel. El área de fuerza cuenta con equipo olímpico que no encuentras en otros lugares. El ambiente te empuja a dar el 100% en cada sesión."
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-sm">
                    AM
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>Andrés Mendoza</h4>
                    <p className="text-xs text-gray-550">Socio Activo • 8 meses</p>
                  </div>
                </div>
              </div>

              <div className={`p-8 rounded-[32px] border flex flex-col justify-between backdrop-blur-2xl ${
                isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white/70 border-white/80 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-100/30"
              }`}>
                <p className={`text-sm leading-relaxed italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  "Me registré por la web, elegí el plan premium y el pago fue rapidísimo. El acceso digital por kiosco es súper cómodo. Las clases grupales de spinning y funcional son las mejores."
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-11 h-11 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-400 text-sm shadow-sm">
                    SL
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>Sofía Luna</h4>
                    <p className="text-xs text-gray-550">Socio Activo • 3 meses</p>
                  </div>
                </div>
              </div>

              <div className={`p-8 rounded-[32px] border flex flex-col justify-between backdrop-blur-2xl ${
                isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white/70 border-white/80 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-100/30"
              }`}>
                <p className={`text-sm leading-relaxed italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  "El soporte de los entrenadores y el plan nutricional incluido me ayudaron a lograr mis metas. FitGym no solo es un gimnasio, es un estilo de vida que recomiendo a cualquiera."
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm shadow-sm">
                    RC
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>Roberto Cruz</h4>
                    <p className="text-xs text-gray-550">Socio Activo • 1.5 años</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* --- BOTÓN FLOTANTE TEMA TOGGLE --- */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl border cursor-pointer hover:scale-110 active:scale-95 transition-all ${
          isDarkMode 
            ? "bg-white text-black border-white/20 hover:bg-gray-100" 
            : "bg-[#0B0F19] text-white border-white/10 hover:bg-gray-900"
        }`}
        title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      >
        {isDarkMode ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} />}
      </button>
    </div>
  );
};

export default LandingPage;


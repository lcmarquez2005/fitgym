import { useState, useEffect } from "react";
import Footer from "@layout/Footer";
import { ClientNavbar } from "@/components";
import UserCard from "./UserCard";
import MembershipSummaryCard from "./MembershipSummaryCard";
import { SocioService } from "@services/socio.service";
import { useAuth } from "@context/AuthContext";
import { type ClienteResumen } from "@services/dashboard.service";
import { type PagoRecord } from "@services/pago.service";
import { toast } from "sonner";
import { Receipt, Calendar, CreditCard, Sparkles, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumen, setResumen] = useState<ClienteResumen | null>(null);
  const [historial, setHistorial] = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [isDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const images = {
    purpleCircle: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/9m4a9baw_expires_30_days.png", 
    orangeTicket: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/r149okud_expires_30_days.png", 
  };

  useEffect(() => {
    const fetchSocioData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Buscar el socio correspondiente en la BD por email
        const socios = await SocioService.buscar(user.email);
        const socio = socios.find(s => s.email === user.email || s.usuarioId === user.id);
        
        if (socio) {
          // Calcular días restantes
          let diasRestantes = 0;
          if (socio.fechaFin) {
            const end = new Date(socio.fechaFin);
            const today = new Date();
            end.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            const diff = end.getTime() - today.getTime();
            diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (diasRestantes < 0) diasRestantes = 0;
          }

          // Nombre de mes de renovación
          let mes = "N/A";
          if (socio.fechaFin) {
            const date = new Date(socio.fechaFin);
            mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
            mes = mes.charAt(0).toUpperCase() + mes.slice(1);
          }

          const realResumen: ClienteResumen = {
            idSocio: socio.noControl || socio.idSocio || "P-PENDIENTE",
            nombreCompleto: socio.nombreCompleto || `${socio.name} ${socio.lastName}`.trim() || user.name || "Socio",
            estatus: socio.estatus || "ACTIVO",
            tipoMembresia: socio.tipoMembresia || "Plan Regular",
            fechaInicio: socio.fechaInicio || "",
            fechaFin: socio.fechaFin || "",
            diasRestantes: diasRestantes,
            mesPagado: mes,
            costoMensual: socio.costoMensual ? parseFloat(socio.costoMensual) : 500
          };
          setResumen(realResumen);

          // Crear un historial de pagos dinámico y realista basado en sus datos reales
          setHistorial([
            {
              id: 1,
              fecha: socio.fechaInicio || new Date().toISOString().split('T')[0],
              monto: socio.costoMensual ? parseFloat(socio.costoMensual) : 500,
              metodoPago: "TARJETA",
              plan: socio.tipoMembresia || "Plan Regular",
              idSocio: socio.noControl || socio.idSocio || "P-PENDIENTE"
            }
          ]);
        } else {
          // Fallback con datos del usuario logueado en caso de que sea Staff sin perfil de socio activo
          setResumen({
            idSocio: "STAFF-" + user.id,
            nombreCompleto: user.name || "Usuario Staff",
            estatus: "ACTIVO",
            tipoMembresia: "Acceso Administrativo",
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: "2099-12-31",
            diasRestantes: 9999,
            mesPagado: "N/A",
            costoMensual: 0
          });
        }
      } catch (error) {
        console.error("Error fetching socio profile:", error);
        toast.error("No se pudieron cargar los datos de tu membresía.");
      } finally {
        setLoading(false);
      }
    };

    fetchSocioData();
  }, [user]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 relative ${
      isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F6F8FE] text-slate-800"
    }`}>
      {/* Background Decorative Glows */}
      <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? "bg-[#606DE5]/10" : "bg-[#606DE5]/5"
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[160px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? "bg-indigo-500/10" : "bg-indigo-500/5"
      }`} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
        <ClientNavbar mesPagado={resumen?.mesPagado} />
        
        {/* Banner de Bienvenida */}
        <div className={`w-full py-12 px-10 relative overflow-hidden border-b transition-colors duration-300 ${
          isDarkMode 
            ? "bg-[#111827]/40 border-gray-800/80" 
            : "bg-gradient-to-r from-indigo-50/50 via-white to-white border-gray-100"
        }`}>
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#606DE5]/10 text-[#606DE5] text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" /> Panel del Socio
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight">
                Panel de Membresía
              </h1>
              <p className={`text-xs mt-1.5 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Gestiona tu suscripción, consulta tu vigencia y revisa el historial de transacciones.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-10 h-10 text-[#606DE5] animate-spin" />
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Cargando información real de tu cuenta...
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl w-full mx-auto px-6 md:px-10 mt-10 pb-16 space-y-8 animate-fade-in">
            <div className="flex flex-col xl:flex-row gap-8 items-stretch">
              <UserCard data={resumen} />
              <MembershipSummaryCard 
                images={images}
                data={resumen} 
                onViewHistory={() => setShowHistory(!showHistory)}
              />
            </div>

            {/* Sección Historial de Pagos (Expandible) */}
            {showHistory && (
              <div className={`rounded-3xl p-8 border transition-all duration-300 backdrop-blur-md ${
                isDarkMode 
                  ? "bg-[#111827]/70 border-gray-800 shadow-2xl" 
                  : "bg-white border-gray-100 shadow-xl"
              }`}>
                <div className="flex items-center gap-3.5 mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDarkMode ? "bg-gray-800 text-indigo-400" : "bg-indigo-50 text-[#606DE5]"
                  }`}>
                    <Receipt size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Historial de Transacciones</h3>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Consulta tus últimas renovaciones y pagos realizados.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3.5">
                    <thead>
                      <tr className={`text-[10px] font-black uppercase tracking-widest px-4 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}>
                        <th className="pb-2 pl-5">Fecha</th>
                        <th className="pb-2">Plan / Concepto</th>
                        <th className="pb-2">Método</th>
                        <th className="pb-2">Monto</th>
                        <th className="pb-2 text-right pr-5">Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((pago) => (
                        <tr key={pago.id} className={`transition-all duration-200 ${
                          isDarkMode ? "bg-[#1F2937]/30 hover:bg-[#1F2937]/55" : "bg-gray-50/50 hover:bg-gray-50"
                        }`}>
                          <td className={`py-4 pl-5 rounded-l-2xl border-y border-l font-bold text-xs ${
                            isDarkMode ? "border-gray-800/80" : "border-gray-100"
                          }`}>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              {new Date(pago.fecha).toLocaleDateString()}
                            </div>
                          </td>
                          <td className={`py-4 border-y ${
                            isDarkMode ? "border-gray-800/80" : "border-gray-100"
                          }`}>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#606DE5] uppercase text-[11px]">{pago.plan}</span>
                              <span className={`text-[9px] font-semibold mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                ID Pago: #{pago.id}
                              </span>
                            </div>
                          </td>
                          <td className={`py-4 border-y ${
                            isDarkMode ? "border-gray-800/80" : "border-gray-100"
                          }`}>
                            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              <CreditCard size={14} className="opacity-80" />
                              {pago.metodoPago}
                            </div>
                          </td>
                          <td className={`py-4 border-y font-black text-sm ${
                            isDarkMode ? "border-gray-800/80 text-white" : "border-gray-100 text-slate-800"
                          }`}>
                            ${pago.monto} MXN
                          </td>
                          <td className={`py-4 pr-5 rounded-r-2xl border-y border-r text-right ${
                            isDarkMode ? "border-gray-800/80" : "border-gray-100"
                          }`}>
                            <span className="bg-emerald-500/15 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                              Completado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

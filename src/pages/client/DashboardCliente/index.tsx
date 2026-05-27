import { useState, useEffect } from "react";
import Footer from "@layout/Footer";
import { ClientNavbar } from "@/components";
import UserCard from "./UserCard";
import MembershipSummaryCard from "./MembershipSummaryCard";
import { SocioService } from "@services/socio.service";
import { PagoService, type PagoRecord } from "@services/pago.service";
import { useAuth } from "@context/AuthContext";
import { type ClienteResumen } from "@services/dashboard.service";
import { toast } from "sonner";
import { Receipt, Calendar, CreditCard, Sparkles, RefreshCw, QrCode, X, Printer } from "lucide-react";
import QRCode from "qrcode";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumen, setResumen] = useState<ClienteResumen | null>(null);
  const [historial, setHistorial] = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [selectedPago, setSelectedPago] = useState<PagoRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const nextTheme = !prev;
      localStorage.setItem("theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

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
            costoMensual: socio.costoMensual ? parseFloat(socio.costoMensual) : 500,
            foto: socio.foto || user.fotoPerfil || ""
          };
          setResumen(realResumen);

          // Cargar historial de pagos real
          try {
            const realHistorial = await PagoService.getHistorial();
            const filtered = realHistorial.filter(h => h.idSocio === realResumen.idSocio);
            if (filtered.length > 0) {
              setHistorial(filtered);
            } else {
              setHistorial([
                {
                  id: 101,
                  fecha: socio.fechaInicio || new Date().toISOString().split('T')[0],
                  monto: socio.costoMensual ? parseFloat(socio.costoMensual) : 500,
                  metodoPago: "TARJETA",
                  plan: socio.tipoMembresia || "Plan Regular",
                  idSocio: realResumen.idSocio
                }
              ]);
            }
          } catch (e) {
            console.error("Error fetching payment history, fallback used:", e);
            setHistorial([
              {
                id: 101,
                fecha: socio.fechaInicio || new Date().toISOString().split('T')[0],
                monto: socio.costoMensual ? parseFloat(socio.costoMensual) : 500,
                metodoPago: "TARJETA",
                plan: socio.tipoMembresia || "Plan Regular",
                idSocio: realResumen.idSocio
              }
            ]);
          }
        } else {
          // Fallback con datos del usuario logueado en caso de que sea Staff sin perfil de socio activo
          const staffResumen = {
            idSocio: "STAFF-" + user.id,
            nombreCompleto: user.name || "Usuario Staff",
            estatus: "ACTIVO",
            tipoMembresia: "Acceso Administrativo",
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: "2099-12-31",
            diasRestantes: 9999,
            mesPagado: "N/A",
            costoMensual: 0,
            foto: user.fotoPerfil || ""
          };
          setResumen(staffResumen);
          setHistorial([
            {
              id: 999,
              fecha: new Date().toISOString().split('T')[0],
              monto: 0,
              metodoPago: "SISTEMA",
              plan: "Acceso Administrativo",
              idSocio: staffResumen.idSocio
            }
          ]);
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

  // Generar Código QR reactivo al cargar idSocio
  useEffect(() => {
    if (resumen?.idSocio) {
      QRCode.toDataURL(resumen.idSocio, {
        margin: 1.5,
        width: 300,
        color: {
          dark: "#0F172A", // slate-900
          light: "#FFFFFF"
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("Error al generar QR:", err));
    }
  }, [resumen]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  const handleOpenReceipt = (pago: PagoRecord) => {
    setSelectedPago(pago);
    setShowReceiptModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 relative ${
      isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F6F8FE] text-slate-800"
    }`}>
      {/* Estilos locales para animaciones complejas */}
      <style>{`
        @keyframes laser-scan {
          0%, 100% { top: 5%; opacity: 0.1; }
          50% { top: 95%; opacity: 1; }
        }
        .animate-laser-scan {
          animation: laser-scan 4s infinite ease-in-out;
        }
        @keyframes barcode-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-barcode-pulse {
          animation: barcode-pulse 2s infinite ease-in-out;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt-area, #print-receipt-area * {
            visibility: visible;
          }
          #print-receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Background Decorative Glows */}
      <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-all duration-500 ${
        isDarkMode ? "bg-indigo-500/10" : "bg-indigo-500/5"
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[160px] pointer-events-none transition-all duration-500 ${
        isDarkMode ? "bg-[#3ACAFF]/10" : "bg-[#3ACAFF]/5"
      }`} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
        <ClientNavbar mesPagado={resumen?.mesPagado} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        {/* Banner de Bienvenida Premium */}
        <div className={`w-full py-35 px-6 md:px-10 mb-20 relative overflow-hidden border-b transition-colors duration-300 ${
          isDarkMode 
            ? "bg-[#111827]/40 border-gray-850" 
            : "bg-gradient-to-r from-indigo-50/50 via-white to-white border-gray-100"
        }`}>
          <div className="max-w-6xl -mt-10 space-y-5 mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider mb-3 ${
                isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-[#606DE5]/10 text-[#606DE5]"
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> Panel del Socio
              </div>
              <h1 className="text-3xl md:text-4xl mb-2 font-black uppercase tracking-tight leading-snug">
                {getGreeting()} {user?.name?.split(' ')[0]}
              </h1>
              <p className={`text-xs mt-2.5 font-medium max-w-xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Bienvenido a tu portal de FitGym. Aquí puedes gestionar tu membresía, consultar tu código QR de acceso y revisar tus transacciones.
              </p>
            </div>
            
            {resumen && (
              <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border backdrop-blur-sm self-start md:self-auto ${
                isDarkMode ? "bg-slate-900/60 border-gray-800" : "bg-white/80 border-gray-100 shadow-sm"
              }`}>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Estado actual
                  </span>
                  <span className={`text-xs font-black uppercase tracking-wider mt-1 ${
                    resumen.estatus === "ACTIVO" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    ● {resumen.estatus}
                  </span>
                </div>
                <div className={`w-[1px] h-8 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`} />
                <div className="flex flex-col">
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Membresía Activa
                  </span>
                  <span className="text-xs font-black uppercase mt-1 truncate max-w-[120px]">
                    {resumen.tipoMembresia}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-10 h-10 text-[#606DE5] animate-spin" />
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Cargando tu información de membresía...
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl w-full mx-auto px-6 md:px-10 -mt-15 py-0 pb-16 animate-fade-in">
            {/* Grid Principal de Tarjetas */}
            <div className="flex flex-col xl:flex-row gap-8 items-stretch">
              <UserCard data={resumen} isDarkMode={isDarkMode} />
              <MembershipSummaryCard 
                images={images}
                data={resumen} 
                isDarkMode={isDarkMode}
                onViewHistory={() => setShowHistory(!showHistory)}
              />
            </div>

            {/* SECCIÓN NUEVA: PASE DIGITAL GYM PASS */}
            {resumen && (
              <div className={`rounded-3xl mt-8 p-8 border transition-all duration-500 backdrop-blur-md hover:translate-y-[-4px] ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800/80 shadow-2xl" 
                  : "bg-white/95 border-slate-100 shadow-[0_20px_50px_rgba(96,109,229,0.04)]"
              }`}>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                  <div className="space-y-4 max-w-xl">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"
                    }`}>
                      <QrCode className="w-3.5 h-3.5" /> Acceso sin contacto
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Tu Pase de Acceso Digital</h2>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Escanea este código QR en el kiosco de la entrada para registrar tu asistencia automáticamente y abrir el torniquete de acceso físico al gimnasio.
                    </p>
                    <div className={`flex flex-col sm:flex-row gap-4 sm:items-center text-xs p-4 rounded-2xl border ${
                      isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-200/50"
                    }`}>
                      <div>
                        <span className={`block font-bold text-[9px] uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Clave de Socio
                        </span>
                        <span className="font-extrabold text-[#606DE5]">{resumen.idSocio}</span>
                      </div>
                      <div className={`hidden sm:block w-[1px] h-8 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`} />
                      <div>
                        <span className={`block font-bold text-[9px] uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Tipo de Validación
                        </span>
                        <span className="font-bold text-slate-500 dark:text-gray-400">Escáner Óptico de Pantalla</span>
                      </div>
                    </div>
                  </div>

                  {/* DISEÑO DEL PASE DIGITAL (Mockup Apple Wallet style) */}
                  <div className={`w-[260px] md:w-[300px] rounded-3xl p-6 relative overflow-hidden border flex flex-col items-center justify-between shadow-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? "bg-gradient-to-b from-slate-950 to-slate-900 border-gray-800" 
                      : "bg-gradient-to-b from-slate-900 to-slate-950 border-slate-850 text-white"
                  }`}>
                    {/* Header del Pase */}
                    <div className="w-full flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="FITGYM" className="w-6 h-6 object-contain" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">FITGYM PASS</span>
                      </div>
                      <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase">
                        Socio
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] bg-white rounded-2xl p-3 shadow-2xl relative overflow-hidden flex items-center justify-center border border-white/10">
                      {qrCodeUrl ? (
                        <>
                          <img src={qrCodeUrl} className="w-full h-full object-contain" alt="Acceso QR" />
                          {/* Línea Láser Animada */}
                          <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-scan"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 text-slate-800 animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Footer del Pase */}
                    <div className="w-full text-center mt-4">
                      <h4 className="text-sm font-black uppercase text-white tracking-tight truncate px-1">
                        {resumen.nombreCompleto}
                      </h4>
                      <p className="text-[9px] font-bold text-gray-400 tracking-[2px] uppercase mt-1">
                        ID: {resumen.idSocio}
                      </p>
                    </div>

                    {/* Brillo de esquina decorativo */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#606DE5]/10 rounded-full blur-xl pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Sección Historial de Pagos (Expandible) */}
            {showHistory && (
              <div className={`rounded-3xl p-8 border transition-all duration-300 shadow-2xl backdrop-blur-md ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800/80 shadow-2xl" 
                  : "bg-white/95 border-slate-100 shadow-[0_20px_50px_rgba(96,109,229,0.05)]"
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                      isDarkMode 
                        ? "bg-slate-800/80 border-slate-700/50 text-indigo-400" 
                        : "bg-indigo-50 border-[#606DE5]/10 text-[#606DE5]"
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
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className={`text-[10px] font-black uppercase tracking-widest px-4 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}>
                        <th className="pb-2 pl-5">Fecha</th>
                        <th className="pb-2">Plan / Concepto</th>
                        <th className="pb-2">Método</th>
                        <th className="pb-2">Monto</th>
                        <th className="pb-2 text-right pr-5">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((pago) => (
                        <tr key={pago.id} className={`transition-all duration-200 group rounded-2xl ${
                          isDarkMode 
                            ? "bg-slate-850/40 hover:bg-slate-850/70" 
                            : "bg-slate-50/50 hover:bg-slate-50/90"
                        }`}>
                          <td className={`py-4 pl-5 rounded-l-2xl border-y border-l font-bold text-xs ${
                            isDarkMode ? "border-slate-800/80" : "border-slate-100"
                          }`}>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-450" />
                              {new Date(pago.fecha).toLocaleDateString()}
                            </div>
                          </td>
                          <td className={`py-4 border-y ${
                            isDarkMode ? "border-slate-800/80" : "border-slate-100"
                          }`}>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#606DE5] uppercase text-[11px]">{pago.plan}</span>
                              <span className={`text-[9px] font-semibold mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                ID Pago: #{pago.id}
                              </span>
                            </div>
                          </td>
                          <td className={`py-4 border-y ${
                            isDarkMode ? "border-slate-800/80" : "border-slate-100"
                          }`}>
                            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              <CreditCard size={14} className="opacity-80" />
                              {pago.metodoPago}
                            </div>
                          </td>
                          <td className={`py-4 border-y font-black text-sm ${
                            isDarkMode ? "border-slate-800/80 text-white" : "border-slate-100 text-slate-800"
                          }`}>
                            ${pago.monto} MXN
                          </td>
                          <td className={`py-4 pr-5 rounded-r-2xl border-y border-r text-right ${
                            isDarkMode ? "border-slate-800/80" : "border-slate-100"
                          }`}>
                            <div className="flex items-center justify-end gap-3">
                              <span className="bg-emerald-500/15 text-emerald-500 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/10">
                                Completado
                              </span>
                              <button 
                                onClick={() => handleOpenReceipt(pago)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  isDarkMode 
                                    ? "bg-slate-800 border-slate-700 text-gray-300 hover:bg-indigo-650 hover:text-white" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-[#606DE5] hover:text-white"
                                }`}
                                title="Ver Comprobante"
                              >
                                <Receipt size={14} />
                              </button>
                            </div>
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

      {/* MODAL DETALLE DE TICKET DIGITAL (Premium Physical Receipt Mockup) */}
      {showReceiptModal && selectedPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-[360px] rounded-3xl overflow-hidden shadow-2xl relative ${
            isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-100"
          }`}>
            {/* Cabecera del Modal */}
            <div className={`p-4 flex items-center justify-between border-b ${
              isDarkMode ? "border-slate-800" : "border-slate-100"
            }`}>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Comprobante de Pago</span>
              <button 
                onClick={() => { setShowReceiptModal(false); setSelectedPago(null); }}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido Imprimible del Recibo (Mockup Papel de Impresora Térmica) */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/45">
              <div 
                id="print-receipt-area" 
                className="bg-white text-slate-900 p-5 shadow-lg border border-slate-200 font-mono text-[10px] relative overflow-hidden"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.02) 50%, transparent 50%)', backgroundSize: '100% 4px' }}
              >
                {/* Bordes dentados simulados arriba/abajo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(45deg,transparent_33.333%,#cbd5e1_33.333%,#cbd5e1_66.667%,transparent_66.667%)] bg-[size:6px_6px]" />
                
                <div className="text-center space-y-1 mt-2">
                  <h2 className="text-sm font-black tracking-widest">FITGYM S.A. DE C.V.</h2>
                  <p className="text-[8px] text-slate-500">AV. DEPORTIVA #124, CENTRO</p>
                  <p className="text-[8px] text-slate-500">TEL: 021-0892-2323</p>
                  <p className="text-[8px] text-slate-500">RFC: FGY140220-AB4</p>
                </div>

                <div className="w-full border-t border-dashed border-slate-300 my-4" />

                <div className="space-y-1">
                  <p><span className="font-bold">TRANS:</span> #{selectedPago.id}</p>
                  <p><span className="font-bold">FECHA:</span> {new Date(selectedPago.fecha).toLocaleDateString()} {new Date(selectedPago.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p><span className="font-bold">SOCIO:</span> {resumen?.nombreCompleto}</p>
                  <p><span className="font-bold">ID SOCIO:</span> {selectedPago.idSocio}</p>
                </div>

                <div className="w-full border-t border-dashed border-slate-300 my-4" />

                <table className="w-full text-left">
                  <thead>
                    <tr className="font-bold border-b border-slate-200">
                      <th className="pb-1">CONCEPTO</th>
                      <th className="pb-1 text-center">CANT</th>
                      <th className="pb-1 text-right">IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pt-2 truncate max-w-[120px]">{selectedPago.plan}</td>
                      <td className="pt-2 text-center">1</td>
                      <td className="pt-2 text-right">${selectedPago.monto.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="w-full border-t border-dashed border-slate-300 my-4" />

                <div className="space-y-1 text-right text-xs">
                  <p className="text-[9px]"><span className="font-bold font-mono">SUBTOTAL:</span> ${selectedPago.monto.toFixed(2)} MXN</p>
                  <p className="text-[9px]"><span className="font-bold font-mono">DESCUENTO:</span> $0.00 MXN</p>
                  <p className="font-black text-sm"><span className="font-mono">TOTAL:</span> ${selectedPago.monto.toFixed(2)} MXN</p>
                </div>

                <div className="w-full border-t border-dashed border-slate-300 my-4" />

                <div className="space-y-1">
                  <p><span className="font-bold">PAGO:</span> {selectedPago.metodoPago}</p>
                  <p><span className="font-bold">ESTADO:</span> APROBADO</p>
                  <p className="text-[8px] text-slate-500 font-bold">AUT: SYSTEM-AUTH-JWT-FIT</p>
                </div>

                <div className="w-full border-t border-dashed border-slate-300 my-4" />

                {/* Código de barras simulado con CSS */}
                <div className="flex flex-col items-center gap-1.5 my-3">
                  <div className="w-full h-8 flex justify-center items-stretch opacity-85 select-none animate-barcode-pulse">
                    {[1,2,1,3,1,2,4,1,2,1,3,1,1,2,3,1,4,1,2,1,2,3,1,1,4,1,2].map((w, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-slate-900`} 
                        style={{ width: `${w}px`, marginLeft: idx % 2 === 0 ? '1px' : '0px', opacity: idx % 3 === 0 ? 0.9 : 1 }}
                      />
                    ))}
                  </div>
                  <span className="text-[7px] text-slate-450 tracking-[4px]">*{selectedPago.idSocio}-{selectedPago.id}*</span>
                </div>

                <div className="text-center font-bold text-[8px] text-slate-500 mt-4 leading-normal">
                  ¡GRACIAS POR ENTRENAR CON NOSOTROS!<br />
                  SU SALUD ES NUESTRA PRIORIDAD
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-[linear-gradient(45deg,transparent_33.333%,#cbd5e1_33.333%,#cbd5e1_66.667%,transparent_66.667%)] bg-[size:6px_6px]" />
              </div>
            </div>

            {/* Footer de Acciones del Modal */}
            <div className={`p-4 flex items-center justify-end gap-3 border-t ${
              isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Printer size={14} /> Imprimir Recibo
              </button>
              <button 
                onClick={() => { setShowReceiptModal(false); setSelectedPago(null); }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                  isDarkMode 
                    ? "bg-slate-900 border-slate-800 text-gray-400 hover:text-white" 
                    : "bg-white border-slate-200 text-slate-650 hover:bg-slate-100"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

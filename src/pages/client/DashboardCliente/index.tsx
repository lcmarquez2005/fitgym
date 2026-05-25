import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@layout/Footer";
import { ClientNavbar } from "@/components";
import UserCard from "./UserCard";
import MembershipSummaryCard from "./MembershipSummaryCard";
import { DashboardService, type ClienteResumen } from "@services/dashboard.service";
import { PagoService, type PagoRecord } from "@services/pago.service";
import { toast } from "sonner";
import { Receipt, Calendar, CreditCard } from "lucide-react";

export default function Dashboard() {
  const [resumen, setResumen] = useState<ClienteResumen | null>(null);
  const [historial, setHistorial] = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const images = {
    iconCard: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ruvgt3n0_expires_30_days.png", // Estrella roja
    idCardImage: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ory280oa_expires_30_days.png", // Chico pesas
    purpleCircle: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/9m4a9baw_expires_30_days.png", 
    orangeTicket: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/r149okud_expires_30_days.png", 
    logoFooter: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/xx9qbpqk_expires_30_days.png",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumenData, historialData] = await Promise.all([
            DashboardService.getClienteResumen(),
            PagoService.getHistorial()
        ]);
        setResumen(resumenData);
        setHistorial(historialData);
      } catch (error) {
        toast.error("Error al cargar los datos del panel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-[#9FDDFF] overflow-hidden font-sans text-slate-800">
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F6F8FE]">
        <ClientNavbar mesPagado={resumen?.mesPagado} />
        
        <div className="bg-[#9FDDFF] w-full py-10 px-12 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <h1 className="text-black text-4xl font-bakbak uppercase tracking-tight relative z-10">
              Panel de Membresía
            </h1>
            <p className="text-black/60 font-medium italic relative z-10">Gestiona tu suscripción y consulta tu estatus actual</p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#606DE5]" />
          </div>
        ) : (
          <div className="px-6 md:px-10 mt-6 pb-12 space-y-8">
            <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                <UserCard 
                    images={images} 
                    data={resumen} 
                    onRenew={() => navigate('/#planes-section')} 
                />
                <MembershipSummaryCard 
                    images={images} 
                    data={resumen} 
                    onViewHistory={() => setShowHistory(!showHistory)}
                />
            </div>

            {/* Sección Historial de Pagos (Expandible) */}
            {showHistory && (
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bakbak uppercase tracking-tight">Historial de Pagos</h3>
                            <p className="text-sm text-gray-400 font-medium">Consulta tus últimas transacciones y renovaciones</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                                    <th className="pb-2 pl-4">Fecha</th>
                                    <th className="pb-2">Plan / Concepto</th>
                                    <th className="pb-2">Método</th>
                                    <th className="pb-2">Monto</th>
                                    <th className="pb-2 text-right pr-4">Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((pago) => (
                                    <tr key={pago.id} className="bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-gray-100 font-bold text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-300" />
                                                {new Date(pago.fecha).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-indigo-600 uppercase text-xs">{pago.plan}</span>
                                                <span className="text-[10px] text-gray-400">ID Pago: #{pago.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-gray-100">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
                                                <CreditCard size={14} />
                                                {pago.metodoPago}
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-gray-100 font-black text-slate-800">
                                            ${pago.monto} MXN
                                        </td>
                                        <td className="py-4 pr-4 rounded-r-2xl border-y border-r border-gray-100 text-right">
                                            <span className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Completado</span>
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

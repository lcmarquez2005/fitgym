import { useEffect, useState } from 'react';
import { getFlujoEfectivo } from '../../../../services/reportes.service';
import { Download, RefreshCw, Activity, ArrowRightLeft } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewFlujoEfectivo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getFlujoEfectivo();
      if (res.success !== false) setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-10"><RefreshCw className="animate-spin text-blue-500" /></div>;
  if (!data) return <div className="text-center text-gray-500 p-10">No hay datos disponibles.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flujo de Efectivo</h2>
          <p className="text-gray-500">Periodo: {data.mes} / {data.anio}</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/flujo-efectivo/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Saldo Inicial del Mes</span>
            <span className="font-bold text-gray-900 text-xl">${data.saldoInicial?.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-center">
            <ArrowRightLeft className="text-gray-300" />
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="text-green-800 font-medium">+ Entradas (Ingresos Totales)</span>
            <span className="font-bold text-green-700 text-xl">${data.entradas?.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <span className="text-red-800 font-medium">- Salidas (Egresos Totales)</span>
            <span className="font-bold text-red-700 text-xl">${data.salidas?.toFixed(2)}</span>
          </div>

          <div className="pt-6 border-t mt-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="text-blue-600" />
              </div>
              <span className="text-gray-800 font-bold text-lg">Flujo Neto del Mes</span>
            </div>
            <span className={`font-bold text-3xl ${data.flujoNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${data.flujoNeto?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

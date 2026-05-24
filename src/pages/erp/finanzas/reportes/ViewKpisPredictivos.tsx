import { useEffect, useState } from 'react';
import { getKpisPredictivos } from '../../../../services/reportes.service';
import { Download, RefreshCw, TrendingDown, Target, HeartPulse } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewKpisPredictivos() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getKpisPredictivos();
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KPIs Predictivos</h2>
          <p className="text-gray-500">Inteligencia de Negocios y Métricas Clave</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/kpis-predictivos/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Churn Rate */}
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={64} className="text-red-500" />
          </div>
          <h3 className="text-gray-500 font-medium mb-1">Tasa de Cancelación (Churn)</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{data.churnRate?.toFixed(2)}%</p>
          <p className="text-sm text-gray-400">Porcentaje de socios que abandonaron en los últimos 30 días.</p>
          <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium ${data.churnRate > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {data.churnRate > 10 ? '¡Alerta! Churn alto' : 'Churn Saludable'}
          </div>
        </div>

        {/* LTV & CAC */}
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <HeartPulse size={64} className="text-blue-500" />
          </div>
          <h3 className="text-gray-500 font-medium mb-1">Lifetime Value (LTV)</h3>
          <p className="text-4xl font-bold text-blue-600 mb-2">${data.ltvEstimado?.toFixed(2)}</p>
          <p className="text-sm text-gray-400">Ingreso promedio estimado por socio durante su tiempo de vida.</p>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium uppercase">CAC Estimado</span>
            <span className="font-bold text-gray-800">${data.cacEstimado?.toFixed(2)}</span>
          </div>
        </div>

        {/* Break-even */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl border shadow-sm relative overflow-hidden group hover:shadow-md transition-all text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
            <Target size={64} />
          </div>
          <h3 className="text-indigo-100 font-medium mb-1">Punto de Equilibrio</h3>
          <p className="text-4xl font-bold text-white mb-2">${data.puntoEquilibrio?.toFixed(2)}</p>
          <p className="text-sm text-indigo-200">Ingreso mínimo mensual requerido para no tener pérdidas (Margen estimado: {data.margenContribucion * 100}%).</p>
        </div>
      </div>
    </div>
  );
}

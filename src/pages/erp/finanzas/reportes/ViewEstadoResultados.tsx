import { useEffect, useState } from 'react';
import { getEstadoResultados } from '../../../../services/reportes.service';
import { Download, RefreshCw, ArrowUpCircle, ArrowDownCircle, Banknote } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewEstadoResultados() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEstadoResultados();
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
          <h2 className="text-2xl font-bold text-gray-900">Estado de Resultados</h2>
          <p className="text-gray-500">Mes: {data.mes} | Año: {data.anio}</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/estado-resultados/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm flex items-center gap-4">
          <ArrowUpCircle className="w-12 h-12 text-green-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">${data.ingresosTotales?.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex items-center gap-4">
          <ArrowDownCircle className="w-12 h-12 text-red-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Egresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">${data.egresosTotales?.toFixed(2)}</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl border shadow-sm flex items-center gap-4 ${data.utilidadNeta >= 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-transparent' : 'bg-red-600 text-white border-transparent'}`}>
          <Banknote className="w-12 h-12 opacity-80" />
          <div>
            <p className="text-sm opacity-90 font-medium">Utilidad Neta</p>
            <p className="text-3xl font-bold">${data.utilidadNeta?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

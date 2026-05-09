import { useEffect, useState } from 'react';
import { getOperacionesDiarias } from '../../../../services/reportes.service';
import { Download, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewOperacionesDiarias() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOperacionesDiarias();
      if (res.success !== false) {
        setData(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    window.open(`${BASE_URL}/finance/reportes/operaciones-diarias/export/pdf`, '_blank');
  };

  if (loading) return <div className="flex justify-center items-center h-full"><RefreshCw className="animate-spin text-blue-500" /></div>;
  if (!data) return <div className="text-center text-gray-500 mt-10">No hay datos disponibles para hoy.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Operaciones Diarias</h2>
          <p className="text-gray-500">Corte de caja estimado para la fecha: {data.fecha}</p>
        </div>
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Caja Inicial */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
              <DollarSign size={24} />
            </div>
            <h3 className="font-semibold text-gray-700">Caja Inicial (Apertura)</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">${data.cajaInicial?.toFixed(2) || '0.00'}</p>
        </div>

        {/* Ingresos Hoy */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-semibold text-gray-700">Ingresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-4">+${data.totalIngresos?.toFixed(2) || '0.00'}</p>
        </div>

        {/* Egresos Hoy */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={24} />
            </div>
            <h3 className="font-semibold text-gray-700">Egresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-4">-${data.totalEgresos?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Caja Final Estimada */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-blue-100 text-lg mb-1">Caja Final Estimada (Cierre)</h3>
          <p className="text-5xl font-bold">${data.cajaFinalCalculada?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="text-right">
          <p className="text-blue-100 mb-1">Total de Movimientos</p>
          <p className="text-3xl font-semibold">{data.transaccionesTotales}</p>
        </div>
      </div>

    </div>
  );
}

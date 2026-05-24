import { useEffect, useState } from 'react';
import { getBalanceGeneral } from '../../../../services/reportes.service';
import { Download, RefreshCw, Building, DollarSign, Wallet } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewBalanceGeneral() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBalanceGeneral();
      if (res.success !== false) setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-10"><RefreshCw className="animate-spin text-blue-500" /></div>;
  if (!data) return <div className="text-center text-gray-500 p-10">No hay datos para el Balance General.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Balance General</h2>
          <p className="text-gray-500">Corte al: {data.fecha}</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/balance-general/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ACTIVOS */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <DollarSign className="text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Activos</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <span className="text-gray-600">Activos Circulantes (Caja + Inventario)</span>
              <span className="font-semibold text-gray-900">${data.activosCirculantes?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <span className="text-gray-600">Activos Fijos (Equipo/Propiedad)</span>
              <span className="font-semibold text-gray-900">${data.activosFijos?.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between items-center bg-green-50 p-4 rounded-lg">
            <span className="font-bold text-green-800">TOTAL ACTIVOS</span>
            <span className="font-bold text-xl text-green-700">${data.totalActivos?.toFixed(2)}</span>
          </div>
        </div>

        {/* PASIVOS Y CAPITAL */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Building className="text-red-500" />
              <h3 className="text-xl font-bold text-gray-800">Pasivos</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600">Pasivos a Corto Plazo</span>
                <span className="font-semibold text-gray-900">${data.pasivosCortoPlazo?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600">Pasivos a Largo Plazo</span>
                <span className="font-semibold text-gray-900">${data.pasivosLargoPlazo?.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-between items-center bg-red-50 p-4 rounded-lg">
              <span className="font-bold text-red-800">TOTAL PASIVOS</span>
              <span className="font-bold text-xl text-red-700">${data.totalPasivos?.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Wallet className="text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-800">Capital</h3>
            </div>
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
              <span className="font-bold text-indigo-800">TOTAL CAPITAL</span>
              <span className="font-bold text-xl text-indigo-700">${data.capital?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

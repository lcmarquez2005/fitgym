import { useEffect, useState } from 'react';
import { getAnalisisMembresias } from '../../../../services/reportes.service';
import { Download, RefreshCw, UserCheck, UserMinus, Users } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewMembresias() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnalisisMembresias();
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
          <h2 className="text-2xl font-bold text-gray-900">Análisis de Membresías</h2>
          <p className="text-gray-500">Estado actual de la base de socios ({data.mes}/{data.anio})</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/membresias/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total de Socios</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalSocios}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Socios Activos</p>
          <p className="text-3xl font-bold text-green-600">{data.sociosActivos}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <UserMinus size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Socios Inactivos</p>
          <p className="text-3xl font-bold text-red-600">{data.sociosInactivos}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-4">Desglose por Tipo de Plan</h3>
        <div className="space-y-4">
          {data.membresiasPorTipo && Object.entries(data.membresiasPorTipo).length > 0 ? (
            Object.entries(data.membresiasPorTipo).map(([tipo, cantidad]: any) => (
              <div key={tipo} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                <span className="text-gray-700 font-medium">{tipo}</span>
                <span className="font-bold bg-white px-3 py-1 rounded-md border text-blue-600">{cantidad} socios</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No hay datos de tipos de plan.</p>
          )}
        </div>
      </div>
    </div>
  );
}

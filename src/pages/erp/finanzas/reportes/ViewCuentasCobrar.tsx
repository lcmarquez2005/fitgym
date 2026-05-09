import { useEffect, useState } from 'react';
import { getCuentasPorCobrar } from '../../../../services/reportes.service';
import { Download, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewCuentasCobrar() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCuentasPorCobrar();
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
          <h2 className="text-2xl font-bold text-gray-900">Cuentas por Cobrar</h2>
          <p className="text-gray-500">Socios con mensualidades vencidas</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/cuentas-por-cobrar/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm flex items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div>
            <p className="text-sm text-red-800 font-medium">Deuda Total Acumulada</p>
            <p className="text-3xl font-bold text-red-700">${data.deudaTotalAcumulada?.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <Users className="w-12 h-12 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Deudores</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalDeudores}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-800">Detalle de Socios Deudores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">ID Socio</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Días Vencidos</th>
                <th className="px-6 py-3">Deuda Estimada</th>
              </tr>
            </thead>
            <tbody>
              {data.detalleDeudores?.length > 0 ? (
                data.detalleDeudores.map((deudor: any) => (
                  <tr key={deudor.socioId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{deudor.socioId}</td>
                    <td className="px-6 py-4">{deudor.nombreSocio}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">{deudor.diasVencidos} días</td>
                    <td className="px-6 py-4">${deudor.deudaEstimada?.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    ¡Excelente! No hay socios con mensualidades vencidas en este momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

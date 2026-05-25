import { useEffect, useState } from 'react';
import { getVentasPorCategoria } from '../../../../services/reportes.service';
import { Download, RefreshCw, PieChart, Tag, Dumbbell, Droplet } from 'lucide-react';
import { BASE_URL } from '../../../../services/api.config';

export default function ViewVentasCategoria() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getVentasPorCategoria();
      if (res.success !== false) setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-10"><RefreshCw className="animate-spin text-blue-500" /></div>;
  if (!data) return <div className="text-center text-gray-500 p-10">No hay datos disponibles.</div>;

  const getIconForCategory = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('membres')) return <Dumbbell className="text-blue-500" />;
    if (c.includes('bebida') || c.includes('agua')) return <Droplet className="text-cyan-500" />;
    return <Tag className="text-purple-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ventas por Categoría</h2>
          <p className="text-gray-500">Desglose de ingresos ({data.mes}/{data.anio})</p>
        </div>
        <button onClick={() => window.open(`${BASE_URL}/finance/reportes/ventas-categoria/export/pdf`, '_blank')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
          <PieChart className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-lg">Distribución de Ingresos</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {data.ventasPorCategoria && Object.entries(data.ventasPorCategoria).length > 0 ? (
              Object.entries(data.ventasPorCategoria).map(([categoria, monto]: any) => {
                const porcentaje = data.totalVentas > 0 ? ((monto / data.totalVentas) * 100).toFixed(1) : 0;
                
                return (
                  <div key={categoria} className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {getIconForCategory(categoria)}
                        <span className="font-medium text-gray-800 capitalize">{categoria}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-gray-900">${monto.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{porcentaje}% del total</span>
                      </div>
                    </div>
                    {/* Barra de progreso visual */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No hay ventas registradas en este periodo.</p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-between items-center px-4">
            <span className="text-gray-600 font-medium">Ventas Totales del Periodo</span>
            <span className="text-2xl font-bold text-gray-900">${data.totalVentas?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

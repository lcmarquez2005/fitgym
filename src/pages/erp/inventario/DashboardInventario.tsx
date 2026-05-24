import { useEffect, useState } from 'react';
import { InventarioService } from '../../../services/inventario.service';

export default function DashboardInventario() {
    const [equipos, setEquipos] = useState<any[]>([]);
    const [alertasStock, setAlertasStock] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            setLoading(true);
            const [resEquipos, resAlertas] = await Promise.all([
                InventarioService.getEquipos(),
                InventarioService.getStockBajo()
            ]);
            if (resEquipos.success) setEquipos(resEquipos.data);
            if (resAlertas.success) setAlertasStock(resAlertas.data);
            setLoading(false);
        };
        fetchDatos();
    }, []);

    const equiposEnMantenimiento = equipos.filter(e => e.estado === 'MANTENIMIENTO').length;
    const equiposOperativos = equipos.filter(e => e.estado === 'OPERATIVO').length;

    if (loading) return <div className="p-6 text-center text-gray-500">Cargando dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">🏋️</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Equipos Operativos</p>
                        <p className="text-3xl font-bold text-gray-800">{equiposOperativos}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full text-2xl">🔧</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">En Mantenimiento</p>
                        <p className="text-3xl font-bold text-gray-800">{equiposEnMantenimiento}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-full text-2xl">⚠️</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Alertas de Stock</p>
                        <p className="text-3xl font-bold text-red-600">{alertasStock.length}</p>
                    </div>
                </div>
            </div>

            {/* Alertas de Stock */}
            {alertasStock.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100">
                        <h2 className="text-lg font-semibold text-red-800">⚠️ Productos con Stock Bajo</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {alertasStock.map(sup => (
                            <div key={sup.id} className="p-4 flex justify-between items-center hover:bg-red-50/50 transition">
                                <div>
                                    <p className="font-semibold text-gray-800">{sup.nombre}</p>
                                    <p className="text-sm text-gray-500">{sup.marca} - Proveedor: {sup.proveedor?.nombre}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Mínimo sugerido: {sup.stockMinimo}</p>
                                    <p className={`font-bold ${sup.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                                        Stock Actual: {sup.stock}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

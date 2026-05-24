import { useEffect, useState } from 'react';
import { InventarioService } from '../../../services/inventario.service';

export default function SuplementosPage() {
    const [suplementos, setSuplementos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const cargarDatos = async () => {
        setLoading(true);
        const res = await InventarioService.getSuplementos();
        if (res.success) setSuplementos(res.data);
        setLoading(false);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleVenta = async (id: number) => {
        const cantStr = prompt('¿Cuántas unidades deseas vender?');
        if (!cantStr) return;
        const cant = parseInt(cantStr);
        if (isNaN(cant) || cant <= 0) return;

        const res = await InventarioService.venderSuplemento(id, cant);
        setMsg(res.message);
        if (res.success) cargarDatos();
    };

    const handleReabastecer = async (id: number) => {
        const cantStr = prompt('¿Cuántas unidades llegaron del proveedor?');
        if (!cantStr) return;
        const cant = parseInt(cantStr);
        if (isNaN(cant) || cant <= 0) return;

        const res = await InventarioService.reabastecerSuplemento(id, cant);
        setMsg(res.message);
        if (res.success) cargarDatos();
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">🛒 Punto de Venta - Suplementos</h2>
            </div>
            
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            {loading ? <p>Cargando...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {suplementos.map(sup => (
                        <div key={sup.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
                            <div className="flex-grow">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{sup.nombre}</h3>
                                <p className="text-sm text-gray-500 mb-2">{sup.marca}</p>
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-2xl font-black text-green-600">${sup.precioVenta}</span>
                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${sup.stock <= sup.stockMinimo ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                        Stock: {sup.stock}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => handleVenta(sup.id)}
                                    disabled={sup.stock === 0}
                                    className="bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Vender
                                </button>
                                <button 
                                    onClick={() => handleReabastecer(sup.id)}
                                    className="bg-gray-100 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-200"
                                >
                                    + Comprar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

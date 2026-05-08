import { useEffect, useState } from 'react';
import { InventarioService } from '../../../services/inventario.service';

export default function EquiposPage() {
    const [equipos, setEquipos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // Formulario
    const [nombre, setNombre] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [numeroDeSerie, setNumeroDeSerie] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [vidaUtilAnios, setVidaUtilAnios] = useState('');
    const [valorCompra, setValorCompra] = useState('');
    const [categoriaId, setCategoriaId] = useState('');

    const cargarDatos = async () => {
        setLoading(true);
        const [resEq, resCat] = await Promise.all([
            InventarioService.getEquipos(),
            InventarioService.getCategorias()
        ]);
        if (resEq.success) setEquipos(resEq.data);
        if (resCat.success) setCategorias(resCat.data);
        setLoading(false);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            nombre, marca, modelo, numeroDeSerie,
            fechaCompra, vidaUtilAnios: parseInt(vidaUtilAnios),
            valorCompra: parseFloat(valorCompra),
            estado: 'OPERATIVO',
            categoria: { id: parseInt(categoriaId) }
        };

        const res = await InventarioService.crearEquipo(data);
        setMsg(res.message);
        if (res.success) {
            setNombre(''); setMarca(''); setModelo(''); setNumeroDeSerie('');
            setFechaCompra(''); setVidaUtilAnios(''); setValorCompra(''); setCategoriaId('');
            cargarDatos();
        }
    };

    return (
        <div className="p-6 space-y-6">
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold mb-4">Registrar Equipo</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1">Nombre</label>
                            <input required className="w-full border p-2 rounded" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Marca</label>
                                <input className="w-full border p-2 rounded" value={marca} onChange={e => setMarca(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Modelo</label>
                                <input className="w-full border p-2 rounded" value={modelo} onChange={e => setModelo(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">No. de Serie</label>
                            <input required className="w-full border p-2 rounded" value={numeroDeSerie} onChange={e => setNumeroDeSerie(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Fecha Compra</label>
                                <input type="date" required className="w-full border p-2 rounded" value={fechaCompra} onChange={e => setFechaCompra(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Valor ($)</label>
                                <input type="number" step="0.01" required className="w-full border p-2 rounded" value={valorCompra} onChange={e => setValorCompra(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Vida Útil (Años)</label>
                            <input type="number" required className="w-full border p-2 rounded" value={vidaUtilAnios} onChange={e => setVidaUtilAnios(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Categoría</label>
                            <select required className="w-full border p-2 rounded" value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                                <option value="">Seleccione...</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Guardar</button>
                    </form>
                </div>

                {/* Lista */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                        <h2 className="text-lg font-bold">Directorio de Equipos</h2>
                    </div>
                    {loading ? <p className="p-4">Cargando...</p> : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">Equipo</th>
                                    <th className="px-4 py-3">No. Serie</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {equipos.map(eq => (
                                    <tr key={eq.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {eq.nombre} <br/><span className="text-xs text-gray-500">{eq.marca} {eq.modelo}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{eq.numeroDeSerie}</td>
                                        <td className="px-4 py-3 text-gray-600">{eq.categoria?.nombre}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                eq.estado === 'OPERATIVO' ? 'bg-green-100 text-green-800' :
                                                eq.estado === 'MANTENIMIENTO' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {eq.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

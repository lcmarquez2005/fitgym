import { useEffect, useState } from 'react';
import { InventarioService } from '../../../services/inventario.service';
import { Wrench } from 'lucide-react';

export default function MantenimientoPage() {
    const [equipos, setEquipos] = useState<any[]>([]);
    const [mantenimientos, setMantenimientos] = useState<any[]>([]);
    const [msg, setMsg] = useState('');

    // Form
    const [equipoId, setEquipoId] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [tipo, setTipo] = useState('PREVENTIVO');
    const [descripcion, setDescripcion] = useState('');
    const [tecnico, setTecnico] = useState('');
    const [costo, setCosto] = useState('');

    const cargarEquipos = async () => {
        const res = await InventarioService.getEquipos();
        if (res.success) setEquipos(res.data);
    };

    useEffect(() => {
        cargarEquipos();
    }, []);

    // Cargar historial cuando seleccionan un equipo
    useEffect(() => {
        if (equipoId) {
            InventarioService.getMantenimientosPorEquipo(parseInt(equipoId)).then(res => {
                if (res.success) setMantenimientos(res.data);
            });
        } else {
            setMantenimientos([]);
        }
    }, [equipoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            equipoId: parseInt(equipoId),
            fecha, tipo, descripcion, tecnico,
            costo: parseFloat(costo) || 0
        };

        const res = await InventarioService.registrarMantenimiento(data);
        setMsg(res.message);
        if (res.success) {
            setDescripcion(''); setCosto('');
            // Recargar historial
            InventarioService.getMantenimientosPorEquipo(parseInt(equipoId)).then(r => {
                if (r.success) setMantenimientos(r.data);
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="text-[#606DE5]" size={22} />
                Bitácora de Mantenimiento
            </h2>
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold mb-4">Registrar Servicio</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1">Equipo</label>
                            <select required className="w-full border p-2 rounded" value={equipoId} onChange={e => setEquipoId(e.target.value)}>
                                <option value="">Seleccione un equipo...</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.nombre} ({eq.numeroDeSerie})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Fecha</label>
                                <input type="date" required className="w-full border p-2 rounded" value={fecha} onChange={e => setFecha(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Tipo</label>
                                <select className="w-full border p-2 rounded" value={tipo} onChange={e => setTipo(e.target.value)}>
                                    <option value="PREVENTIVO">Preventivo</option>
                                    <option value="CORRECTIVO">Correctivo</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Técnico / Taller</label>
                            <input required className="w-full border p-2 rounded" value={tecnico} onChange={e => setTecnico(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Costo ($)</label>
                            <input type="number" step="0.01" required className="w-full border p-2 rounded" value={costo} onChange={e => setCosto(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Descripción del trabajo</label>
                            <textarea required className="w-full border p-2 rounded" rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)}></textarea>
                        </div>
                        <button type="submit" disabled={!equipoId} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">Guardar Registro</button>
                    </form>
                </div>

                {/* Historial */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-bold">Historial del Equipo Seleccionado</h3>
                    </div>
                    {!equipoId ? (
                        <p className="p-8 text-center text-gray-500">Selecciona un equipo para ver su historial</p>
                    ) : (
                        <div className="divide-y">
                            {mantenimientos.length === 0 ? <p className="p-4 text-gray-500">Sin mantenimientos previos.</p> : null}
                            {mantenimientos.map(m => (
                                <div key={m.id} className="p-4 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.tipo === 'PREVENTIVO' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                {m.tipo}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700">{m.fecha}</span>
                                        </div>
                                        <p className="text-sm text-gray-800 mt-1">{m.descripcion}</p>
                                        <p className="text-xs text-gray-500 mt-1">Técnico: {m.tecnico}</p>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p className="font-bold text-red-600">-${m.costo}</p>
                                        {m.transaccionId && <p className="text-xs text-gray-400">Tx: #{m.transaccionId}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { ReservasService } from '../../../services/reservas.service';
import { Home, Edit3, Dumbbell } from 'lucide-react';

export default function CatalogosReservas() {
    const [salones, setSalones] = useState<any[]>([]);
    const [clases, setClases] = useState<any[]>([]);
    const [msg, setMsg] = useState('');

    // Form Salon
    const [editandoSalonId, setEditandoSalonId] = useState<number | null>(null);
    const [nombreSalon, setNombreSalon] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [equipamiento, setEquipamiento] = useState('');

    // Form Clase
    const [editandoClaseId, setEditandoClaseId] = useState<number | null>(null);
    const [nombreClase, setNombreClase] = useState('');
    const [categoria, setCategoria] = useState('CARDIO');
    const [nivel, setNivel] = useState('TODOS');
    const [duracion, setDuracion] = useState('60');
    const [material, setMaterial] = useState('');
    const [costoExtra, setCostoExtra] = useState('0');

    const cargarDatos = async () => {
        try {
            const [resSalones, resClases] = await Promise.all([
                ReservasService.getSalones(),
                ReservasService.getCatalogo()
            ]);
            // El backend retorna directamente el arreglo de objetos
            if (Array.isArray(resSalones)) setSalones(resSalones);
            if (Array.isArray(resClases)) setClases(resClases);
        } catch (error) {
            console.error("Error cargando catálogos", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const resetFormSalon = () => {
        setEditandoSalonId(null);
        setNombreSalon(''); 
        setCapacidad(''); 
        setEquipamiento('');
    };

    const resetFormClase = () => {
        setEditandoClaseId(null);
        setNombreClase(''); 
        setCategoria('CARDIO');
        setNivel('TODOS');
        setDuracion('60');
        setMaterial(''); 
        setCostoExtra('0');
    };

    const handleSubmitSalon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                nombre: nombreSalon,
                capacidad: parseInt(capacidad),
                equipamiento
            };
            if (editandoSalonId) payload.id = editandoSalonId;

            const res = await ReservasService.crearSalon(payload);
            if (res.id) {
                setMsg(editandoSalonId ? 'Salón actualizado exitosamente' : 'Salón guardado exitosamente');
                resetFormSalon();
                cargarDatos();
            }
        } catch (error: any) {
            setMsg(error.message || 'Error al guardar el salón');
        }
    };

    const handleSubmitClase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                nombre: nombreClase,
                categoria,
                nivel,
                duracionMinutos: parseInt(duracion),
                materialNecesario: material,
                costoExtra: parseFloat(costoExtra)
            };
            if (editandoClaseId) payload.id = editandoClaseId;

            const res = await ReservasService.crearCatalogo(payload);
            if (res.id) {
                setMsg(editandoClaseId ? 'Clase actualizada exitosamente' : 'Clase guardada exitosamente');
                resetFormClase();
                cargarDatos();
            }
        } catch (error: any) {
            setMsg(error.message || 'Error al guardar la clase');
        }
    };

    const handleEliminarSalon = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este salón?')) return;
        try {
            await ReservasService.eliminarSalon(id);
            setMsg('Salón eliminado');
            if (editandoSalonId === id) resetFormSalon();
            cargarDatos();
        } catch (error: any) {
            setMsg(error.message || 'Error al eliminar el salón');
        }
    };

    const handleEliminarClase = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta clase del catálogo?')) return;
        try {
            await ReservasService.eliminarCatalogo(id);
            setMsg('Clase eliminada');
            if (editandoClaseId === id) resetFormClase();
            cargarDatos();
        } catch (error: any) {
            setMsg(error.message || 'Error al eliminar la clase');
        }
    };

    const handleCargarEdicionSalon = (salon: any) => {
        setEditandoSalonId(salon.id);
        setNombreSalon(salon.nombre);
        setCapacidad(salon.capacidad.toString());
        setEquipamiento(salon.equipamiento);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCargarEdicionClase = (clase: any) => {
        setEditandoClaseId(clase.id);
        setNombreClase(clase.nombre);
        setCategoria(clase.categoria);
        setNivel(clase.nivel);
        setDuracion(clase.duracionMinutos.toString());
        setMaterial(clase.materialNecesario || '');
        setCostoExtra(clase.costoExtra.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 space-y-8">
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SALONES */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                        {editandoSalonId && (
                            <button onClick={resetFormSalon} className="absolute top-6 right-6 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">
                                Cancelar Edición
                            </button>
                        )}
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            {editandoSalonId ? (
                                <>
                                    <Edit3 size={18} className="text-amber-500" />
                                    <span>Editar Salón / Espacio</span>
                                </>
                            ) : (
                                <>
                                    <Home size={18} className="text-blue-500" />
                                    <span>Registrar Salón / Espacio</span>
                                </>
                            )}
                        </h3>
                        <form onSubmit={handleSubmitSalon} className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-1">Nombre (Ej. Salón A)</label>
                                    <input required className="w-full border p-2 rounded" value={nombreSalon} onChange={e => setNombreSalon(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Capacidad Máxima</label>
                                    <input type="number" required className="w-full border p-2 rounded" value={capacidad} onChange={e => setCapacidad(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Equipamiento</label>
                                <input required className="w-full border p-2 rounded" placeholder="Ej. 20 bicicletas, espejos" value={equipamiento} onChange={e => setEquipamiento(e.target.value)} />
                            </div>
                            <button type="submit" className={`w-full text-white p-2 rounded ${editandoSalonId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editandoSalonId ? 'Actualizar Salón' : 'Guardar Salón'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b font-bold">Salones Registrados</div>
                        <div className="divide-y max-h-[300px] overflow-y-auto">
                            {salones.map(s => (
                                <div key={s.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{s.nombre} <span className="text-gray-400 text-sm font-normal">({s.capacidad} personas)</span></p>
                                        <p className="text-sm text-gray-500">{s.equipamiento}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleCargarEdicionSalon(s)} className="text-blue-500 text-xs hover:underline">Editar</button>
                                        <button onClick={() => handleEliminarSalon(s.id)} className="text-red-500 text-xs hover:underline">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CLASES */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                        {editandoClaseId && (
                            <button onClick={resetFormClase} className="absolute top-6 right-6 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">
                                Cancelar Edición
                            </button>
                        )}
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            {editandoClaseId ? (
                                <>
                                    <Edit3 size={18} className="text-amber-500" />
                                    <span>Editar Tipo de Clase</span>
                                </>
                            ) : (
                                <>
                                    <Dumbbell size={18} className="text-indigo-500" />
                                    <span>Registrar Tipo de Clase (Catálogo)</span>
                                </>
                            )}
                        </h3>
                        <form onSubmit={handleSubmitClase} className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-1">Nombre de la Clase</label>
                                    <input required className="w-full border p-2 rounded" placeholder="Ej. Spinning VIP" value={nombreClase} onChange={e => setNombreClase(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Categoría</label>
                                    <select className="w-full border p-2 rounded" value={categoria} onChange={e => setCategoria(e.target.value)}>
                                        <option value="CARDIO">Cardio</option>
                                        <option value="FUERZA">Fuerza</option>
                                        <option value="MENTE_CUERPO">Mente-Cuerpo</option>
                                        <option value="COMBATE">Combate</option>
                                        <option value="ACUATICA">Acuática</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-1">Nivel</label>
                                    <select className="w-full border p-2 rounded" value={nivel} onChange={e => setNivel(e.target.value)}>
                                        <option value="TODOS">Todos</option>
                                        <option value="PRINCIPIANTE">Principiante</option>
                                        <option value="INTERMEDIO">Intermedio</option>
                                        <option value="AVANZADO">Avanzado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Duración (min)</label>
                                    <input type="number" required className="w-full border p-2 rounded" value={duracion} onChange={e => setDuracion(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Costo Extra ($)</label>
                                    <input type="number" step="0.01" className="w-full border p-2 rounded" value={costoExtra} onChange={e => setCostoExtra(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Material Necesario</label>
                                <input className="w-full border p-2 rounded" placeholder="Ej. Toalla, Guantes" value={material} onChange={e => setMaterial(e.target.value)} />
                            </div>
                            <button type="submit" className={`w-full text-white p-2 rounded ${editandoClaseId ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                {editandoClaseId ? 'Actualizar Clase' : 'Guardar Clase'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b font-bold">Catálogo de Clases</div>
                        <div className="divide-y h-[300px] overflow-y-auto">
                            {clases.map(c => (
                                <div key={c.id} className="p-4 flex justify-between hover:bg-gray-50 items-center">
                                    <div>
                                        <p className="font-bold text-gray-900">{c.nombre} <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{c.nivel}</span></p>
                                        <p className="text-sm text-gray-500">{c.categoria} • {c.duracionMinutos} min</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="font-bold text-green-600">{c.costoExtra > 0 ? `+$${c.costoExtra}` : 'Incluida'}</p>
                                        <div className="flex gap-2 mt-1">
                                            <button onClick={() => handleCargarEdicionClase(c)} className="text-blue-500 text-xs hover:underline">Editar</button>
                                            <button onClick={() => handleEliminarClase(c.id)} className="text-red-500 text-xs hover:underline">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

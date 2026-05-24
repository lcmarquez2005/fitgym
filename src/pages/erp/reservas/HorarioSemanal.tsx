import { useEffect, useState } from 'react';
import { ReservasService } from '../../../services/reservas.service';
import { UserService } from '../../../services/user.service';
import { Calendar, CalendarPlus } from 'lucide-react';

export default function HorarioSemanal() {
    const [clases, setClases] = useState<any[]>([]);
    const [salones, setSalones] = useState<any[]>([]);
    const [catalogos, setCatalogos] = useState<any[]>([]);
    const [instructores, setInstructores] = useState<any[]>([]);
    
    // Formulario Nueva Clase
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [horaInicio, setHoraInicio] = useState('06:00');
    const [horaFin, setHoraFin] = useState('07:00');
    const [catalogoId, setCatalogoId] = useState('');
    const [salonId, setSalonId] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [msg, setMsg] = useState('');

    const cargarDatos = async () => {
        // Cargar semana actual
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 7);

        const strStart = start.toISOString().split('T')[0];
        const strEnd = end.toISOString().split('T')[0];

        try {
            const [resClases, resSalones, resCat, resUsers] = await Promise.all([
                ReservasService.getHorario(strStart, strEnd),
                ReservasService.getSalones(),
                ReservasService.getCatalogo(),
                UserService.getAll()
            ]);

            if (Array.isArray(resClases)) setClases(resClases);
            if (Array.isArray(resSalones)) setSalones(resSalones);
            if (Array.isArray(resCat)) setCatalogos(resCat);
            
            // El handleResponse de UserService varía, intentamos adaptarlo:
            const userData = Array.isArray(resUsers) ? resUsers : (resUsers as any).data || [];
            // Filtramos instructores
            setInstructores(userData.filter((u: any) => u.rol === 'COACH' || u.rol === 'ADMIN'));
        } catch (error) {
            console.error("Error cargando horario", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleAgendar = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            fecha,
            horaInicio: horaInicio + ":00",
            horaFin: horaFin + ":00",
            catalogoClase: { id: parseInt(catalogoId) },
            salon: { id: parseInt(salonId) },
            instructor: instructorId ? { id: parseInt(instructorId) } : null
        };

        const res = await ReservasService.programarClase(payload);
        if (res.success || res.id) {
            setMsg('Clase agendada exitosamente');
            cargarDatos();
        } else {
            setMsg(res.message || res.error || 'Error al agendar clase');
        }
    };

    const handleCancelar = async (id: number) => {
        if (!confirm('¿Estás seguro de cancelar esta clase? Se cancelarán también todas las reservas asociadas.')) return;
        const res = await ReservasService.cancelarClase(id);
        if (res.success || res.message) {
            alert('Clase cancelada');
            cargarDatos();
        } else {
            alert(res.error || res.message);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="text-[#606DE5]" size={22} />
                    Calendario de Clases (7 Días)
                </h2>
            </div>
            
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Formulario Lateral */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <CalendarPlus className="text-gray-400" size={18} />
                        Agendar Nueva Clase
                    </h3>
                    <form onSubmit={handleAgendar} className="space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1">Clase (Catálogo)</label>
                            <select required className="w-full border p-2 rounded" value={catalogoId} onChange={e => setCatalogoId(e.target.value)}>
                                <option value="">Seleccione...</option>
                                {catalogos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Salón</label>
                            <select required className="w-full border p-2 rounded" value={salonId} onChange={e => setSalonId(e.target.value)}>
                                <option value="">Seleccione...</option>
                                {salones.map(s => <option key={s.id} value={s.id}>{s.nombre} (Cap: {s.capacidad})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Instructor</label>
                            <select className="w-full border p-2 rounded" value={instructorId} onChange={e => setInstructorId(e.target.value)}>
                                <option value="">Sin instructor / Por asignar</option>
                                {instructores.map(i => <option key={i.id} value={i.id}>{i.name} {i.lastName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Fecha</label>
                            <input type="date" required className="w-full border p-2 rounded" value={fecha} onChange={e => setFecha(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Inicio</label>
                                <input type="time" required className="w-full border p-2 rounded" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Fin</label>
                                <input type="time" required className="w-full border p-2 rounded" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#606DE5] text-white p-2 rounded hover:bg-[#4f5bd1]">Agendar al Calendario</button>
                    </form>
                </div>

                {/* Vista Lista de Horario (MVP en lugar de Grid complejo) */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex justify-between">
                        <h3 className="font-bold">Horario de la Semana</h3>
                        <div className="flex gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-green-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                Disponible
                            </span>
                            <span className="flex items-center gap-1.5 text-yellow-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                Poco cupo
                            </span>
                            <span className="flex items-center gap-1.5 text-red-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                Lleno / Waitlist
                            </span>
                        </div>
                    </div>
                    
                    <div className="divide-y max-h-[600px] overflow-y-auto p-4">
                        {clases.length === 0 && <p className="text-center text-gray-500 py-8">No hay clases agendadas. Usa el formulario para agregar.</p>}
                        
                        {clases.map(clase => {
                            const porcentaje = (clase.reservasActuales / clase.cupoMaximo) * 100;
                            const isLleno = porcentaje >= 100;
                            const isCancelada = clase.estado === 'CANCELADA';
                            
                            return (
                                <div key={clase.id} className={`p-4 border mb-4 rounded-lg flex justify-between shadow-sm transition ${isCancelada ? 'bg-gray-100 opacity-60' : 'bg-white hover:border-blue-300'}`}>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-center bg-gray-50 p-3 rounded-lg border min-w-[100px]">
                                            <p className="font-bold text-gray-800 text-lg">{clase.horaInicio.substring(0,5)}</p>
                                            <p className="text-xs font-semibold text-gray-500">{clase.fecha}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                {clase.catalogoClase?.nombre}
                                                {!isCancelada && (
                                                    <span className={`w-3 h-3 rounded-full ${isLleno ? 'bg-red-500' : (porcentaje > 70 ? 'bg-yellow-500' : 'bg-green-500')}`}></span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600 font-medium">{clase.salon?.nombre} • Inst: {clase.instructor ? clase.instructor.name : 'Por Asignar'}</p>
                                            {isCancelada && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">Clase Cancelada</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-center gap-2">
                                        {!isCancelada && (
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Ocupación</p>
                                                <p className="font-bold text-xl text-gray-800">{clase.reservasActuales} / {clase.cupoMaximo}</p>
                                            </div>
                                        )}
                                        {!isCancelada && (
                                            <button 
                                                onClick={() => handleCancelar(clase.id)}
                                                className="text-xs text-red-600 font-semibold hover:underline"
                                            >
                                                Cancelar Clase
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

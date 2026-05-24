import { useEffect, useState } from 'react';
import { ReservasService } from '../../../services/reservas.service';
import { Calendar, Users, Flame } from 'lucide-react';

export default function DashboardReservas() {
    const [clasesActivas, setClasesActivas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            setLoading(true);
            // Cargar clases de esta semana
            const hoy = new Date();
            const finSemana = new Date();
            finSemana.setDate(hoy.getDate() + 7);

            const strInicio = hoy.toISOString().split('T')[0];
            const strFin = finSemana.toISOString().split('T')[0];

            try {
                const res = await ReservasService.getHorario(strInicio, strFin);
                if (Array.isArray(res)) setClasesActivas(res);
            } catch (error) {
                console.error("Error cargando dashboard", error);
            }
            setLoading(false);
        };
        fetchDatos();
    }, []);

    const totalClases = clasesActivas.length;
    const totalReservas = clasesActivas.reduce((acc, c) => acc + c.reservasActuales, 0);
    const clasesLlenas = clasesActivas.filter(c => c.reservasActuales >= c.cupoMaximo).length;

    if (loading) return <div className="p-6 text-center text-gray-500">Cargando dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Resumen de la Semana</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Clases Programadas</p>
                        <p className="text-3xl font-bold text-gray-800">{totalClases}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total de Reservas</p>
                        <p className="text-3xl font-bold text-gray-800">{totalReservas}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                        <Flame size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Clases a Máxima Capacidad</p>
                        <p className="text-3xl font-bold text-orange-600">{clasesLlenas}</p>
                    </div>
                </div>
            </div>

            {/* Próximas Clases */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-bold">Próximas Clases</h3>
                </div>
                {clasesActivas.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No hay clases programadas para esta semana.</p>
                ) : (
                    <div className="divide-y">
                        {clasesActivas.slice(0, 5).map(c => {
                            const porcentaje = (c.reservasActuales / c.cupoMaximo) * 100;
                            return (
                                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-900">{c.catalogoClase?.nombre}</p>
                                        <p className="text-sm text-gray-500">
                                            {c.fecha} - {c.horaInicio} | {c.salon?.nombre} | Instructor: {c.instructor?.name || 'Por asignar'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            porcentaje >= 100 ? 'bg-red-100 text-red-800' :
                                            porcentaje > 70 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {c.reservasActuales} / {c.cupoMaximo}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

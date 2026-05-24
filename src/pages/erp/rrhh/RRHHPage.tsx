import { useEffect, useState } from 'react';
import { RRHHService } from '@services/rrhh.service';
import type { EmpleadoFinance, UsuarioSinFicha } from '@services/rrhh.service';
import Header from '@layout/Header';
import Footer from '@layout/Footer';
import { Users } from 'lucide-react';

export default function RRHHPage() {
    const [empleados, setEmpleados] = useState<EmpleadoFinance[]>([]);
    const [usuariosSinFicha, setUsuariosSinFicha] = useState<UsuarioSinFicha[]>([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Formulario para nueva ficha
    const [selectedUserId, setSelectedUserId] = useState('');
    const [puesto, setPuesto] = useState('ENTRENADOR');
    const [tipoContrato, setTipoContrato] = useState('PLANTA');
    const [sueldoBaseDiario, setSueldoBaseDiario] = useState('');
    const [porcentajeComision, setPorcentajeComision] = useState('0.05');

    const cargarDatos = async () => {
        setLoading(true);
        const [resEmp, resSin] = await Promise.all([
            RRHHService.getEmpleados(),
            RRHHService.getUsuariosSinFicha()
        ]);
        
        if (resEmp.success) setEmpleados(resEmp.data);
        if (resSin.success) setUsuariosSinFicha(resSin.data);
        setLoading(false);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleCrearFicha = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !sueldoBaseDiario) {
            setMsg('Por favor completa los campos requeridos');
            return;
        }

        const data = {
            usuarioId: parseInt(selectedUserId),
            puesto,
            tipoContrato,
            sueldoBaseDiario: parseFloat(sueldoBaseDiario),
            porcentajeComision: parseFloat(porcentajeComision)
        };

        const res = await RRHHService.crearFicha(data);
        setMsg(res.message);
        if (res.success) {
            setSelectedUserId('');
            setSueldoBaseDiario('');
            cargarDatos();
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F8FE] font-inter">
            {/* Brand Header & floating Sidebar */}
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Module Title Card */}
                <div 
                    className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                    style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)" }}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#606DE5]/10 rounded-2xl text-[#606DE5]">
                                <Users size={28} />
                            </div>
                            <h1 className="text-3xl font-bakbak text-black uppercase tracking-wide">Módulo RRHH</h1>
                        </div>
                        <p className="text-gray-500 font-medium italic pl-16">Contratos, expedientes de empleados y nómina.</p>
                    </div>
                </div>

                {/* Content Section with deep shadow */}
                <div 
                    className="bg-white rounded-[40px] p-6 md:p-8 border border-gray-100 min-h-[500px] space-y-6"
                    style={{ boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.05)" }}
                >
                    {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl border border-blue-200 text-sm font-medium">{msg}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Formulario de Asignación */}
                        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Asignar Ficha de Nómina</h2>
                            <form onSubmit={handleCrearFicha} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Usuario sin ficha</label>
                                    <select 
                                        className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                        value={selectedUserId}
                                        onChange={e => setSelectedUserId(e.target.value)}
                                    >
                                        <option value="">-- Seleccionar Usuario --</option>
                                        {usuariosSinFicha.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} {u.lastName} ({u.email})</option>
                                        ))}
                                    </select>
                                    {usuariosSinFicha.length === 0 && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase italic ml-1">Todos los usuarios ya tienen ficha o no hay usuarios registrados.</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Puesto</label>
                                    <select className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium" value={puesto} onChange={e => setPuesto(e.target.value)}>
                                        <option value="ENTRENADOR">Entrenador</option>
                                        <option value="VENDEDOR">Vendedor</option>
                                        <option value="RECEPCIONISTA">Recepcionista</option>
                                        <option value="ADMINISTRATIVO">Administrativo</option>
                                        <option value="MANTENIMIENTO">Mantenimiento</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Tipo de Contrato</label>
                                    <select className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium" value={tipoContrato} onChange={e => setTipoContrato(e.target.value)}>
                                        <option value="PLANTA">Planta</option>
                                        <option value="FREELANCE">Freelance</option>
                                        <option value="TEMPORAL">Temporal</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Sueldo Diario ($)</label>
                                        <input type="number" step="0.01" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium" placeholder="Ej. 350.00" value={sueldoBaseDiario} onChange={e => setSueldoBaseDiario(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Comisión (Ej. 0.05)</label>
                                        <input type="number" step="0.01" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium" value={porcentajeComision} onChange={e => setPorcentajeComision(e.target.value)} />
                                    </div>
                                </div>

                                <button type="submit" disabled={!selectedUserId} className="w-full bg-[#606DE5] hover:bg-[#4f5bd1] text-white py-3 rounded-2xl border-0 transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm font-bold uppercase tracking-wider mt-2">
                                    Crear Ficha
                                </button>
                            </form>
                        </div>

                        {/* Lista de Empleados */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b">
                                <h2 className="text-lg font-bold text-gray-800">Empleados Activos ({empleados.length})</h2>
                            </div>
                            {loading ? (
                                <p className="p-4 text-center text-gray-500">Cargando...</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="px-4 py-3">Nombre</th>
                                                <th className="px-4 py-3">Rol/Puesto</th>
                                                <th className="px-4 py-3">Contrato</th>
                                                <th className="px-4 py-3 text-right">Sueldo D.</th>
                                                <th className="px-4 py-3 text-right">Comisión</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {empleados.map(emp => (
                                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-gray-900">{emp.usuario?.name} {emp.usuario?.lastName}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{emp.usuario?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-block px-2 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 rounded-full mb-1">{emp.usuario?.rol}</span>
                                                        <br/>
                                                        <span className="text-gray-600 font-medium">{emp.puesto}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 font-medium">{emp.tipoContrato}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-slate-800">${emp.sueldoBaseDiario}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600 font-medium">{(emp.porcentajeComision * 100).toFixed(0)}%</td>
                                                </tr>
                                            ))}
                                            {empleados.length === 0 && (
                                                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay empleados registrados en nómina</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

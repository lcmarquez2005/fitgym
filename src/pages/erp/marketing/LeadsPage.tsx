// src/pages/erp/marketing/LeadsPage.tsx
import { useEffect, useState } from 'react';
import {
    getLeads, crearLead, actualizarEtapaLead,
    convertirLead, eliminarLead,
    getSeguimientosLead, agregarSeguimiento,
} from '../../../services/marketing.service';

const ETAPAS = ['CAPTACION', 'CONTACTO', 'VISITA', 'SEGUIMIENTO', 'CERRADO', 'PERDIDO'];
const FUENTES = ['INSTAGRAM', 'FACEBOOK', 'GOOGLE', 'REFERIDO', 'WALK_IN', 'OTRO'];

interface Lead {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    etapa: string;
    fuente: string;
    notas: string;
    asignadoA: string;
    fechaVisita: string;
    fechaCreacion: string;
    fechaUltimoContacto: string;
}

interface Seguimiento {
    id: number;
    tipoContacto: string;
    descripcion: string;
    realizadoPor: string;
    fechaContacto: string;
    etapaEnContacto: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEtapa, setFiltroEtapa] = useState('TODOS');
    const [showForm, setShowForm] = useState(false);
    const [leadDetalle, setLeadDetalle] = useState<Lead | null>(null);
    const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
    const [msg, setMsg] = useState('');

    // Form nuevo lead
    const [form, setForm] = useState({
        nombreCompleto: '', email: '', telefono: '',
        fuente: 'INSTAGRAM', notas: '', asignadoA: '', fechaVisita: '',
    });

    // Form seguimiento
    const [segForm, setSegForm] = useState({
        tipoContacto: 'LLAMADA', descripcion: '', realizadoPor: '',
    });

    const cargar = () => {
        setLoading(true);
        getLeads()
            .then(res => { if (res.success) setLeads(res.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const notificar = (texto: string) => {
        setMsg(texto);
        setTimeout(() => setMsg(''), 3500);
    };

    const handleCrear = async () => {
        if (!form.nombreCompleto.trim()) return notificar('El nombre es requerido');
        const res = await crearLead(form);
        if (res.success) {
            notificar('Lead creado exitosamente');
            setShowForm(false);
            setForm({ nombreCompleto: '', email: '', telefono: '', fuente: 'INSTAGRAM', notas: '', asignadoA: '', fechaVisita: '' });
            cargar();
        } else {
            notificar(res.message);
        }
    };

    const handleEtapa = async (lead: Lead, etapa: string) => {
        const res = await actualizarEtapaLead(lead.id, etapa);
        if (res.success) { notificar('Etapa actualizada'); cargar(); }
    };

    const handleConvertir = async (id: number) => {
        if (!confirm('¿Convertir este lead a socio?')) return;
        const res = await convertirLead(id);
        if (res.success) { notificar('Lead convertido'); cargar(); }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Eliminar este lead?')) return;
        const res = await eliminarLead(id);
        if (res.success) { notificar('Lead eliminado'); cargar(); }
    };

    const abrirDetalle = async (lead: Lead) => {
        setLeadDetalle(lead);
        const res = await getSeguimientosLead(lead.id);
        if (res.success) setSeguimientos(res.data);
    };

    const handleAgregarSeg = async () => {
        if (!leadDetalle || !segForm.descripcion.trim()) return;
        const res = await agregarSeguimiento(leadDetalle.id, segForm);
        if (res.success) {
            notificar('Seguimiento registrado');
            setSegForm({ tipoContacto: 'LLAMADA', descripcion: '', realizadoPor: '' });
            const r2 = await getSeguimientosLead(leadDetalle.id);
            if (r2.success) setSeguimientos(r2.data);
        }
    };

    const leadsFiltrados = filtroEtapa === 'TODOS'
        ? leads
        : leads.filter(l => l.etapa === filtroEtapa);

    return (
        <div className="space-y-4">

            {msg && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-700 text-sm">
                    {msg}
                </div>
            )}

            {/* Encabezado */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                    {['TODOS', ...ETAPAS].map(e => (
                        <button
                            key={e}
                            onClick={() => setFiltroEtapa(e)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                ${filtroEtapa === e
                                    ? 'bg-[#606de5] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-[#606de5] text-white text-sm rounded-lg hover:bg-[#4f5bd1] transition-all"
                >
                    + Nuevo lead
                </button>
            </div>

            {/* Tabla */}
            {loading ? (
                <p className="text-gray-500 text-sm">Cargando leads...</p>
            ) : leadsFiltrados.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin leads en esta etapa.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded overflow-hidden">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Fuente</th>
                                <th className="p-3 text-left">Etapa</th>
                                <th className="p-3 text-left">Asignado a</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leadsFiltrados.map(lead => (
                                <tr key={lead.id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium">{lead.nombreCompleto}</td>
                                    <td className="p-3 text-gray-500">{lead.email ?? '—'}</td>
                                    <td className="p-3">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            {lead.fuente ?? '—'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <select
                                            value={lead.etapa}
                                            onChange={e => handleEtapa(lead, e.target.value)}
                                            className="text-xs border rounded px-2 py-1"
                                        >
                                            {ETAPAS.map(e => <option key={e}>{e}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3 text-gray-500">{lead.asignadoA ?? '—'}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => abrirDetalle(lead)}
                                                className="text-xs text-[#606de5] hover:underline"
                                            >
                                                Detalle
                                            </button>
                                            {lead.etapa !== 'CERRADO' && (
                                                <button
                                                    onClick={() => handleConvertir(lead.id)}
                                                    className="text-xs text-green-600 hover:underline"
                                                >
                                                    Convertir
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEliminar(lead.id)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal nuevo lead */}
            {showForm && (
                <Modal titulo="Nuevo lead" onClose={() => setShowForm(false)}>
                    <div className="space-y-3">
                        <Input label="Nombre completo *" value={form.nombreCompleto}
                            onChange={v => setForm(f => ({ ...f, nombreCompleto: v }))} />
                        <Input label="Email" value={form.email}
                            onChange={v => setForm(f => ({ ...f, email: v }))} />
                        <Input label="Teléfono" value={form.telefono}
                            onChange={v => setForm(f => ({ ...f, telefono: v }))} />
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Fuente</label>
                            <select
                                value={form.fuente}
                                onChange={e => setForm(f => ({ ...f, fuente: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                {FUENTES.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <Input label="Asignado a" value={form.asignadoA}
                            onChange={v => setForm(f => ({ ...f, asignadoA: v }))} />
                        <Input label="Fecha de visita" type="date" value={form.fechaVisita}
                            onChange={v => setForm(f => ({ ...f, fechaVisita: v }))} />
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Notas</label>
                            <textarea
                                rows={3}
                                value={form.notas}
                                onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-sm resize-none"
                            />
                        </div>
                        <button
                            onClick={handleCrear}
                            className="w-full py-2 bg-[#606de5] text-white rounded-lg text-sm hover:bg-[#4f5bd1]"
                        >
                            Crear lead
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modal detalle / seguimientos */}
            {leadDetalle && (
                <Modal titulo={`Seguimientos — ${leadDetalle.nombreCompleto}`} onClose={() => setLeadDetalle(null)}>
                    <div className="space-y-4">
                        {/* Info básica */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <span><strong>Etapa:</strong> {leadDetalle.etapa}</span>
                            <span><strong>Fuente:</strong> {leadDetalle.fuente}</span>
                            <span><strong>Email:</strong> {leadDetalle.email ?? '—'}</span>
                            <span><strong>Tel:</strong> {leadDetalle.telefono ?? '—'}</span>
                        </div>

                        {/* Historial */}
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {seguimientos.length === 0 ? (
                                <p className="text-xs text-gray-400">Sin seguimientos registrados.</p>
                            ) : seguimientos.map(s => (
                                <div key={s.id} className="border rounded p-2 text-xs bg-gray-50">
                                    <div className="flex justify-between text-gray-400 mb-1">
                                        <span className="font-medium text-gray-700">{s.tipoContacto}</span>
                                        <span>{s.fechaContacto?.slice(0, 10)}</span>
                                    </div>
                                    <p className="text-gray-600">{s.descripcion}</p>
                                    {s.realizadoPor && (
                                        <p className="text-gray-400 mt-1">Por: {s.realizadoPor}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Agregar seguimiento */}
                        <div className="border-t pt-3 space-y-2">
                            <p className="text-xs font-medium text-gray-600">Registrar contacto</p>
                            <select
                                value={segForm.tipoContacto}
                                onChange={e => setSegForm(f => ({ ...f, tipoContacto: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                {['LLAMADA', 'EMAIL', 'WHATSAPP', 'VISITA', 'NOTA'].map(t => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                            <Input label="Descripción *" value={segForm.descripcion}
                                onChange={v => setSegForm(f => ({ ...f, descripcion: v }))} />
                            <Input label="Realizado por" value={segForm.realizadoPor}
                                onChange={v => setSegForm(f => ({ ...f, realizadoPor: v }))} />
                            <button
                                onClick={handleAgregarSeg}
                                className="w-full py-2 bg-[#606de5] text-white rounded-lg text-sm hover:bg-[#4f5bd1]"
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── Helpers UI ────────────────────────────────────────────────────

function Modal({ titulo, onClose, children }: {
    titulo: string; onClose: () => void; children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b">
                    <h3 className="font-semibold text-gray-800">{titulo}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
    return (
        <div>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
            />
        </div>
    );
}
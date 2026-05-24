// src/pages/erp/marketing/PromocionesPage.tsx
import { useEffect, useState } from 'react';
import {
    getPromociones, crearPromocion,
    togglePromocion, eliminarPromocion, validarCodigo,
} from '../../../services/marketing.service';

interface Promocion {
    id: number;
    nombre: string;
    codigo: string;
    tipoDescuento: string;
    valor: number;
    fechaInicio: string | null;
    fechaFin: string | null;
    limiteUsosTotales: number | null;
    usosActuales: number;
    aplicaA: string;
    activo: boolean;
    descripcion: string;
}

export default function PromocionesPage() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [codigoValidar, setCodigoValidar] = useState('');
    const [resultadoValidacion, setResultadoValidacion] = useState<any>(null);
    const [msg, setMsg] = useState('');

    const [form, setForm] = useState({
        nombre: '', codigo: '', tipoDescuento: 'PORCENTAJE',
        valor: '', fechaInicio: '', fechaFin: '',
        limiteUsosTotales: '', usosPorPersona: '1',
        aplicaA: 'AMBOS', descripcion: '',
    });

    const cargar = () => {
        setLoading(true);
        getPromociones()
            .then(res => { if (res.success) setPromociones(res.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const notificar = (texto: string) => {
        setMsg(texto);
        setTimeout(() => setMsg(''), 3500);
    };

    const handleCrear = async () => {
        if (!form.nombre.trim() || !form.codigo.trim() || !form.valor)
            return notificar('Nombre, código y valor son requeridos');

        const res = await crearPromocion({
            nombre: form.nombre,
            codigo: form.codigo,
            tipoDescuento: form.tipoDescuento,
            valor: Number(form.valor),
            fechaInicio: form.fechaInicio || undefined,
            fechaFin: form.fechaFin || undefined,
            limiteUsosTotales: form.limiteUsosTotales ? Number(form.limiteUsosTotales) : undefined,
            usosPorPersona: Number(form.usosPorPersona),
            aplicaA: form.aplicaA,
            descripcion: form.descripcion,
        });

        if (res.success) {
            notificar('Promoción creada');
            setShowForm(false);
            setForm({
                nombre: '', codigo: '', tipoDescuento: 'PORCENTAJE', valor: '',
                fechaInicio: '', fechaFin: '', limiteUsosTotales: '',
                usosPorPersona: '1', aplicaA: 'AMBOS', descripcion: ''
            });
            cargar();
        } else {
            notificar(res.message);
        }
    };

    const handleToggle = async (id: number) => {
        const res = await togglePromocion(id);
        if (res.success) { notificar(res.message); cargar(); }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Eliminar esta promoción?')) return;
        const res = await eliminarPromocion(id);
        if (res.success) { notificar('Promoción eliminada'); cargar(); }
    };

    const handleValidar = async () => {
        if (!codigoValidar.trim()) return;
        const res = await validarCodigo(codigoValidar.trim());
        setResultadoValidacion(res);
    };

    const fmtValor = (p: Promocion) =>
        p.tipoDescuento === 'PORCENTAJE' ? `${p.valor}%` : `$${p.valor}`;

    return (
        <div className="space-y-4">

            {msg && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-700 text-sm">
                    {msg}
                </div>
            )}

            {/* Validador de código */}
            <div className="border rounded p-4 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Validar código</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ingresa el código..."
                        value={codigoValidar}
                        onChange={e => {
                            setCodigoValidar(e.target.value.toUpperCase());
                            setResultadoValidacion(null);
                        }}
                        className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button
                        onClick={handleValidar}
                        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
                    >
                        Validar
                    </button>
                </div>
                {resultadoValidacion && (
                    <div className={`mt-3 p-3 rounded text-sm ${resultadoValidacion.success
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {resultadoValidacion.success ? (
                            <>
                                <p className="font-medium">✓ Código válido</p>
                                <p>{resultadoValidacion.data?.nombre}</p>
                                <p>
                                    Descuento: {resultadoValidacion.data?.tipoDescuento === 'PORCENTAJE'
                                        ? `${resultadoValidacion.data?.valor}%`
                                        : `$${resultadoValidacion.data?.valor}`}
                                </p>
                                {resultadoValidacion.data?.limiteUsosTotales && (
                                    <p>
                                        Usos: {resultadoValidacion.data?.usosActuales} /{' '}
                                        {resultadoValidacion.data?.limiteUsosTotales}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>✗ {resultadoValidacion.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-[#606de5] text-white text-sm rounded-lg hover:bg-[#4f5bd1] transition-all"
                >
                    + Nueva promoción
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Cargando promociones...</p>
            ) : promociones.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin promociones registradas.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded overflow-hidden">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-3 text-left">Código</th>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Descuento</th>
                                <th className="p-3 text-left">Vigencia</th>
                                <th className="p-3 text-right">Usos</th>
                                <th className="p-3 text-left">Estado</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promociones.map(p => (
                                <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="p-3">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                                            {p.codigo}
                                        </span>
                                    </td>
                                    <td className="p-3 font-medium">{p.nombre}</td>
                                    <td className="p-3 text-[#606de5] font-semibold">{fmtValor(p)}</td>
                                    <td className="p-3 text-gray-500 text-xs">
                                        {p.fechaInicio ?? '—'} → {p.fechaFin ?? '—'}
                                    </td>
                                    <td className="p-3 text-right">
                                        {p.usosActuales}
                                        {p.limiteUsosTotales ? ` / ${p.limiteUsosTotales}` : ''}
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.activo
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggle(p.id)}
                                                className="text-xs text-yellow-600 hover:underline"
                                            >
                                                {p.activo ? 'Desactivar' : 'Activar'}
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(p.id)}
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

            {/* Modal nueva promoción */}
            {showForm && (
                <Modal titulo="Nueva promoción" onClose={() => setShowForm(false)}>
                    <div className="space-y-3">
                        <Input label="Nombre *" value={form.nombre}
                            onChange={v => setForm(f => ({ ...f, nombre: v }))} />
                        <Input
                            label="Código *"
                            value={form.codigo}
                            onChange={v => setForm(f => ({ ...f, codigo: v.toUpperCase() }))}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Tipo descuento</label>
                                <select
                                    value={form.tipoDescuento}
                                    onChange={e => setForm(f => ({ ...f, tipoDescuento: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="PORCENTAJE">Porcentaje (%)</option>
                                    <option value="MONTO_FIJO">Monto fijo ($)</option>
                                </select>
                            </div>
                            <Input
                                label={form.tipoDescuento === 'PORCENTAJE' ? 'Valor (%) *' : 'Valor ($) *'}
                                value={form.valor}
                                onChange={v => setForm(f => ({ ...f, valor: v }))}
                                type="number"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Fecha inicio" value={form.fechaInicio}
                                onChange={v => setForm(f => ({ ...f, fechaInicio: v }))} type="date" />
                            <Input label="Fecha fin" value={form.fechaFin}
                                onChange={v => setForm(f => ({ ...f, fechaFin: v }))} type="date" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Límite de usos" value={form.limiteUsosTotales}
                                onChange={v => setForm(f => ({ ...f, limiteUsosTotales: v }))} type="number" />
                            <Input label="Usos por persona" value={form.usosPorPersona}
                                onChange={v => setForm(f => ({ ...f, usosPorPersona: v }))} type="number" />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Aplica a</label>
                            <select
                                value={form.aplicaA}
                                onChange={e => setForm(f => ({ ...f, aplicaA: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="AMBOS">Ambos</option>
                                <option value="NUEVO">Solo nuevos</option>
                                <option value="RENOVACION">Solo renovación</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                            <textarea
                                rows={2}
                                value={form.descripcion}
                                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-sm resize-none"
                            />
                        </div>

                        <button
                            onClick={handleCrear}
                            className="w-full py-2 bg-[#606de5] text-white rounded-lg text-sm hover:bg-[#4f5bd1]"
                        >
                            Crear promoción
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

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
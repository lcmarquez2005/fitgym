// src/pages/erp/marketing/SegmentacionPage.tsx
import { useEffect, useState } from 'react';
import {
    getSegmentos, crearSegmento, ejecutarSegmento,
} from '../../../services/marketing.service';

interface Segmento {
    id: number;
    nombre: string;
    descripcion: string;
    criteriosJson: string;
    fechaCreacion: string;
    ultimaEjecucion: string | null;
    totalSociosMatch: number | null;
}

interface SocioMatch {
    id: number;
    nombreCompleto: string;
    email: string;
    tipoMembresia: string;
    estatus: string;
    fechaFin: string;
}

const PLANTILLAS = [
    {
        label: 'Socios activos Premium',
        criterios: { estatusSocio: 'ACTIVO', tipoMembresia: 'PREMIUM' },
    },
    {
        label: 'Por vencer en 7 días',
        criterios: { estatusSocio: 'ACTIVO', venceEnDias: 7 },
    },
    {
        label: 'Por vencer en 15 días',
        criterios: { estatusSocio: 'ACTIVO', venceEnDias: 15 },
    },
    {
        label: 'Ex-socios 30 días',
        criterios: { estatusSocio: 'INACTIVO', vencioHaceDias: 30 },
    },
    {
        label: 'Ex-socios 60 días',
        criterios: { estatusSocio: 'INACTIVO', vencioHaceDias: 60 },
    },
    {
        label: 'Todos los socios activos',
        criterios: { estatusSocio: 'ACTIVO' },
    },
];

export default function SegmentacionPage() {
    const [segmentos, setSegmentos] = useState<Segmento[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [resultado, setResultado] = useState<{ segmento: Segmento; socios: SocioMatch[] } | null>(null);
    const [ejecutando, setEjecutando] = useState<number | null>(null);
    const [msg, setMsg] = useState('');

    const [form, setForm] = useState({
        nombre: '', descripcion: '', criteriosJson: '{}',
    });

    // Criterios en modo visual
    const [criterios, setCriterios] = useState({
        estatusSocio: '', tipoMembresia: '', sexo: '',
        venceEnDias: '', vencioHaceDias: '',
    });

    const cargar = () => {
        setLoading(true);
        getSegmentos()
            .then(res => { if (res.success) setSegmentos(res.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    // Sincronizar criterios visuales → JSON
    useEffect(() => {
        const obj: Record<string, any> = {};
        if (criterios.estatusSocio) obj.estatusSocio = criterios.estatusSocio;
        if (criterios.tipoMembresia) obj.tipoMembresia = criterios.tipoMembresia;
        if (criterios.sexo) obj.sexo = criterios.sexo;
        if (criterios.venceEnDias) obj.venceEnDias = Number(criterios.venceEnDias);
        if (criterios.vencioHaceDias) obj.vencioHaceDias = Number(criterios.vencioHaceDias);
        setForm(f => ({ ...f, criteriosJson: JSON.stringify(obj) }));
    }, [criterios]);

    const notificar = (texto: string) => {
        setMsg(texto);
        setTimeout(() => setMsg(''), 3500);
    };

    const aplicarPlantilla = (plantilla: typeof PLANTILLAS[0]) => {
        setForm(f => ({ ...f, nombre: plantilla.label }));
        setCriterios({
            estatusSocio: (plantilla.criterios as any).estatusSocio ?? '',
            tipoMembresia: (plantilla.criterios as any).tipoMembresia ?? '',
            sexo: (plantilla.criterios as any).sexo ?? '',
            venceEnDias: (plantilla.criterios as any).venceEnDias ? String((plantilla.criterios as any).venceEnDias) : '',
            vencioHaceDias: (plantilla.criterios as any).vencioHaceDias ? String((plantilla.criterios as any).vencioHaceDias) : '',
        });
    };

    const handleCrear = async () => {
        if (!form.nombre.trim()) return notificar('El nombre es requerido');
        const res = await crearSegmento(form);
        if (res.success) {
            notificar('Segmento creado');
            setShowForm(false);
            setForm({ nombre: '', descripcion: '', criteriosJson: '{}' });
            setCriterios({ estatusSocio: '', tipoMembresia: '', sexo: '', venceEnDias: '', vencioHaceDias: '' });
            cargar();
        } else {
            notificar(res.message);
        }
    };

    const handleEjecutar = async (seg: Segmento) => {
        setEjecutando(seg.id);
        const res = await ejecutarSegmento(seg.id);
        setEjecutando(null);
        if (res.success) {
            setResultado({ segmento: seg, socios: res.data });
            cargar();
        } else {
            notificar(res.message);
        }
    };

    const parseCriterios = (json: string) => {
        try { return JSON.stringify(JSON.parse(json), null, 0); }
        catch { return json; }
    };

    return (
        <div className="space-y-4">

            {msg && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-700 text-sm">
                    {msg}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-[#606de5] text-white text-sm rounded-lg hover:bg-[#4f5bd1] transition-all"
                >
                    + Nuevo segmento
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Cargando segmentos...</p>
            ) : segmentos.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin segmentos registrados.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {segmentos.map(seg => (
                        <div key={seg.id} className="border rounded p-4 bg-white space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-gray-800">{seg.nombre}</p>
                                    {seg.descripcion && (
                                        <p className="text-xs text-gray-500 mt-0.5">{seg.descripcion}</p>
                                    )}
                                </div>
                                {seg.totalSociosMatch !== null && (
                                    <span className="text-xs bg-[#606de5] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                                        {seg.totalSociosMatch} socios
                                    </span>
                                )}
                            </div>

                            <p className="text-xs font-mono bg-gray-50 border rounded px-2 py-1 text-gray-500 truncate">
                                {parseCriterios(seg.criteriosJson)}
                            </p>

                            {seg.ultimaEjecucion && (
                                <p className="text-xs text-gray-400">
                                    Última ejecución: {seg.ultimaEjecucion.slice(0, 10)}
                                </p>
                            )}

                            <button
                                onClick={() => handleEjecutar(seg)}
                                disabled={ejecutando === seg.id}
                                className="w-full py-2 border border-[#606de5] text-[#606de5] text-sm rounded-lg
                           hover:bg-[#606de5] hover:text-white transition-all disabled:opacity-50"
                            >
                                {ejecutando === seg.id ? 'Ejecutando...' : 'Ejecutar segmento'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal nuevo segmento */}
            {showForm && (
                <Modal titulo="Nuevo segmento" onClose={() => setShowForm(false)}>
                    <div className="space-y-4">

                        {/* Plantillas */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Plantillas rápidas</p>
                            <div className="flex flex-wrap gap-2">
                                {PLANTILLAS.map(p => (
                                    <button
                                        key={p.label}
                                        onClick={() => aplicarPlantilla(p)}
                                        className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50 text-gray-600 transition-all"
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            <Input label="Nombre *" value={form.nombre}
                                onChange={v => setForm(f => ({ ...f, nombre: v }))} />
                            <Input label="Descripción" value={form.descripcion}
                                onChange={v => setForm(f => ({ ...f, descripcion: v }))} />

                            {/* Criterios visuales */}
                            <div className="border rounded p-3 bg-gray-50 space-y-3">
                                <p className="text-xs font-medium text-gray-600">Criterios de filtrado</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Estatus</label>
                                        <select
                                            value={criterios.estatusSocio}
                                            onChange={e => setCriterios(c => ({ ...c, estatusSocio: e.target.value }))}
                                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                                        >
                                            <option value="">Cualquiera</option>
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Membresía</label>
                                        <select
                                            value={criterios.tipoMembresia}
                                            onChange={e => setCriterios(c => ({ ...c, tipoMembresia: e.target.value }))}
                                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                                        >
                                            <option value="">Cualquiera</option>
                                            <option value="BASICO">Básico</option>
                                            <option value="PLUS">Plus</option>
                                            <option value="PREMIUM">Premium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Sexo</label>
                                        <select
                                            value={criterios.sexo}
                                            onChange={e => setCriterios(c => ({ ...c, sexo: e.target.value }))}
                                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                                        >
                                            <option value="">Cualquiera</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Vence en X días"
                                        value={criterios.venceEnDias}
                                        onChange={v => setCriterios(c => ({ ...c, venceEnDias: v, vencioHaceDias: '' }))}
                                        type="number"
                                    />
                                    <Input
                                        label="Venció hace X días"
                                        value={criterios.vencioHaceDias}
                                        onChange={v => setCriterios(c => ({ ...c, vencioHaceDias: v, venceEnDias: '' }))}
                                        type="number"
                                    />
                                </div>

                                <p className="text-xs font-mono bg-white border rounded px-2 py-1 text-gray-400">
                                    {form.criteriosJson}
                                </p>
                            </div>

                            <button
                                onClick={handleCrear}
                                className="w-full py-2 bg-[#606de5] text-white rounded-lg text-sm hover:bg-[#4f5bd1]"
                            >
                                Crear segmento
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal resultado ejecución */}
            {resultado && (
                <Modal
                    titulo={`Resultado — ${resultado.segmento.nombre} (${resultado.socios.length} socios)`}
                    onClose={() => setResultado(null)}
                >
                    {resultado.socios.length === 0 ? (
                        <p className="text-gray-400 text-sm">Ningún socio coincide con los criterios.</p>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {resultado.socios.map(s => (
                                <div key={s.id} className="flex items-center justify-between border rounded p-2 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">{s.nombreCompleto}</p>
                                        <p className="text-xs text-gray-500">{s.email ?? '—'}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-500">
                                        <p>{s.tipoMembresia}</p>
                                        <p>{s.fechaFin}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
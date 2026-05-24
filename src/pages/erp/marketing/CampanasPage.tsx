// src/pages/erp/marketing/CampanasPage.tsx
import { useEffect, useState } from 'react';
import {
  getCampanas, crearCampana, enviarCampana, eliminarCampana,
  getSegmentos,
} from '../../../services/marketing.service';

const TIPOS = ['MANUAL','BIENVENIDA','RETENCION','PRE_VENCIMIENTO','CUMPLEANIOS','RECUPERACION','EVENTO'];

interface Campana {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: string;
  asunto: string;
  contenidoHtml: string;
  segmentoId: number | null;
  totalEnviados: number;
  totalAbiertos: number;
  fechaCreacion: string;
  fechaEnvio: string | null;
  creadoPor: string;
}

interface Segmento {
  id: number;
  nombre: string;
}

export default function CampanasPage() {
  const [campanas, setCampanas]   = useState<Campana[]>([]);
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [enviando, setEnviando]   = useState<number | null>(null);
  const [msg, setMsg]             = useState('');

  const [form, setForm] = useState({
    nombre: '', descripcion: '', tipo: 'MANUAL',
    asunto: '', contenidoHtml: '', segmentoId: '' as string | number,
    creadoPor: '',
  });

  const cargar = () => {
    setLoading(true);
    Promise.all([getCampanas(), getSegmentos()]).then(([c, s]) => {
      if (c.success) setCampanas(c.data);
      if (s.success) setSegmentos(s.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const notificar = (texto: string) => {
    setMsg(texto);
    setTimeout(() => setMsg(''), 3500);
  };

  const handleCrear = async () => {
    if (!form.nombre.trim() || !form.asunto.trim())
      return notificar('Nombre y asunto son requeridos');

    const payload = {
      ...form,
      segmentoId: form.segmentoId !== '' ? Number(form.segmentoId) : null,
    };

    const res = await crearCampana(payload);
    if (res.success) {
      notificar('Campaña creada');
      setShowForm(false);
      setForm({ nombre:'', descripcion:'', tipo:'MANUAL', asunto:'',
                contenidoHtml:'', segmentoId:'', creadoPor:'' });
      cargar();
    } else {
      notificar(res.message);
    }
  };

  const handleEnviar = async (id: number) => {
    if (!confirm('¿Enviar esta campaña ahora a todos los destinatarios del segmento?')) return;
    setEnviando(id);
    const res = await enviarCampana(id);
    notificar(res.message);
    setEnviando(null);
    cargar();
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta campaña?')) return;
    const res = await eliminarCampana(id);
    if (res.success) { notificar('Campaña eliminada'); cargar(); }
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
          + Nueva campaña
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Cargando campañas...</p>
      ) : campanas.length === 0 ? (
        <p className="text-gray-400 text-sm">Sin campañas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Asunto</th>
                <th className="p-3 text-right">Enviados</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campanas.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">{c.nombre}</td>
                  <td className="p-3">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {c.tipo}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${badgeEstado(c.estado)}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 max-w-[200px] truncate">{c.asunto}</td>
                  <td className="p-3 text-right">{c.totalEnviados}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {c.estado !== 'FINALIZADA' && (
                        <button
                          onClick={() => handleEnviar(c.id)}
                          disabled={enviando === c.id}
                          className="text-xs text-[#606de5] hover:underline disabled:opacity-50"
                        >
                          {enviando === c.id ? 'Enviando...' : 'Enviar'}
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(c.id)}
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

      {/* Modal nueva campaña */}
      {showForm && (
        <Modal titulo="Nueva campaña" onClose={() => setShowForm(false)}>
          <div className="space-y-3">
            <Input label="Nombre *" value={form.nombre}
              onChange={v => setForm(f => ({ ...f, nombre: v }))} />
            <Input label="Asunto del email *" value={form.asunto}
              onChange={v => setForm(f => ({ ...f, asunto: v }))} />

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Segmento (opcional)</label>
              <select
                value={form.segmentoId}
                onChange={e => setForm(f => ({ ...f, segmentoId: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Todos los socios</option>
                {segmentos.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
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

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Contenido HTML{' '}
                <span className="text-gray-400">(opcional — usa {'{{nombre}}'} para personalizar)</span>
              </label>
              <textarea
                rows={5}
                value={form.contenidoHtml}
                onChange={e => setForm(f => ({ ...f, contenidoHtml: e.target.value }))}
                placeholder="<p>Hola {{nombre}}, tenemos algo especial para ti...</p>"
                className="w-full border rounded px-3 py-2 text-sm font-mono resize-none"
              />
            </div>

            <Input label="Creado por" value={form.creadoPor}
              onChange={v => setForm(f => ({ ...f, creadoPor: v }))} />

            <button
              onClick={handleCrear}
              className="w-full py-2 bg-[#606de5] text-white rounded-lg text-sm hover:bg-[#4f5bd1]"
            >
              Crear campaña
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function badgeEstado(estado: string): string {
  const map: Record<string, string> = {
    BORRADOR:   'bg-gray-100 text-gray-600',
    ACTIVA:     'bg-blue-100 text-blue-700',
    PAUSADA:    'bg-yellow-100 text-yellow-700',
    FINALIZADA: 'bg-green-100 text-green-700',
  };
  return map[estado] ?? 'bg-gray-100 text-gray-600';
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
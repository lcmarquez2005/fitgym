// src/pages/erp/finanzas/CajaPage.tsx
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  getCajaActual, abrirCaja, cerrarCaja,
  registrarTransaccion, getTransaccionesCaja,
} from '../../../services/finance.service';
import {
  LockOpen, Lock, TrendingUp, TrendingDown,
  DollarSign, RefreshCw, FileText, Plus, Minus
} from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────
interface Caja {
  id: number;
  estado: string;
  fechaHoraApertura: string;
  fechaHoraCierre: string | null;
  saldoInicial: number;
  saldoFinal: number | null;
  usuarioIdApertura: number;
}

interface Transaccion {
  id: number;
  tipo: string;
  categoria: string;
  descripcion: string;
  monto: number;
  fechaHora: string;
  requiereFactura: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────
const fmt = (n: number) =>
  (n ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const fmtHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const CATEGORIAS_INGRESO = ['MEMBRESIA', 'SUPLEMENTO', 'CLASE', 'OTRO'];
const CATEGORIAS_EGRESO = ['MANTENIMIENTO', 'NOMINA', 'RENTA', 'SERVICIOS', 'INVENTARIO', 'OTRO'];

// Agrupa transacciones por categoría para la gráfica
function buildCatData(txs: Transaccion[]) {
  const map: Record<string, { ingresos: number; egresos: number }> = {};
  txs.forEach(tx => {
    if (!map[tx.categoria]) map[tx.categoria] = { ingresos: 0, egresos: 0 };
    if (tx.tipo === 'INGRESO') map[tx.categoria].ingresos += tx.monto;
    else map[tx.categoria].egresos += tx.monto;
  });
  return Object.entries(map).map(([cat, v]) => ({ cat, ...v }));
}

export default function CajaPage() {
  const [caja, setCaja] = useState<Caja | null>(null);
  const [txs, setTxs] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ texto: string; tipo: 'ok' | 'err' } | null>(null);
  const [saldoInicial, setSaldoInicial] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filtro, setFiltro] = useState<'TODOS' | 'INGRESO' | 'EGRESO'>('TODOS');

  // Form transacción
  const [txTipo, setTxTipo] = useState('INGRESO');
  const [txCategoria, setTxCategoria] = useState('MEMBRESIA');
  const [txMonto, setTxMonto] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txFactura, setTxFactura] = useState(false);

  // ── Carga ────────────────────────────────────────────────────
  const cargar = async () => {
    setLoading(true);
    try {
      const resCaja = await getCajaActual();
      if (resCaja.success && resCaja.data) {
        setCaja(resCaja.data);
        const resTx = await getTransaccionesCaja();
        if (resTx.success) setTxs(resTx.data ?? []);
      } else {
        setCaja(null);
        setTxs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const notificar = (texto: string, tipo: 'ok' | 'err' = 'ok') => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 4000);
  };

  // ── Acciones caja ────────────────────────────────────────────
  const handleAbrir = async () => {
    const n = parseFloat(saldoInicial);
    if (isNaN(n) || n < 0) return notificar('Ingresa un saldo inicial válido', 'err');
    const res = await abrirCaja(n);
    notificar(res.message, res.success ? 'ok' : 'err');
    if (res.success) { setSaldoInicial(''); cargar(); }
  };

  const handleCerrar = async () => {
    if (!confirm('¿Confirmas el cierre de caja? Esta acción no se puede deshacer.')) return;
    const res = await cerrarCaja();
    notificar(res.message, res.success ? 'ok' : 'err');
    if (res.success) cargar();
  };

  // ── Registrar transacción ─────────────────────────────────────
  const handleTransaccion = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(txMonto);
    if (isNaN(monto) || monto <= 0) return notificar('Monto inválido', 'err');
    setSubmitting(true);
    const res = await registrarTransaccion({
      tipo: txTipo, categoria: txCategoria,
      monto, descripcion: txDesc, requiereFactura: txFactura,
    });
    notificar(res.message, res.success ? 'ok' : 'err');
    if (res.success) {
      setTxMonto(''); setTxDesc(''); setTxFactura(false);
      cargar();
    }
    setSubmitting(false);
  };

  // ── Métricas calculadas ───────────────────────────────────────
  const totalIngresos = txs.filter(t => t.tipo === 'INGRESO').reduce((a, t) => a + t.monto, 0);
  const totalEgresos = txs.filter(t => t.tipo === 'EGRESO').reduce((a, t) => a + t.monto, 0);
  const utilidad = totalIngresos - totalEgresos;
  const saldoActual = (caja?.saldoInicial ?? 0) + totalIngresos - totalEgresos;
  const catData = buildCatData(txs);
  const txsFiltradas = filtro === 'TODOS' ? txs : txs.filter(t => t.tipo === filtro);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#606de5] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando caja...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* ── Notificación ── */}
      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border
          ${msg.tipo === 'ok'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          {msg.texto}
        </div>
      )}

      {/* ── Estado de caja ── */}
      {!caja ? (
        // Caja cerrada
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Lock size={22} className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">No hay caja abierta</p>
              <p className="text-sm text-gray-400">Abre la caja para comenzar a registrar movimientos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                className="border rounded-lg pl-7 pr-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-[#606de5]"
                placeholder="Saldo inicial"
                value={saldoInicial}
                onChange={e => setSaldoInicial(e.target.value)}
              />
            </div>
            <button
              onClick={handleAbrir}
              className="flex items-center gap-2 px-4 py-2 bg-[#606de5] text-white text-sm
                         rounded-lg hover:bg-[#4f5bd1] transition-all font-medium"
            >
              <LockOpen size={15} />
              Abrir caja
            </button>
          </div>
        </div>
      ) : (
        // Caja abierta — header + KPIs
        <div className="space-y-4">

          {/* Banner estado */}
          <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm
                          flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <LockOpen size={22} className="text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">Caja abierta</p>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <p className="text-xs text-gray-400">
                  Apertura: {fmtFecha(caja.fechaHoraApertura)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cargar}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500
                           border rounded-lg hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={14} />
                Actualizar
              </button>
              <button
                onClick={handleCerrar}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white
                           text-sm rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                <Lock size={14} />
                Cerrar caja
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Saldo inicial"
              value={fmt(caja.saldoInicial)}
              icon={<DollarSign size={18} />}
              color="gray"
            />
            <KpiCard
              label="Total ingresos"
              value={fmt(totalIngresos)}
              icon={<TrendingUp size={18} />}
              color="green"
              sub={`${txs.filter(t => t.tipo === 'INGRESO').length} movimientos`}
            />
            <KpiCard
              label="Total egresos"
              value={fmt(totalEgresos)}
              icon={<TrendingDown size={18} />}
              color="red"
              sub={`${txs.filter(t => t.tipo === 'EGRESO').length} movimientos`}
            />
            <KpiCard
              label="Saldo actual"
              value={fmt(saldoActual)}
              icon={<DollarSign size={18} />}
              color={utilidad >= 0 ? 'blue' : 'red'}
              sub={`Utilidad: ${fmt(utilidad)}`}
            />
          </div>
        </div>
      )}

      {/* ── Contenido solo si hay caja abierta ── */}
      {caja && (
        <>
          {/* ── Fila: Gráfica + Formulario ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Gráfica por categoría */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="font-semibold text-gray-800 mb-1">Movimientos por categoría</p>
              <p className="text-xs text-gray-400 mb-4">Ingresos y egresos de esta caja</p>
              {catData.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Sin movimientos registrados</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={catData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }}
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: any) => fmt(v)} />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="egresos" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Formulario nueva transacción */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="font-semibold text-gray-800 mb-4">Registrar movimiento</p>
              <form onSubmit={handleTransaccion} className="space-y-3">

                {/* Toggle tipo */}
                <div className="flex rounded-lg border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setTxTipo('INGRESO'); setTxCategoria('MEMBRESIA'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all
                      ${txTipo === 'INGRESO'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <Plus size={14} /> Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTxTipo('EGRESO'); setTxCategoria('MANTENIMIENTO'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all
                      ${txTipo === 'EGRESO'
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <Minus size={14} /> Egreso
                  </button>
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
                  <select
                    value={txCategoria}
                    onChange={e => setTxCategoria(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none
                               focus:ring-2 focus:ring-[#606de5]"
                  >
                    {(txTipo === 'INGRESO' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO).map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Monto</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={txMonto}
                      onChange={e => setTxMonto(e.target.value)}
                      placeholder="0.00"
                      className="w-full border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none
                                 focus:ring-2 focus:ring-[#606de5]"
                      required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                  <input
                    type="text"
                    value={txDesc}
                    onChange={e => setTxDesc(e.target.value)}
                    placeholder="Ej. Juan Pérez — Plan Premium"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none
                               focus:ring-2 focus:ring-[#606de5]"
                  />
                </div>

                {/* Factura */}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={txFactura}
                    onChange={e => setTxFactura(e.target.checked)}
                    className="rounded"
                  />
                  <FileText size={14} className="text-gray-400" />
                  Requiere factura
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-2.5 text-white text-sm font-medium rounded-lg
                    transition-all disabled:opacity-50
                    ${txTipo === 'INGRESO'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  {submitting ? 'Registrando...' : `Registrar ${txTipo.toLowerCase()}`}
                </button>
              </form>
            </div>
          </div>

          {/* ── Historial de transacciones ── */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold text-gray-800">Historial de movimientos</p>
                <p className="text-xs text-gray-400">{txs.length} transacciones en esta caja</p>
              </div>
              {/* Filtros */}
              <div className="flex gap-2">
                {(['TODOS', 'INGRESO', 'EGRESO'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFiltro(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                      ${filtro === f
                        ? f === 'INGRESO'
                          ? 'bg-green-500 text-white'
                          : f === 'EGRESO'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#606de5] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {txsFiltradas.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm">Sin movimientos registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Hora</th>
                      <th className="px-5 py-3 text-left">Tipo</th>
                      <th className="px-5 py-3 text-left">Categoría</th>
                      <th className="px-5 py-3 text-left">Descripción</th>
                      <th className="px-5 py-3 text-center">Factura</th>
                      <th className="px-5 py-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...txsFiltradas].reverse().map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-400 font-mono text-xs">
                          {fmtHora(tx.fechaHora)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5
                            rounded-full text-xs font-medium
                            ${tx.tipo === 'INGRESO'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                            }`}>
                            {tx.tipo === 'INGRESO'
                              ? <Plus size={10} />
                              : <Minus size={10} />
                            }
                            {tx.tipo}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {tx.categoria}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">
                          {tx.descripcion || '—'}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {tx.requiereFactura
                            ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Sí</span>
                            : <span className="text-xs text-gray-300">—</span>
                          }
                        </td>
                        <td className={`px-5 py-3 text-right font-semibold
                          ${tx.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-500'}`}>
                          {tx.tipo === 'EGRESO' ? '−' : '+'}{fmt(tx.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Totales */}
                  <tfoot className="border-t-2 border-gray-100">
                    <tr className="bg-gray-50 font-semibold text-sm">
                      <td colSpan={4} className="px-5 py-3 text-gray-600">
                        Saldo inicial: {fmt(caja.saldoInicial)}
                      </td>
                      <td className="px-5 py-3 text-right text-green-600">
                        +{fmt(totalIngresos)}
                      </td>
                      <td className="px-5 py-3 text-right text-red-500">
                        −{fmt(totalEgresos)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-5 pb-3 text-gray-500 text-xs">
                        Saldo actual en caja
                      </td>
                      <td className={`px-5 pb-3 text-right font-bold text-base
                        ${saldoActual >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                        {fmt(saldoActual)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── KpiCard local ─────────────────────────────────────────────────
function KpiCard({ label, value, icon, color, sub }: {
  label: string; value: string; icon: React.ReactNode;
  color: string; sub?: string;
}) {
  const styles: Record<string, { border: string; icon: string }> = {
    green: { border: 'border-green-100', icon: 'bg-green-50 text-green-600' },
    red: { border: 'border-red-100', icon: 'bg-red-50 text-red-600' },
    blue: { border: 'border-blue-100', icon: 'bg-blue-50 text-blue-600' },
    gray: { border: 'border-gray-100', icon: 'bg-gray-50 text-gray-500' },
  };
  const s = styles[color] ?? styles.gray;
  return (
    <div className={`bg-white border ${s.border} rounded-xl p-4 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <div className={`p-2 rounded-lg ${s.icon}`}>{icon}</div>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
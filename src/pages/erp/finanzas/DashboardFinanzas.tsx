// src/pages/erp/finanzas/DashboardFinanzas.tsx
import { useEffect, useState, useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getDashboard } from '../../../services/finance.service';
import {
  TrendingUp, TrendingDown, DollarSign, AlertTriangle,
  Users, Clock, RefreshCw, Activity, Wifi, WifiOff
} from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────
interface TransaccionResumen {
  hora: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  monto: number;
}
interface SocioInfo {
  id: number;
  nombreCompleto: string;
  tipoMembresia: string;
  fechaFin: string;
  diasDeuda: number;
}
interface DashboardData {
  ingresosHoy: number;
  egresosHoy: number;
  utilidadHoy: number;
  cajaActual: number;
  cajaAbierta: boolean;
  ingresosSemanaActual: number;
  ingresosSemanaPasada: number;
  variacionSemanal: number;
  sociosQueVencenHoy: number;
  sociosConDeudaMas5Dias: number;
  membresiaFavorita: string;
  horaPico: string;
  ultimasTransacciones: TransaccionResumen[];
  sociosConDeuda: SocioInfo[];
  proximosVencimientos: SocioInfo[];
}

// ── Helpers ───────────────────────────────────────────────────────
const fmt = (n: number) =>
  (n ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const COLORS_PIE = ['#606de5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const COLORS_TXCAT = ['#606de5', '#10b981', '#f59e0b', '#ef4444'];

// Convierte las transacciones en datos para la gráfica de barras por hora
function buildHourlyData(txs: TransaccionResumen[]) {
  const map: Record<string, { hora: string; ingresos: number; egresos: number }> = {};
  txs.forEach(tx => {
    const h = tx.hora?.slice(0, 5) ?? '??:??';
    if (!map[h]) map[h] = { hora: h, ingresos: 0, egresos: 0 };
    if (tx.tipo === 'INGRESO') map[h].ingresos += tx.monto;
    else map[h].egresos += tx.monto;
  });
  return Object.values(map).sort((a, b) => a.hora.localeCompare(b.hora));
}

// Convierte transacciones en datos por categoría para el pie
function buildCategoryData(txs: TransaccionResumen[]) {
  const map: Record<string, number> = {};
  txs.filter(t => t.tipo === 'INGRESO').forEach(tx => {
    map[tx.categoria] = (map[tx.categoria] ?? 0) + tx.monto;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Comparativa semanal para el área chart
function buildWeeklyComparison(actual: number, pasada: number) {
  return [
    { semana: 'S. Pasada', monto: pasada },
    { semana: 'S. Actual', monto: actual },
  ];
}

export default function DashboardFinanzas() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [realtime, setRealtime] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cargar = () => {
    getDashboard()
      .then(res => {
        if (res.success) { setData(res.data); setLastUpdate(new Date()); }
        else setError(res.message);
      })
      .catch(() => setError('Error conectando al servidor'))
      .finally(() => setLoading(false));
  };

  // Carga inicial
  useEffect(() => { cargar(); }, []);

  // Tiempo real — polling cada 15 segundos
  useEffect(() => {
    if (realtime) {
      intervalRef.current = setInterval(cargar, 15000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [realtime]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#606de5] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        {error}
      </div>
    </div>
  );

  if (!data) return null;

  const hourlyData = buildHourlyData(data.ultimasTransacciones ?? []);
  const catData = buildCategoryData(data.ultimasTransacciones ?? []);
  const weeklyData = buildWeeklyComparison(data.ingresosSemanaActual, data.ingresosSemanaPasada);
  const variacionPos = data.variacionSemanal >= 0;

  return (
    <div className="p-6 space-y-6">

      {/* ── Encabezado con controles ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard Financiero</h2>
          {lastUpdate && (
            <p className="text-xs text-gray-400 mt-0.5">
              Actualizado: {lastUpdate.toLocaleTimeString('es-MX')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Botón recarga manual */}
          <button
            onClick={cargar}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border
                       rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={14} />
            Actualizar
          </button>

          {/* Toggle tiempo real */}
          <button
            onClick={() => setRealtime(r => !r)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all
              ${realtime
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
          >
            {realtime ? <Wifi size={14} /> : <WifiOff size={14} />}
            {realtime ? 'Tiempo real ON' : 'Tiempo real OFF'}
            {realtime && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ── Alertas ── */}
      {(data.sociosQueVencenHoy > 0 || data.sociosConDeudaMas5Dias > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 mb-1">Alertas del día</p>
            {data.sociosQueVencenHoy > 0 && (
              <p className="text-amber-700">
                • {data.sociosQueVencenHoy} membresía(s) vencen hoy
              </p>
            )}
            {data.sociosConDeudaMas5Dias > 0 && (
              <p className="text-amber-700">
                • {data.sociosConDeudaMas5Dias} socios con más de 5 días de deuda
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── KPIs principales ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos hoy"
          value={fmt(data.ingresosHoy)}
          icon={<DollarSign size={20} />}
          trend="up"
          color="green"
        />
        <KpiCard
          label="Egresos hoy"
          value={fmt(data.egresosHoy)}
          icon={<TrendingDown size={20} />}
          trend="down"
          color="red"
        />
        <KpiCard
          label="Utilidad hoy"
          value={fmt(data.utilidadHoy)}
          icon={<TrendingUp size={20} />}
          trend={data.utilidadHoy >= 0 ? 'up' : 'down'}
          color={data.utilidadHoy >= 0 ? 'blue' : 'red'}
        />
        <KpiCard
          label="Saldo en caja"
          value={fmt(data.cajaActual)}
          icon={<Activity size={20} />}
          sub={data.cajaAbierta ? '✓ Caja abierta' : '✗ Caja cerrada'}
          color={data.cajaAbierta ? 'purple' : 'gray'}
        />
      </div>

      {/* ── Fila 2: Comparativa semanal + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Comparativa semanal — área */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-800">Comparativa semanal</p>
              <p className="text-xs text-gray-400">Ingresos semana actual vs pasada</p>
            </div>
            <span className={`text-sm font-semibold flex items-center gap-1 px-2 py-1 rounded-full
              ${variacionPos ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {variacionPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {fmt(Math.abs(data.variacionSemanal))}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#606de5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#606de5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="monto" stroke="#606de5"
                strokeWidth={2} fill="url(#colorMonto)" name="Ingresos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats rápidos */}
        <div className="flex flex-col gap-4">
          <StatCard
            label="Membresía favorita"
            value={data.membresiaFavorita ?? '—'}
            icon={<Users size={16} />}
            color="purple"
          />
          <StatCard
            label="Hora pico"
            value={data.horaPico ?? '—'}
            icon={<Clock size={16} />}
            color="blue"
          />
          <StatCard
            label="Semana actual"
            value={fmt(data.ingresosSemanaActual)}
            icon={<TrendingUp size={16} />}
            color="green"
          />
          <StatCard
            label="Semana pasada"
            value={fmt(data.ingresosSemanaPasada)}
            icon={<Activity size={16} />}
            color="gray"
          />
        </div>
      </div>

      {/* ── Fila 3: Barras por hora + Pie por categoría ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Barras por hora */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-1">Flujo de caja del día</p>
          <p className="text-xs text-gray-400 mb-4">Ingresos y egresos por hora</p>
          {hourlyData.length === 0 ? (
            <EmptyChart mensaje="Sin transacciones registradas hoy" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="egresos" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie por categoría */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-1">Ingresos por categoría</p>
          <p className="text-xs text-gray-400 mb-4">Distribución del día</p>
          {catData.length === 0 ? (
            <EmptyChart mensaje="Sin datos de categorías" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={45}
                    outerRadius={70} paddingAngle={3} dataKey="value">
                    {catData.map((_, i) => (
                      <Cell key={i} fill={COLORS_TXCAT[i % COLORS_TXCAT.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {catData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full"
                        style={{ background: COLORS_TXCAT[i % COLORS_TXCAT.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-800">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tabla últimas transacciones ── */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <p className="font-semibold text-gray-800">Últimas transacciones del día</p>
        </div>
        {!data.ultimasTransacciones?.length ? (
          <p className="text-gray-400 text-sm p-5">Sin transacciones registradas hoy.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Hora</th>
                  <th className="px-5 py-3 text-left">Tipo</th>
                  <th className="px-5 py-3 text-left">Categoría</th>
                  <th className="px-5 py-3 text-left">Descripción</th>
                  <th className="px-5 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.ultimasTransacciones.map((tx, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{tx.hora}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${tx.tipo === 'INGRESO'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                        }`}>
                        {tx.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{tx.categoria}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">
                      {tx.descripcion}
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold
                      ${tx.tipo === 'INGRESO' ? 'text-green-700' : 'text-red-600'}`}>
                      {tx.tipo === 'EGRESO' ? '−' : '+'}{fmt(tx.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Socios con deuda ── */}
      {data.sociosConDeuda?.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">Socios con deuda vencida</p>
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
              {data.sociosConDeuda.length} socios
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Nombre</th>
                  <th className="px-5 py-3 text-left">Membresía</th>
                  <th className="px-5 py-3 text-left">Venció</th>
                  <th className="px-5 py-3 text-right">Días de deuda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.sociosConDeuda.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {s.nombreCompleto ?? '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {s.tipoMembresia ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{s.fechaFin}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold text-sm
                        ${s.diasDeuda > 10 ? 'text-red-600' : 'text-amber-600'}`}>
                        {s.diasDeuda} días
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componentes locales ───────────────────────────────────────────

function KpiCard({ label, value, icon, trend, color, sub }: {
  label: string; value: string; icon: React.ReactNode;
  trend?: 'up' | 'down'; color: string; sub?: string;
}) {
  const styles: Record<string, { card: string; icon: string }> = {
    green: { card: 'border-green-100', icon: 'bg-green-50 text-green-600' },
    red: { card: 'border-red-100', icon: 'bg-red-50 text-red-600' },
    blue: { card: 'border-blue-100', icon: 'bg-blue-50 text-blue-600' },
    purple: { card: 'border-purple-100', icon: 'bg-purple-50 text-purple-600' },
    gray: { card: 'border-gray-100', icon: 'bg-gray-50 text-gray-500' },
  };
  const s = styles[color] ?? styles.gray;

  return (
    <div className={`bg-white border ${s.card} rounded-xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <div className={`p-2 rounded-lg ${s.icon}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 font-medium
          ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string; value: string; icon: React.ReactNode; color: string;
}) {
  const iconColors: Record<string, string> = {
    purple: 'text-purple-500', blue: 'text-blue-500',
    green: 'text-green-500', gray: 'text-gray-400',
  };
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-3 flex-1">
      <div className={`${iconColors[color] ?? 'text-gray-400'} shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 truncate">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function EmptyChart({ mensaje }: { mensaje: string }) {
  return (
    <div className="h-40 flex items-center justify-center">
      <p className="text-sm text-gray-400">{mensaje}</p>
    </div>
  );
}
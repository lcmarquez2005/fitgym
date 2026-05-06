// src/pages/erp/finanzas/DashboardFinanzas.tsx
import { useEffect, useState } from 'react';
import { getDashboard } from '../../../services/finance.service';

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

const fmt = (n: number) =>
  n?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) ?? '$0.00';

export default function DashboardFinanzas() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message);
      })
      .catch(() => setError('Error conectando al servidor'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Cargando dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* ── KPIs del día ── */}
      <h2 className="text-xl font-bold text-gray-800">Dashboard Financiero — Hoy</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Ingresos Hoy" value={fmt(data.ingresosHoy)} color="green" />
        <KpiCard label="Egresos Hoy" value={fmt(data.egresosHoy)} color="red" />
        <KpiCard label="Utilidad Hoy" value={fmt(data.utilidadHoy)} color="blue" />
        <KpiCard
          label="Caja Actual"
          value={fmt(data.cajaActual)}
          color={data.cajaAbierta ? 'green' : 'gray'}
          sub={data.cajaAbierta ? '✅ Abierta' : '🔒 Cerrada'}
        />
      </div>

      {/* ── Comparativa semanal ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Esta Semana" value={fmt(data.ingresosSemanaActual)} color="blue" />
        <KpiCard label="Semana Pasada" value={fmt(data.ingresosSemanaPasada)} color="gray" />
        <KpiCard
          label="Variación"
          value={fmt(data.variacionSemanal)}
          color={data.variacionSemanal >= 0 ? 'green' : 'red'}
          sub={data.variacionSemanal >= 0 ? '↑ Mejor que la semana pasada' : '↓ Por debajo de la semana pasada'}
        />
      </div>

      {/* ── Alertas ── */}
      {(data.sociosQueVencenHoy > 0 || data.sociosConDeudaMas5Dias > 0) && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
          <p className="font-semibold text-yellow-800">⚠️ Alertas</p>
          {data.sociosQueVencenHoy > 0 && (
            <p className="text-yellow-700">• {data.sociosQueVencenHoy} membresía(s) vencen HOY</p>
          )}
          {data.sociosConDeudaMas5Dias > 0 && (
            <p className="text-yellow-700">• {data.sociosConDeudaMas5Dias} socios con más de 5 días de deuda</p>
          )}
        </div>
      )}

      {/* ── Stats adicionales ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Membresía Favorita" value={data.membresiaFavorita} />
        <InfoCard label="Hora Pico de Ingresos" value={data.horaPico} />
      </div>

      {/* ── Últimas transacciones ── */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Últimas transacciones del día</h3>
        {data.ultimasTransacciones?.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin transacciones registradas hoy.</p>
        ) : (
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Hora</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Categoría</th>
                <th className="p-2 text-left">Descripción</th>
                <th className="p-2 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.ultimasTransacciones.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{tx.hora}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.tipo}
                    </span>
                  </td>
                  <td className="p-2">{tx.categoria}</td>
                  <td className="p-2">{tx.descripcion}</td>
                  <td className="p-2 text-right font-medium">{fmt(tx.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Socios con deuda ── */}
      {data.sociosConDeuda?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Socios con deuda vencida ({data.sociosConDeuda.length})</h3>
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-red-50 text-gray-600">
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Membresía</th>
                <th className="p-2 text-left">Venció</th>
                <th className="p-2 text-right">Días de deuda</th>
              </tr>
            </thead>
            <tbody>
              {data.sociosConDeuda.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.nombreCompleto ?? '—'}</td>
                  <td className="p-2">{s.tipoMembresia ?? '—'}</td>
                  <td className="p-2">{s.fechaFin}</td>
                  <td className="p-2 text-right text-red-600 font-medium">{s.diasDeuda} días</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  const colors: Record<string, string> = {
    green: 'border-green-400 bg-green-50',
    red: 'border-red-400 bg-red-50',
    blue: 'border-blue-400 bg-blue-50',
    gray: 'border-gray-300 bg-gray-50',
  };
  return (
    <div className={`border-l-4 rounded p-4 ${colors[color] ?? colors.gray}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded p-4 bg-white">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

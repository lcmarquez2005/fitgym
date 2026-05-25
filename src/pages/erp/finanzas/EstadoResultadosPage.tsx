// src/pages/erp/finanzas/EstadoResultadosPage.tsx
import { useState } from 'react';
import { getEstadoResultados } from '../../../services/finance.service';

const fmt = (n: number) =>
  n?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) ?? '$0.00';

export default function EstadoResultadosPage() {
  const now = new Date();
  const [anio, setAnio] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getEstadoResultados(anio, mes);
      if (res.success) setData(res.data);
      else setError(res.message);
    } catch {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Estado de Resultados (P&amp;L)</h2>

      {/* Selector de periodo */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Año</label>
          <input
            type="number"
            className="border rounded px-3 py-2 text-sm w-24"
            value={anio}
            onChange={(e) => setAnio(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Mes (1-12)</label>
          <input
            type="number"
            min={1}
            max={12}
            className="border rounded px-3 py-2 text-sm w-20"
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
          />
        </div>
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Generar reporte'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {data && (
        <div className="border rounded bg-white divide-y text-sm">
          <Row label="Período" value={data.periodo} bold />
          <Row label="Rango" value={`${data.fechaInicio} → ${data.fechaFin}`} />
          <Row label="Total Transacciones" value={data.totalTransacciones} />

          <SectionHeader label="(+) INGRESOS" />
          <Row label="Membresías" value={fmt(data.ingresosPorMembresias)} indent />
          <Row label="Suplementos" value={fmt(data.ingresosPorSuplementos)} indent />
          <Row label="Clases" value={fmt(data.ingresosPorClases)} indent />
          <Row label="Otros Ingresos" value={fmt(data.otrosIngresos)} indent />
          <Row label="TOTAL INGRESOS" value={fmt(data.ingresosTotales)} bold />

          <SectionHeader label="(-) COSTOS DIRECTOS" />
          <Row label="Nómina" value={fmt(data.costosNomina)} indent />
          <Row label="Productos / Inventario" value={fmt(data.costosProductos)} indent />
          <Row label="Otros Costos" value={fmt(data.otrosCostos)} indent />
          <Row label="TOTAL COSTOS" value={fmt(data.costosTotales)} bold />

          <Row label="(=) UTILIDAD BRUTA" value={fmt(data.utilidadBruta)} bold highlight={data.utilidadBruta >= 0 ? 'green' : 'red'} />

          <SectionHeader label="(-) GASTOS OPERATIVOS" />
          <Row label="Renta + Servicios + Mantenimiento" value={fmt(data.gastosOperativos)} indent />

          <Row label="(=) UTILIDAD OPERATIVA (EBITDA)" value={fmt(data.utilidadOperativa)} bold highlight={data.utilidadOperativa >= 0 ? 'green' : 'red'} />

          <SectionHeader label="(-) ISR (30% sobre utilidad positiva)" />
          <Row label="ISR" value={fmt(data.isr)} indent />

          <Row label="(=) UTILIDAD NETA" value={fmt(data.utilidadNeta)} bold highlight={data.utilidadNeta >= 0 ? 'green' : 'red'} />
          <Row label="MARGEN NETO" value={`${data.margenNeto}%`} bold />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-600 text-xs uppercase tracking-wide">
      {label}
    </div>
  );
}

function Row({
  label, value, bold, indent, highlight,
}: {
  label: string;
  value: string | number;
  bold?: boolean;
  indent?: boolean;
  highlight?: 'green' | 'red';
}) {
  return (
    <div className={`flex justify-between px-4 py-2 ${indent ? 'pl-8' : ''} ${highlight === 'green' ? 'bg-green-50' : highlight === 'red' ? 'bg-red-50' : ''}`}>
      <span className={bold ? 'font-semibold' : 'text-gray-600'}>{label}</span>
      <span className={`${bold ? 'font-semibold' : ''} ${highlight === 'green' ? 'text-green-700' : highlight === 'red' ? 'text-red-700' : ''}`}>
        {value}
      </span>
    </div>
  );
}

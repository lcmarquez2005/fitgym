// src/pages/erp/finanzas/NominaPage.tsx
import { useState } from 'react';
import { generarNomina } from '../../../services/finance.service';

export default function NominaPage() {
  const [periodo, setPeriodo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodo || !fechaInicio || !fechaFin) return setError('Completa todos los campos');
    setLoading(true);
    setError('');
    try {
      const res = await generarNomina({ periodo, fechaInicio, fechaFin });
      if (res.success) setResultado(res.data);
      else setError(res.message);
    } catch {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Nómina Quincenal</h2>

      <form onSubmit={handleGenerar} className="border rounded p-4 bg-white space-y-3">
        <h3 className="font-semibold text-gray-700">Generar Nómina</h3>
        <p className="text-xs text-gray-500">
          El sistema calculará automáticamente el sueldo base (15 días), comisiones por ventas en caja e impuestos (ISR 10%, IMSS 2%) para cada empleado activo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nombre del Período</label>
            <input type="text" className="border rounded px-3 py-2 w-full" placeholder="Quincena 1 - Mayo 2026" value={periodo} onChange={e => setPeriodo(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fecha Inicio</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fecha Fin</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Generando nómina...' : 'Generar Nómina'}
        </button>
      </form>

      {/* Resultado de la nómina */}
      {resultado && (
        <div className="space-y-4">
          <div className="border rounded bg-green-50 p-4">
            <p className="font-semibold text-green-800">✅ {resultado.recibos?.length ?? 0} recibos generados — Período: {resultado.periodo}</p>
            <p className="text-sm text-gray-600">Estado: <span className="font-medium">{resultado.estado}</span></p>
          </div>

          {resultado.recibos?.map((recibo: any) => (
            <div key={recibo.id} className="border rounded bg-white overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 flex justify-between items-center">
                <span>{recibo.empleado?.nombreCompleto ?? `Empleado #${recibo.empleado?.id}`}</span>
                <span className="text-xs text-gray-500">{recibo.empleado?.puesto}</span>
              </div>
              <div className="p-4 text-sm space-y-1">
                <table className="w-full">
                  <tbody>
                    {recibo.detalles?.map((d: any, i: number) => (
                      <tr key={i} className={d.tipo === 'DEDUCCION' ? 'text-red-600' : 'text-green-700'}>
                        <td className="py-0.5">
                          <span className="text-xs font-medium mr-2">{d.tipo === 'PERCEPCION' ? '(+)' : '(-)'}</span>
                          {d.concepto}
                        </td>
                        <td className="text-right font-medium">
                          ${d.monto?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                  <span>NETO A PAGAR</span>
                  <span className="text-blue-700">${recibo.netoAPagar?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

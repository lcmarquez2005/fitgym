// src/pages/erp/finanzas/CajaPage.tsx
import { useEffect, useState } from 'react';
import {
  getCajaActual,
  abrirCaja,
  cerrarCaja,
  registrarTransaccion,
} from '../../../services/finance.service';

const CATEGORIAS_INGRESO = ['MEMBRESIA', 'SUPLEMENTO', 'CLASE', 'OTRO'];
const CATEGORIAS_EGRESO = ['MANTENIMIENTO', 'NOMINA', 'RENTA', 'SERVICIOS', 'INVENTARIO', 'OTRO'];

export default function CajaPage() {
  const [caja, setCaja] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [saldoInicial, setSaldoInicial] = useState('');

  // Formulario de transacción
  const [txTipo, setTxTipo] = useState('INGRESO');
  const [txCategoria, setTxCategoria] = useState('MEMBRESIA');
  const [txMonto, setTxMonto] = useState('');
  const [txDescripcion, setTxDescripcion] = useState('');
  const [txFactura, setTxFactura] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cargarCaja = () => {
    setLoading(true);
    getCajaActual()
      .then((res) => setCaja(res.success ? res.data : null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarCaja(); }, []);

  const handleAbrirCaja = async () => {
    const n = parseFloat(saldoInicial);
    if (isNaN(n)) return setMsg('Ingresa un saldo inicial válido');
    const res = await abrirCaja(n);
    setMsg(res.message);
    if (res.success) cargarCaja();
  };

  const handleCerrarCaja = async () => {
    if (!confirm('¿Confirmas el cierre de caja?')) return;
    const res = await cerrarCaja();
    setMsg(res.message);
    if (res.success) cargarCaja();
  };

  const handleTransaccion = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(txMonto);
    if (isNaN(monto) || monto <= 0) return setMsg('Monto inválido');
    setSubmitting(true);
    const res = await registrarTransaccion({
      tipo: txTipo,
      categoria: txCategoria,
      monto,
      descripcion: txDescripcion,
      requiereFactura: txFactura,
    });
    setMsg(res.message);
    if (res.success) {
      setTxMonto('');
      setTxDescripcion('');
      setTxFactura(false);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-6 text-gray-500">Cargando estado de caja...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Control de Caja</h2>

      {msg && (
        <div className="border rounded p-3 bg-blue-50 text-blue-800 text-sm">{msg}</div>
      )}

      {/* ── Estado de caja ── */}
      {!caja ? (
        <div className="border rounded p-6 bg-white space-y-3">
          <p className="text-gray-600 font-medium">No hay caja abierta actualmente.</p>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              className="border rounded px-3 py-2 text-sm w-40"
              placeholder="Saldo inicial"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
            />
            <button
              onClick={handleAbrirCaja}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Abrir Caja
            </button>
          </div>
        </div>
      ) : (
        <div className="border rounded p-6 bg-green-50 space-y-2">
          <p className="text-green-800 font-semibold text-lg">✅ Caja Abierta</p>
          <p className="text-sm text-gray-600">
            Apertura: {new Date(caja.fechaHoraApertura).toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-600">
            Saldo inicial: <strong>${caja.saldoInicial?.toLocaleString()}</strong>
          </p>
          <button
            onClick={handleCerrarCaja}
            className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Cerrar Caja
          </button>
        </div>
      )}

      {/* ── Registrar transacción ── */}
      {caja && (
        <div className="border rounded p-6 bg-white">
          <h3 className="font-semibold text-gray-700 mb-4">Registrar Transacción</h3>
          <form onSubmit={handleTransaccion} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tipo</label>
                <select
                  className="border rounded px-3 py-2 text-sm w-full"
                  value={txTipo}
                  onChange={(e) => {
                    setTxTipo(e.target.value);
                    setTxCategoria(e.target.value === 'INGRESO' ? 'MEMBRESIA' : 'MANTENIMIENTO');
                  }}
                >
                  <option value="INGRESO">INGRESO</option>
                  <option value="EGRESO">EGRESO</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Categoría</label>
                <select
                  className="border rounded px-3 py-2 text-sm w-full"
                  value={txCategoria}
                  onChange={(e) => setTxCategoria(e.target.value)}
                >
                  {(txTipo === 'INGRESO' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Monto</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 text-sm w-full"
                  placeholder="0.00"
                  value={txMonto}
                  onChange={(e) => setTxMonto(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Descripción</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 text-sm w-full"
                  placeholder="Ej. Juan Pérez - Plan Premium"
                  value={txDescripcion}
                  onChange={(e) => setTxDescripcion(e.target.value)}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={txFactura}
                onChange={(e) => setTxFactura(e.target.checked)}
              />
              Requiere factura
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

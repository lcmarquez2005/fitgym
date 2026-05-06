// src/pages/erp/finanzas/ImpuestosPage.tsx
import { useEffect, useState } from 'react';
import {
  crearPeriodoFiscal,
  getPeriodosFiscales,
  marcarPeriodoPresentado,
  calcularIVA,
  registrarISR,
  registrarDIOT,
} from '../../../services/finance.service';

export default function ImpuestosPage() {
  const [tab, setTab] = useState<'periodos' | 'iva' | 'isr' | 'diot'>('periodos');
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  // Formulario período fiscal
  const [pfNombre, setPfNombre] = useState('');
  const [pfTipo, setPfTipo] = useState('MENSUAL');
  const [pfInicio, setPfInicio] = useState('');
  const [pfFin, setPfFin] = useState('');
  const [pfLimite, setPfLimite] = useState('');

  // Formulario IVA
  const [ivaPeriodoId, setIvaPeriodoId] = useState('');
  const [ivaAcreditable, setIvaAcreditable] = useState('');
  const [ivaObs, setIvaObs] = useState('');

  // Formulario ISR
  const [isrPeriodoId, setIsrPeriodoId] = useState('');
  const [isrTipo, setIsrTipo] = useState('SUELDOS');
  const [isrNombre, setIsrNombre] = useState('');
  const [isrRFC, setIsrRFC] = useState('');
  const [isrBase, setIsrBase] = useState('');
  const [isrTasa, setIsrTasa] = useState('0.10');

  // Formulario DIOT
  const [diotMes, setDiotMes] = useState('');
  const [diotRFC, setDiotRFC] = useState('');
  const [diotNombre, setDiotNombre] = useState('');
  const [diotTipo, setDiotTipo] = useState('NACIONAL');
  const [diotMonto, setDiotMonto] = useState('');
  const [diotIVA, setDiotIVA] = useState('');
  const [diotConcepto, setDiotConcepto] = useState('');

  const cargarPeriodos = () => {
    getPeriodosFiscales().then((res) => {
      if (res.success) setPeriodos(res.data);
    });
  };

  useEffect(() => { cargarPeriodos(); }, []);

  const handleCrearPeriodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await crearPeriodoFiscal({ nombre: pfNombre, tipoPeriodo: pfTipo, fechaInicio: pfInicio, fechaFin: pfFin, fechaLimite: pfLimite });
    setMsg(res.message);
    if (res.success) cargarPeriodos();
  };

  const handleIVA = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await calcularIVA({ periodoFiscalId: parseInt(ivaPeriodoId), ivaAcreditable: parseFloat(ivaAcreditable), observaciones: ivaObs });
    setMsg(res.message);
  };

  const handleISR = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registrarISR({ periodoFiscalId: parseInt(isrPeriodoId), tipoRetencion: isrTipo, nombreBeneficiario: isrNombre, rfcBeneficiario: isrRFC, montoBase: parseFloat(isrBase), tasaAplicada: parseFloat(isrTasa) });
    setMsg(res.message);
  };

  const handleDIOT = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registrarDIOT({ mesDeclaracion: diotMes, rfcProveedor: diotRFC, nombreProveedor: diotNombre, tipoProveedor: diotTipo, montoOperacion: parseFloat(diotMonto), ivaAcreditable: parseFloat(diotIVA), concepto: diotConcepto });
    setMsg(res.message);
  };

  const tabs = [
    { key: 'periodos', label: 'Períodos Fiscales' },
    { key: 'iva', label: 'IVA' },
    { key: 'isr', label: 'Retenciones ISR' },
    { key: 'diot', label: 'DIOT' },
  ] as const;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Módulo de Impuestos</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && <div className="text-sm bg-blue-50 text-blue-800 border rounded p-3">{msg}</div>}

      {/* ── Períodos Fiscales ── */}
      {tab === 'periodos' && (
        <div className="space-y-4">
          <form onSubmit={handleCrearPeriodo} className="border rounded p-4 bg-white space-y-3">
            <h3 className="font-semibold text-gray-700">Nuevo Período Fiscal</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <Field label="Nombre" value={pfNombre} onChange={setPfNombre} placeholder="Mayo 2026" />
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tipo</label>
                <select className="border rounded px-3 py-2 w-full" value={pfTipo} onChange={e => setPfTipo(e.target.value)}>
                  <option value="MENSUAL">Mensual</option>
                  <option value="BIMESTRAL">Bimestral</option>
                  <option value="ANUAL">Anual</option>
                </select>
              </div>
              <Field label="Fecha Inicio" type="date" value={pfInicio} onChange={setPfInicio} />
              <Field label="Fecha Fin" type="date" value={pfFin} onChange={setPfFin} />
              <Field label="Fecha Límite SAT" type="date" value={pfLimite} onChange={setPfLimite} />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Crear Período</button>
          </form>

          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-left">Límite</th>
                  <th className="p-2 text-left">Estado</th>
                  <th className="p-2 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.nombre}</td>
                    <td className="p-2">{p.tipoPeriodo}</td>
                    <td className="p-2">{p.fechaLimite}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.estado === 'PRESENTADA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="p-2">
                      {p.estado !== 'PRESENTADA' && (
                        <button
                          onClick={async () => { const r = await marcarPeriodoPresentado(p.id); setMsg(r.message); cargarPeriodos(); }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Marcar presentada
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {periodos.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-gray-400">Sin períodos registrados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── IVA ── */}
      {tab === 'iva' && (
        <form onSubmit={handleIVA} className="border rounded p-4 bg-white space-y-3">
          <h3 className="font-semibold text-gray-700">Calcular IVA del Período</h3>
          <p className="text-xs text-gray-500">El IVA trasladado se calcula automáticamente de la caja. Solo ingresa el IVA acreditable (proveedores).</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="ID Período Fiscal" value={ivaPeriodoId} onChange={setIvaPeriodoId} placeholder="1" />
            <Field label="IVA Acreditable ($)" type="number" value={ivaAcreditable} onChange={setIvaAcreditable} placeholder="500.00" />
            <div className="col-span-2">
              <Field label="Observaciones" value={ivaObs} onChange={setIvaObs} placeholder="IVA suplementos, etc." />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Calcular IVA</button>
        </form>
      )}

      {/* ── ISR ── */}
      {tab === 'isr' && (
        <form onSubmit={handleISR} className="border rounded p-4 bg-white space-y-3">
          <h3 className="font-semibold text-gray-700">Registrar Retención ISR</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="ID Período Fiscal" value={isrPeriodoId} onChange={setIsrPeriodoId} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tipo Retención</label>
              <select className="border rounded px-3 py-2 w-full" value={isrTipo} onChange={e => setIsrTipo(e.target.value)}>
                <option value="SUELDOS">Sueldos (empleados)</option>
                <option value="ASIMILADOS">Asimilados (freelancers)</option>
                <option value="ARRENDAMIENTO">Arrendamiento (renta)</option>
              </select>
            </div>
            <Field label="Nombre Beneficiario" value={isrNombre} onChange={setIsrNombre} />
            <Field label="RFC Beneficiario" value={isrRFC} onChange={setIsrRFC} />
            <Field label="Monto Base ($)" type="number" value={isrBase} onChange={setIsrBase} />
            <Field label="Tasa (ej. 0.10 = 10%)" type="number" value={isrTasa} onChange={setIsrTasa} />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Registrar ISR</button>
        </form>
      )}

      {/* ── DIOT ── */}
      {tab === 'diot' && (
        <form onSubmit={handleDIOT} className="border rounded p-4 bg-white space-y-3">
          <h3 className="font-semibold text-gray-700">Registrar Proveedor DIOT</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Mes Declaración" value={diotMes} onChange={setDiotMes} placeholder="Mayo 2026" />
            <Field label="RFC Proveedor" value={diotRFC} onChange={setDiotRFC} />
            <Field label="Nombre Proveedor" value={diotNombre} onChange={setDiotNombre} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tipo</label>
              <select className="border rounded px-3 py-2 w-full" value={diotTipo} onChange={e => setDiotTipo(e.target.value)}>
                <option value="NACIONAL">Nacional</option>
                <option value="EXTRANJERO">Extranjero</option>
              </select>
            </div>
            <Field label="Monto Operación ($)" type="number" value={diotMonto} onChange={setDiotMonto} />
            <Field label="IVA Acreditable ($)" type="number" value={diotIVA} onChange={setDiotIVA} />
            <div className="col-span-2">
              <Field label="Concepto" value={diotConcepto} onChange={setDiotConcepto} placeholder="Suplementos, Mantenimiento..." />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Registrar en DIOT</button>
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <input type={type} className="border rounded px-3 py-2 text-sm w-full" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

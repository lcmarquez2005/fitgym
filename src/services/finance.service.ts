// src/services/finance.service.ts
import { BASE_URL } from './api.config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/finance/reportes/dashboard`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const getEstadoResultados = async (anio: number, mes: number) => {
  const res = await fetch(
    `${BASE_URL}/finance/reportes/estado-resultados?anio=${anio}&mes=${mes}`,
    { headers: getAuthHeaders() }
  );
  return res.json();
};

// ── Caja ──────────────────────────────────────────────────────────────────────
export const getCajaActual = async () => {
  const res = await fetch(`${BASE_URL}/finance/caja/actual`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const abrirCaja = async (saldoInicial: number) => {
  const res = await fetch(`${BASE_URL}/finance/caja/abrir`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ saldoInicial }),
  });
  return res.json();
};

export const cerrarCaja = async () => {
  const res = await fetch(`${BASE_URL}/finance/caja/cerrar`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const registrarTransaccion = async (data: {
  tipo: string;
  categoria: string;
  monto: number;
  descripcion: string;
  requiereFactura: boolean;
  empleadoId?: number;
}) => {
  const res = await fetch(`${BASE_URL}/finance/transaccion`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTransaccionesCaja = async () => {
  const res = await fetch(`${BASE_URL}/finance/caja/transacciones`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

// ── Impuestos ─────────────────────────────────────────────────────────────────
export const crearPeriodoFiscal = async (data: {
  nombre: string;
  tipoPeriodo: string;
  fechaInicio: string;
  fechaFin: string;
  fechaLimite: string;
}) => {
  const res = await fetch(`${BASE_URL}/finance/impuestos/periodos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getPeriodosFiscales = async (estado?: string) => {
  const url = estado
    ? `${BASE_URL}/finance/impuestos/periodos?estado=${estado}`
    : `${BASE_URL}/finance/impuestos/periodos`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

export const marcarPeriodoPresentado = async (id: number) => {
  const res = await fetch(
    `${BASE_URL}/finance/impuestos/periodos/${id}/presentada`,
    { method: 'PATCH', headers: getAuthHeaders() }
  );
  return res.json();
};

export const calcularIVA = async (data: {
  periodoFiscalId: number;
  ivaAcreditable: number;
  observaciones: string;
}) => {
  const res = await fetch(`${BASE_URL}/finance/impuestos/iva/calcular`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registrarISR = async (data: {
  periodoFiscalId: number;
  tipoRetencion: string;
  nombreBeneficiario: string;
  rfcBeneficiario: string;
  montoBase: number;
  tasaAplicada: number;
}) => {
  const res = await fetch(`${BASE_URL}/finance/impuestos/isr/retenciones`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registrarDIOT = async (data: {
  mesDeclaracion: string;
  rfcProveedor: string;
  nombreProveedor: string;
  tipoProveedor: string;
  montoOperacion: number;
  ivaAcreditable: number;
  concepto: string;
}) => {
  const res = await fetch(`${BASE_URL}/finance/impuestos/diot`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getDIOTPorMes = async (mes: string) => {
  const res = await fetch(
    `${BASE_URL}/finance/impuestos/diot?mes=${encodeURIComponent(mes)}`,
    { headers: getAuthHeaders() }
  );
  return res.json();
};

// ── Nómina ────────────────────────────────────────────────────────────────────
export const generarNomina = async (data: {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
}) => {
  const res = await fetch(`${BASE_URL}/finance/nomina/generar`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

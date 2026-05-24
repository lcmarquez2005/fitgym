// src/services/reportes.service.ts
import { BASE_URL } from './api.config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const getAuthHeadersDownload = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ── Bloque 1: Core Financiero ──────────────────────────────────────────────
export const getEstadoResultados = async (mes?: number, anio?: number) => {
  let url = `${BASE_URL}/finance/reportes/estado-resultados`;
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes.toString());
  if (anio) params.append('anio', anio.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

export const getBalanceGeneral = async () => {
  const res = await fetch(`${BASE_URL}/finance/reportes/balance-general`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
  return res.json();
};

export const getFlujoEfectivo = async (mes?: number, anio?: number) => {
  let url = `${BASE_URL}/finance/reportes/flujo-efectivo`;
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes.toString());
  if (anio) params.append('anio', anio.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

// ── Bloque 2: Operaciones ──────────────────────────────────────────────────
export const getOperacionesDiarias = async () => {
  const res = await fetch(`${BASE_URL}/finance/reportes/operaciones-diarias`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
  return res.json();
};

export const getCuentasPorCobrar = async () => {
  const res = await fetch(`${BASE_URL}/finance/reportes/cuentas-por-cobrar`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
  return res.json();
};

export const getAnalisisMembresias = async (mes?: number, anio?: number) => {
  let url = `${BASE_URL}/finance/reportes/membresias`;
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes.toString());
  if (anio) params.append('anio', anio.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

export const getVentasPorCategoria = async (mes?: number, anio?: number) => {
  let url = `${BASE_URL}/finance/reportes/ventas-categoria`;
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes.toString());
  if (anio) params.append('anio', anio.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

// ── Bloque 3: KPIs Predictivos ─────────────────────────────────────────────
export const getKpisPredictivos = async (mes?: number, anio?: number) => {
  let url = `${BASE_URL}/finance/reportes/kpis-predictivos`;
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes.toString());
  if (anio) params.append('anio', anio.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  return res.json();
};

// ── Funciones de Exportación (Descargas) ──────────────────────────────────
// Dado que fetch no descarga automáticamente archivos, usamos una técnica
// de convertir el Blob en un ObjectURL y forzar la descarga en el navegador.

export const downloadReport = async (endpoint: string, filename: string) => {
  try {
    const res = await fetch(`${BASE_URL}/finance/reportes/${endpoint}`, {
      headers: getAuthHeadersDownload(),
    });
    
    if (!res.ok) throw new Error('Error al descargar el archivo');
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error downloading:', error);
    return { success: false, message: error.message };
  }
};

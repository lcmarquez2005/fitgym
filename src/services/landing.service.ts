import { BASE_URL, handleResponse } from './api.config';

export interface IniciarRegistroRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  planId: number;
}

export interface IniciarRegistroResponse {
  checkoutUrl: string;
  sessionId: string;
  qrData: string;
  planNombre: string;
  monto: string;
}

export interface VerificarPagoResponse {
  estatus: 'PENDIENTE' | 'PAGADO' | 'EXPIRADO';
  socioId?: string | number;
  fechaFin?: string;
  email?: string;
  planNombre?: string;
}

export const LandingService = {
  iniciarRegistro: async (formData: IniciarRegistroRequest): Promise<IniciarRegistroResponse> => {
    const response = await fetch(`${BASE_URL}/landing/iniciar-registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const res = await handleResponse<{ success: boolean; data: IniciarRegistroResponse; message?: string }>(response);
    if (res.success && res.data) {
      return res.data;
    } else {
      throw new Error(res.message || 'Error al iniciar el registro de pago');
    }
  },

  verificarPago: async (sessionId: string): Promise<VerificarPagoResponse> => {
    const response = await fetch(`${BASE_URL}/landing/verificar-pago/${sessionId}`, {
      method: 'GET',
    });
    const res = await handleResponse<{ success: boolean; data: VerificarPagoResponse; message?: string }>(response);
    // Note: The response could be direct or nested inside success/data structure based on docs.
    // Doc L146-L154: `const response = await fetch(...); const data = await response.json(); if (data.data?.estatus === 'PAGADO')`
    // And L336-L338: `const res = await fetch(...); const data = await res.json(); data.data.email...`
    // So yes, it returns { success, data } or { data }. Let's handle both gracefully:
    if (res && res.data) {
      return res.data;
    }
    // Fallback if the endpoint returns data directly without wrapper
    return res as unknown as VerificarPagoResponse;
  },
};

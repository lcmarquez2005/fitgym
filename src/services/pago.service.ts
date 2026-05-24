import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';

export interface PagoRequest {
  idSocio: number | string;
  monto: number;
  mesesPagados: number;
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  plan: string;
}

export interface PagoResponse {
  pagoId: number;
  socio: string;
  nuevaFechaFin: string;
  montoPagado: number;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export const PagoService = {
  // POST /api/pagos/procesar
  procesarPago: async (pagoData: PagoRequest): Promise<ApiResponse<PagoResponse>> => {
    const response = await fetch(`${BASE_URL}/pagos/procesar`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    });

    return handleResponse<ApiResponse<PagoResponse>>(response);
  },
};

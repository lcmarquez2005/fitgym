import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';

export interface ClienteResumen {
    idSocio: string;
    nombreCompleto: string;
    estatus: string;
    tipoMembresia: string;
    fechaInicio: string;
    fechaFin: string;
    diasRestantes: number;
    mesPagado: string; // "Mayo", "Junio", etc.
    costoMensual: number;
    foto?: string;
}

export interface ErpResumen {
    totalUsuarios: number;
    inscritos: number;
    sinPagar: number;
    sociosActivos: number;
    sociosVencidos: number;
}

export const DashboardService = {
    getClienteResumen: async (): Promise<ClienteResumen> => {
        try {
            const response = await fetch(`${BASE_URL}/dashboard/cliente/resumen`, {
                headers: getAuthHeaders(),
            });
            return await handleResponse<ClienteResumen>(response);
        } catch (error) {
            console.warn("Error fetching real dashboard data, using fallback mockup", error);
            // Mockup data for fallback
            return {
                idSocio: "SOC-00123",
                nombreCompleto: "Usuario Demo",
                estatus: "ACTIVO",
                tipoMembresia: "MENSUAL",
                fechaInicio: "2024-05-01",
                fechaFin: "2024-06-01",
                diasRestantes: 15,
                mesPagado: new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date()),
                costoMensual: 500
            };
        }
    },

    getErpResumen: async (): Promise<ErpResumen> => {
        try {
            const response = await fetch(`${BASE_URL}/erp/dashboard/resumen`, {
                headers: getAuthHeaders(),
            });
            return await handleResponse<ErpResumen>(response);
        } catch (error) {
            console.warn("Error fetching real ERP dashboard data, using mockup fallback", error);
            return {
                totalUsuarios: 120,
                inscritos: 85,
                sinPagar: 12,
                sociosActivos: 73,
                sociosVencidos: 12
            };
        }
    }
};

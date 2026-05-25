import { BASE_URL, handleResponse } from './api.config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const ReservasService = {
    // ==========================================
    // SALONES
    // ==========================================
    getSalones: async () => {
        const response = await fetch(`${BASE_URL}/reservas/salones`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearSalon: async (data: any) => {
        const response = await fetch(`${BASE_URL}/reservas/salones`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    eliminarSalon: async (id: number) => {
        const response = await fetch(`${BASE_URL}/reservas/salones/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ==========================================
    // CATÁLOGO DE CLASES
    // ==========================================
    getCatalogo: async () => {
        const response = await fetch(`${BASE_URL}/reservas/catalogo`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearCatalogo: async (data: any) => {
        const response = await fetch(`${BASE_URL}/reservas/catalogo`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    eliminarCatalogo: async (id: number) => {
        const response = await fetch(`${BASE_URL}/reservas/catalogo/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ==========================================
    // PROGRAMACIÓN (HORARIOS)
    // ==========================================
    getHorario: async (inicio: string, fin: string) => {
        const response = await fetch(`${BASE_URL}/reservas/clases?inicio=${inicio}&fin=${fin}`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    programarClase: async (data: any) => {
        const response = await fetch(`${BASE_URL}/reservas/clases`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    cancelarClase: async (claseId: number) => {
        const response = await fetch(`${BASE_URL}/reservas/clases/${claseId}/cancelar`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // ==========================================
    // OPERATIVAS (RESERVAS)
    // ==========================================
    getReservasPorClase: async (claseId: number) => {
        const response = await fetch(`${BASE_URL}/reservas/clases/${claseId}/reservas`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    reservarClase: async (claseId: number, socioId: number) => {
        const response = await fetch(`${BASE_URL}/reservas/clases/${claseId}/reservar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ socioId })
        });
        return handleResponse(response);
    },
    cancelarReserva: async (reservaId: number) => {
        const response = await fetch(`${BASE_URL}/reservas/reservas/${reservaId}/cancelar`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },
    checkin: async (reservaId: number, asistio: boolean) => {
        const response = await fetch(`${BASE_URL}/reservas/reservas/${reservaId}/checkin`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ asistio })
        });
        return handleResponse(response);
    }
};

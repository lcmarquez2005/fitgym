import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';
import type { Socio, SocioFormData } from '../pages/client/SocioPage/types';

export interface ApiResponse {
    message: string;
    success: boolean;
    data: any;
}

export const SocioService = {
    // GET /api/socios/buscar?q={query}
    buscar: async (query: string): Promise<Socio[]> => {
        const response = await fetch(`${BASE_URL}/socios/buscar?q=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Error al buscar socios');
        }

        const json = await response.json();
        return Array.isArray(json) ? json : json.data ?? [];
    },

    // POST /api/socios
    crear: async (datos: SocioFormData): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/socios`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });
        return handleResponse<ApiResponse>(response);
    },

    // PUT /api/socios/{id}
    actualizar: async (id: string, datos: SocioFormData): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/socios/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });
        return handleResponse<ApiResponse>(response);
    },

    // DELETE /api/socios/{id}
    eliminar: async (id: string): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/socios/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse<ApiResponse>(response);
    }
};

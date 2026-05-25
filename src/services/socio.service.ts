import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';
import type { Socio, SocioFormData } from '@pages/client/SocioPage/types';

export interface ApiResponse {
    message: string;
    success: boolean;
    data: any;
}

export const SocioService = {
    // GET /api/socios - Obtener todos
    getAll: async (): Promise<Socio[]> => {
        try {
            const response = await fetch(`${BASE_URL}/socios/buscar?q=`, {
                headers: getAuthHeaders(),
            });
            const result = await handleResponse<Socio[] | ApiResponse>(response);
            const data = Array.isArray(result) ? result : (result.data as Socio[] ?? []);
            console.log("--- DEBUG SOCIO SERVICE (SEARCH ALL) ---", data);
            return data;
        } catch (e) {
            console.warn("Intento de búsqueda fallido, probando endpoint raíz...", e);
            const response = await fetch(`${BASE_URL}/socios`, {
                headers: getAuthHeaders(),
            });
            const result = await handleResponse<Socio[] | ApiResponse>(response);
            return Array.isArray(result) ? result : (result.data as Socio[] ?? []);
        }
    },

    // GET /api/socios/buscar?q={query}
    buscar: async (query: string): Promise<Socio[]> => {
        if (!query.trim()) return SocioService.getAll();

        const response = await fetch(`${BASE_URL}/socios/buscar?q=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse<Socio[] | ApiResponse>(response);
        const data = Array.isArray(result) ? result : (result.data as Socio[] ?? []);
        console.log(`--- DEBUG SOCIO SERVICE (SEARCH: ${query}) ---`, data);
        return data;
    },

    // POST /api/socios
    crear: async (datos: SocioFormData): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/socios`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mapFormDataToRequest(datos)),
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
            body: JSON.stringify(mapFormDataToRequest(datos)),
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
    },

    ascenderASocio: async (datosMembresia: Partial<SocioFormData>): Promise<ApiResponse> => {
        // En este backend, POST /api/socios con los datos del usuario 
        // realiza el ascenso automáticamente.
        return SocioService.crear(datosMembresia as SocioFormData);
    }
};

/**
 * Maps the frontend's SocioFormData to the structure expected by the backend's SocioRequest.
 * This is a crucial translation layer.
 * @param formData The data from the React form.
 * @returns An object formatted for the Spring Boot API.
 */
const mapFormDataToRequest = (formData: SocioFormData) => {
    // Split 'nombreCompleto' into 'name' and 'lastName' for the backend.
    const nameParts = formData.nombreCompleto.trim().split(' ');
    const name = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    return {
        // User-related fields
        name: name,
        lastName: lastName,
        email: formData.email,
        noControl: formData.idSocio, // Map idSocio from frontend to noControl for backend
        
        // Socio-specific fields
        tipoMembresia: formData.tipoMembresia,
        costoMensual: formData.costoMensual,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estatus: formData.estatus || 'ACTIVO',
        
        // Optional fields (if backend accepts them)
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        foto: formData.foto,
        huellaDigital: formData.huellaDigital,
        contactoEmergencia: formData.contactoEmergencia,
        telefonoEmergencia: formData.telefonoEmergencia,
        descuento: formData.descuento,
        lesiones: formData.lesiones,
        alergias: formData.alergias,
        extras: formData.extras,
    };
};

import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';
import type { Socio, SocioFormData } from '@pages/client/SocioPage/types';

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

        // Usar handleResponse para consistencia en el manejo de errores y respuestas
        const result = await handleResponse<Socio[] | ApiResponse>(response);
        return Array.isArray(result) ? result : (result.data as Socio[] ?? []);
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
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        foto: formData.foto,

        // Socio-specific fields
        idSocio: formData.idSocio,
        contactoEmergencia: formData.contactoEmergencia,
        telefonoEmergencia: formData.telefonoEmergencia,
        tipoMembresia: formData.tipoMembresia,
        descuento: formData.descuento,
        costoMensual: formData.costoMensual,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estatus: formData.estatus,
        lesiones: formData.lesiones,
        alergias: formData.alergias,
        extras: formData.extras,
    };
};

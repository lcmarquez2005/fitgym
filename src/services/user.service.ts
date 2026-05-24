// src/services/user.service.ts
import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';

export interface User {
    id: number;
    name: string;
    lastName: string;
    noControl: string;
    fotoPerfil: string;
    huellaDigital: string;
    rol: string;
    email?: string;
}

export interface UserPost {
    name: string;
    lastName: string;
    noControl: string;
    email: string;
    fotoPerfil: string;
    huellaDigital: string;
    rol: string;
    token?: string | null;
}

export interface ApiResponse {
    message: string;
    success: boolean;
    data: any;
}

export const UserService = {
    // Petición GET para obtener todos los usuarios
    getAll: async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<User[]>(response);
    },

    // Petición GET para un solo usuario
    //   getById: async (id: number): Promise<User> => {
    //     const response = await fetch(`${BASE_URL}/users/${id}`, {
    //       headers: getAuthHeaders(),
    //     });
    //     return handleResponse<User>(response);
    //   }
    search: async (query: string): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Error en la búsqueda');

        return await response.json();
    },

    create: async (userData: UserPost): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear usuario');
        }

        return await response.json();
    },

    update: async (id: number, userData: Partial<UserPost>): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar usuario');
        }

        return await response.json();
    },

    uploadPhoto: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/users/upload-photo`, {
            method: 'POST',
            headers, // No enviamos Content-Type para que el navegador ponga multipart/form-data
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = 'Error al subir la foto';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // Si no es JSON (como el 403 Forbidden que reportas)
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    }
};
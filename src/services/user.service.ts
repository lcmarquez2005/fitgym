// src/services/user.service.ts
import { BASE_URL, handleResponse } from './api.config';

export interface User {
    id: number;
    name: string;
    lastName: string;
    noControl: string;
    fotoPerfil: string;
    huellaDigital: string;
    rol: string;
}

export interface UserPost {
    name: string;
    lastName: string;
    noControl: string;
    fotoPerfil: string;
    huellaDigital: string;
    rol: string;
}

export interface ApiResponse {
    message: string;
    success: boolean;
    data: any;
}
export const UserService = {
    // Petición GET para obtener todos los usuarios
    getAll: async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users`);
        return handleResponse<User[]>(response);
    },

    // Petición GET para un solo usuario
    //   getById: async (id: number): Promise<User> => {
    //     const response = await fetch(`${BASE_URL}/users/${id}`);
    //     return handleResponse<User>(response);
    //   }
    search: async (query: string): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) throw new Error('Error en la búsqueda');

        return await response.json();
    },

    create: async (userData: UserPost): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // OBLIGATORIO para que Spring entienda el JSON
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear usuario');
        }

        return await response.json();
    }
};
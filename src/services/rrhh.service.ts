import { BASE_URL, handleResponse } from './api.config';

// Interfaces
export interface EmpleadoFinance {
    id: number;
    usuario: {
        id: number;
        name: string;
        lastName: string;
        email: string;
        rol: string;
    };
    puesto: string;
    tipoContrato: string;
    sueldoBaseDiario: number;
    porcentajeComision: number;
    activo: boolean;
}

export interface UsuarioSinFicha {
    id: number;
    name: string;
    lastName: string;
    email: string;
    rol: string;
}

// Configuración de headers con Token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const RRHHService = {
    // Listar todos los empleados con ficha activa
    getEmpleados: async () => {
        const response = await fetch(`${BASE_URL}/empleados`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Usuarios del ERP sin ficha de nómina
    getUsuariosSinFicha: async () => {
        const response = await fetch(`${BASE_URL}/empleados/sin-ficha`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Crear ficha de nómina
    crearFicha: async (data: any) => {
        const response = await fetch(`${BASE_URL}/empleados`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Actualizar ficha de nómina
    actualizarFicha: async (id: number, data: any) => {
        const response = await fetch(`${BASE_URL}/empleados/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};

import { BASE_URL, handleResponse } from './api.config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const InventarioService = {
    // ==========================================
    // CATEGORÍAS
    // ==========================================
    getCategorias: async () => {
        const response = await fetch(`${BASE_URL}/inventario/categorias`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearCategoria: async (data: any) => {
        const response = await fetch(`${BASE_URL}/inventario/categorias`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // ==========================================
    // EQUIPOS
    // ==========================================
    getEquipos: async () => {
        const response = await fetch(`${BASE_URL}/inventario/equipos`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearEquipo: async (data: any) => {
        const response = await fetch(`${BASE_URL}/inventario/equipos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // ==========================================
    // PROVEEDORES
    // ==========================================
    getProveedores: async () => {
        const response = await fetch(`${BASE_URL}/inventario/proveedores`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearProveedor: async (data: any) => {
        const response = await fetch(`${BASE_URL}/inventario/proveedores`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // ==========================================
    // SUPLEMENTOS
    // ==========================================
    getSuplementos: async () => {
        const response = await fetch(`${BASE_URL}/inventario/suplementos`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    crearSuplemento: async (data: any) => {
        const response = await fetch(`${BASE_URL}/inventario/suplementos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    getStockBajo: async () => {
        const response = await fetch(`${BASE_URL}/inventario/suplementos/stock-bajo`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    venderSuplemento: async (id: number, cantidad: number) => {
        const response = await fetch(`${BASE_URL}/inventario/suplementos/${id}/vender`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cantidad })
        });
        return handleResponse(response);
    },
    reabastecerSuplemento: async (id: number, cantidad: number) => {
        const response = await fetch(`${BASE_URL}/inventario/suplementos/${id}/reabastecer`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cantidad })
        });
        return handleResponse(response);
    },

    // ==========================================
    // MANTENIMIENTOS
    // ==========================================
    getMantenimientosPorEquipo: async (equipoId: number) => {
        const response = await fetch(`${BASE_URL}/inventario/mantenimiento/equipo/${equipoId}`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    registrarMantenimiento: async (data: any) => {
        const response = await fetch(`${BASE_URL}/inventario/mantenimiento`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};

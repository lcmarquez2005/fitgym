import { BASE_URL } from './api.config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

// ── Dashboard ─────────────────────────────────────────────────────
export const getMarketingDashboard = async () => {
    const res = await fetch(`${BASE_URL}/marketing/dashboard`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

// ── Leads ─────────────────────────────────────────────────────────
export const getLeads = async () => {
    const res = await fetch(`${BASE_URL}/marketing/leads`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const getLeadPorId = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const crearLead = async (data: {
    nombreCompleto: string;
    email: string;
    telefono: string;
    fuente: string;
    notas?: string;
    asignadoA?: string;
    fechaVisita?: string;
}) => {
    const res = await fetch(`${BASE_URL}/marketing/leads`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const actualizarEtapaLead = async (id: number, etapa: string, nota?: string) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}/etapa`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ etapa, nota }),
    });
    return res.json();
};

export const convertirLead = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}/convertir`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const eliminarLead = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const getSeguimientosLead = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}/seguimientos`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const agregarSeguimiento = async (id: number, data: {
    tipoContacto: string;
    descripcion: string;
    realizadoPor?: string;
}) => {
    const res = await fetch(`${BASE_URL}/marketing/leads/${id}/seguimientos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

// ── Campañas ──────────────────────────────────────────────────────
export const getCampanas = async () => {
    const res = await fetch(`${BASE_URL}/marketing/campanas`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const crearCampana = async (data: {
    nombre: string;
    descripcion?: string;
    tipo: string;
    asunto: string;
    contenidoHtml?: string;
    segmentoId?: number | null;
    creadoPor?: string;
}) => {
    const res = await fetch(`${BASE_URL}/marketing/campanas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const enviarCampana = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/campanas/${id}/enviar`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const eliminarCampana = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/campanas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
};

// ── Campañas automatizadas ────────────────────────────────────────
export const ejecutarBienvenida = async (socioId: number) => {
    const res = await fetch(`${BASE_URL}/marketing/automatizadas/bienvenida/${socioId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const ejecutarPreVencimiento = async () => {
    const res = await fetch(`${BASE_URL}/marketing/automatizadas/pre-vencimiento`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const ejecutarRecuperacion = async () => {
    const res = await fetch(`${BASE_URL}/marketing/automatizadas/recuperacion`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const ejecutarCumpleanios = async () => {
    const res = await fetch(`${BASE_URL}/marketing/automatizadas/cumpleanios`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

// ── Promociones ───────────────────────────────────────────────────
export const getPromociones = async () => {
    const res = await fetch(`${BASE_URL}/marketing/promociones`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const crearPromocion = async (data: {
    nombre: string;
    codigo: string;
    tipoDescuento: string;
    valor: number;
    fechaInicio?: string;
    fechaFin?: string;
    limiteUsosTotales?: number;
    usosPorPersona?: number;
    aplicaA?: string;
    descripcion?: string;
}) => {
    const res = await fetch(`${BASE_URL}/marketing/promociones`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const validarCodigo = async (codigo: string) => {
    const res = await fetch(`${BASE_URL}/marketing/promociones/validar/${codigo}`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const usarCodigo = async (codigo: string) => {
    const res = await fetch(`${BASE_URL}/marketing/promociones/usar/${codigo}`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const togglePromocion = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/promociones/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const eliminarPromocion = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/promociones/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
};

// ── Segmentos ─────────────────────────────────────────────────────
export const getSegmentos = async () => {
    const res = await fetch(`${BASE_URL}/marketing/segmentos`, {
        headers: getAuthHeaders(),
    });
    return res.json();
};

export const crearSegmento = async (data: {
    nombre: string;
    descripcion?: string;
    criteriosJson: string;
}) => {
    const res = await fetch(`${BASE_URL}/marketing/segmentos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const ejecutarSegmento = async (id: number) => {
    const res = await fetch(`${BASE_URL}/marketing/segmentos/${id}/ejecutar`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
};
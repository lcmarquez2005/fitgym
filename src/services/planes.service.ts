// src/services/planes.service.ts
import { BASE_URL, handleResponse } from './api.config';
import { getAuthHeaders } from './auth.headers';

export interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string[];
  activo: boolean;
}

// Interfaz para representar cómo se envían y reciben los datos desde el backend real
export interface ApiPlan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string | null; // El backend espera un String único delimitado por comas
  activo: boolean;
}

// Datos hardcodeados para desarrollo inicial y fallback
export const HARDCODED_PLANES: Plan[] = [
  {
    id: 1,
    nombre: "Plan Fit Básico",
    descripcion: "Ideal para empezar tu camino fitness.",
    precio: 300.00,
    duracionMeses: 1,
    beneficios: ["Acceso a pesas", "Área de cardio", "1 sesión con coach"],
    activo: true
  },
  {
    id: 2,
    nombre: "Plan Premium",
    descripcion: "Para los que buscan resultados reales.",
    precio: 450.00,
    duracionMeses: 1,
    beneficios: ["Acceso total 24/7", "Clases grupales", "Plan nutricional", "Sauna"],
    activo: true
  },
  {
    id: 3,
    nombre: "Plan Pro",
    descripcion: "La experiencia completa de FitGym.",
    precio: 550.00,
    duracionMeses: 1,
    beneficios: ["Todo lo del Plan Premium", "Entrenador personal", "Masajes semanales", "Bebidas incluidas"],
    activo: true
  }
];

// Mapeador de API -> Frontend
const mapApiToFrontend = (apiPlan: ApiPlan): Plan => {
  let beneficiosArray: string[] = [];
  if (apiPlan.beneficios) {
    beneficiosArray = apiPlan.beneficios
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);
  }
  return {
    id: apiPlan.id,
    nombre: apiPlan.nombre,
    descripcion: apiPlan.descripcion,
    precio: apiPlan.precio,
    duracionMeses: apiPlan.duracionMeses,
    beneficios: beneficiosArray,
    activo: apiPlan.activo
  };
};

// Mapeador de Frontend -> API
const mapFrontendToApi = (plan: Omit<Plan, 'id'> | Partial<Plan>): Partial<ApiPlan> => {
  const apiPlan: Partial<ApiPlan> = {};
  
  if (plan.nombre !== undefined) apiPlan.nombre = plan.nombre;
  if (plan.descripcion !== undefined) apiPlan.descripcion = plan.descripcion;
  if (plan.precio !== undefined) apiPlan.precio = plan.precio;
  if (plan.duracionMeses !== undefined) apiPlan.duracionMeses = plan.duracionMeses;
  if (plan.activo !== undefined) apiPlan.activo = plan.activo;
  
  if (plan.beneficios !== undefined) {
    apiPlan.beneficios = plan.beneficios.join(', ');
  }
  
  return apiPlan;
};

export const PlanesService = {
  // GET: Obtener todos los planes (PÚBLICO / REQ AUTH SI DISPONIBLE)
  getAll: async (): Promise<Plan[]> => {
    try {
      const response = await fetch(`${BASE_URL}/planes`, {
        headers: getAuthHeaders(),
      });
      const apiPlanes = await handleResponse<ApiPlan[]>(response);
      return (apiPlanes || []).map(mapApiToFrontend);
    } catch (error) {
      console.warn("Backend no disponible, usando datos hardcodeados", error);
      return HARDCODED_PLANES;
    }
  },

  // GET: Obtener por ID (PÚBLICO / REQ AUTH SI DISPONIBLE)
  getById: async (id: number): Promise<Plan> => {
    const response = await fetch(`${BASE_URL}/planes/${id}`, {
      headers: getAuthHeaders(),
    });
    const apiPlan = await handleResponse<ApiPlan>(response);
    return mapApiToFrontend(apiPlan);
  },

  // POST: Crear plan (PRIVADO - ADMIN)
  create: async (plan: Omit<Plan, 'id'>): Promise<Plan> => {
    const response = await fetch(`${BASE_URL}/planes`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mapFrontendToApi(plan))
    });
    const apiPlan = await handleResponse<ApiPlan>(response);
    return mapApiToFrontend(apiPlan);
  },

  // PUT: Actualizar plan (PRIVADO - ADMIN)
  update: async (id: number, plan: Partial<Plan>): Promise<Plan> => {
    const response = await fetch(`${BASE_URL}/planes/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mapFrontendToApi(plan))
    });
    const apiPlan = await handleResponse<ApiPlan>(response);
    return mapApiToFrontend(apiPlan);
  },

  // DELETE: Eliminar/Desactivar plan (PRIVADO - ADMIN)
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/planes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el plan');
    }
  }
};

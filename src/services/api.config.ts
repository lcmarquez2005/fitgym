// src/services/api.config.ts
import { clearToken } from "./auth.headers";

// En el futuro esto vendrá de un .env, por ahora lo dejamos fijo
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080' + '/api';

export const handleResponse = async <T = any>(response: Response): Promise<T> => {
  // Si el token es inválido o ha expirado, el servidor responderá con 401 o 403.
  // En ese caso, limpiamos el token y recargamos la página para forzar el login.
  if (response.status === 401 || response.status === 403) {
    clearToken();
    // Usamos location.reload() para forzar una recarga completa,
    // lo que llevará al usuario a la página de login si la ruta está protegida.
    window.location.reload();
    throw new Error('Sesión inválida o expirada. Por favor, inicia sesión de nuevo.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }
  return response.json();
};
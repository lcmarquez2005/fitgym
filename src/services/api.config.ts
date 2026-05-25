// src/services/api.config.ts
import { clearToken } from "./auth.headers";

// En el futuro esto vendrá de un .env, por ahora lo dejamos fijo
export const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Si el token es inválido (401), limpiamos y recargamos
    if (response.status === 401) {
      clearToken();
      window.location.reload();
      throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
    }

    let errorMessage = 'Error en la petición';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch (e) {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

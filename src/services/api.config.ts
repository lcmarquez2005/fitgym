// src/services/api.config.ts
import { clearToken } from "./auth.headers";

// FORZAMOS LOCALHOST para debugging, ignorando variables de entorno que están "pegadas"
export const BASE_URL = 'http://localhost:8080/api';

console.log('--- DEBUG API CONFIG (FORCED) ---');
console.log('BASE_URL hardcoded to:', BASE_URL);
console.log('------------------------');

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
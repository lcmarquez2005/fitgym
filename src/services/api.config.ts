// src/services/api.config.ts
import { clearToken } from "./auth.headers";

// En el futuro esto vendrá de un .env, por ahora lo dejamos fijo
export const BASE_URL = import.meta.env.VITE_API_URL || '/api';
console.log('DEBUG: BASE_URL is', BASE_URL);
console.log('DEBUG: VITE_API_URL is', import.meta.env.VITE_API_URL);

export const handleResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Si es una ruta pública (autenticación o chequeo de kiosko), un 401/403 es una falla esperada (ej: credenciales incorrectas, no verificado).
    // No debe gatillar expiración de sesión ni recarga de página.
    const isPublicRoute = response.url.includes('/auth/') || 
                          response.url.includes('/socios/check-user/') ||
                          response.url.includes('/users/upload-photo');

    // Si el token privado es inválido o ha expirado, el servidor responderá con 401 o 403.
    if ((response.status === 401 || response.status === 403) && !isPublicRoute) {
      clearToken();
      // Usamos location.reload() para forzar una recarga completa,
      // lo que llevará al usuario a la página de login si la ruta está protegida.
      window.location.reload();
      throw new Error('Sesión inválida o expirada. Por favor, inicia sesión de nuevo.');
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

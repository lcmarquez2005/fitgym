// src/services/api.config.ts

// En el futuro esto vendrá de un .env, por ahora lo dejamos fijo
export const BASE_URL = 'http://localhost:8080/api';

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la petición');
  }
  return response.json();
};
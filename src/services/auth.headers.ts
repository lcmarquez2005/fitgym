// src/services/auth.headers.ts
/**
 * Utility to add Bearer token to request headers
 * Automatically retrieves token from localStorage
 */

export const getAuthHeaders = (additionalHeaders?: Record<string, string>) => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...additionalHeaders,
    };
};

/**
 * Alternative: Get token directly if you need it elsewhere
 */
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

/**
 * Clear token (for logout)
 */
export const clearToken = (): void => {
    localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

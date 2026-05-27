// src/services/auth.service.ts
import { BASE_URL, handleResponse } from './api.config';

// Tipos de TypeScript (Interfaces)
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    message: string;
    success: boolean;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            rol: string;
            enabled: boolean;
        };
    } | null;
}

export interface ApiResponse {
    message: string;
    success: boolean;
    data: any;
}

export const AuthService = {
    // POST /api/auth/register
    register: async (data: RegisterRequest): Promise<ApiResponse> => {
        const payload = {
            fullName: `${data.name} ${data.lastName}`.trim(),
            email: data.email,
            password: data.password
        };
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return handleResponse<ApiResponse>(response);
    },

    // GET /api/auth/verify-email?token=xxx
    verifyEmail: async (token: string): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`);
        return handleResponse<ApiResponse>(response);
    },

    // POST /api/auth/login
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<AuthResponse>(response);
    },

    // POST /api/auth/forgot-password
    forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<ApiResponse>(response);
    },

    // POST /api/auth/reset-password
    resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<ApiResponse>(response);
    },

    // PUT /api/auth/change-password (requiere token)
    changePassword: async (data: ChangePasswordRequest, token: string): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return handleResponse<ApiResponse>(response);
    },

    // DELETE /api/auth/delete-account (requiere token)
    deleteAccount: async (password: string, token: string): Promise<ApiResponse> => {
        const response = await fetch(`${BASE_URL}/auth/delete-account?password=${encodeURIComponent(password)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<ApiResponse>(response);
    },
};
// src/guard/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles?: string[]; // Roles permitidos (opcional)
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Mientras carga, mostrar spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/register" replace />;
    }

    // Si hay roles especificados, verificar que el usuario tenga uno de ellos
    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />; // O a una página de "No autorizado"
    }

    // Todo bien, mostrar la página protegida
    return children;
};
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to redirect authenticated users away from auth pages
 * Use this in login, register, forgot-password, etc. pages
 * 
 * @param redirectTo - Where to redirect authenticated users (default: '/erp')
 */
export const useAuthRedirect = (redirectTo: string = '/erp') => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectTo]);
};

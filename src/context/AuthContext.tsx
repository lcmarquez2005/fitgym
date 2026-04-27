// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definir qué info guardamos del usuario
interface User {
    id: number;
    name: string;
    email: string;
    rol: string;
}

// 2. Definir qué tiene el contexto
interface AuthContextType {
    user: User | null;           // Datos del usuario logueado
    token: string | null;        // JWT
    isAuthenticated: boolean;    // ¿Está logueado?
    isLoading: boolean;          // ¿Estamos cargando?
    login: (userData: User, token: string) => void;  // Guardar sesión
    logout: () => void;          // Cerrar sesión
}

// 3. Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Provider (envuelve toda la app)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Empieza cargando

    // 5. Al montar el componente, revisar localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false); // Ya terminó de cargar
    }, []);

    // 6. Función login: guarda en estado y localStorage
    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 7. Función logout: limpia todo
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // 8. Valor que compartimos a toda la app
    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token, // true si hay token
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 9. Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
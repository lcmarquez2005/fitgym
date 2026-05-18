// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService, type LoginRequest } from '@services/auth.service';
import { useAuth } from '@context/AuthContext';
import { useAuthRedirect } from '@hooks/useAuthRedirect';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Redirect authenticated users to ERP
    useAuthRedirect();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await AuthService.login(formData);

        if (response.success && response.data) {
            // Guardar en contexto
            login(response.data.user, response.data.token);
            
            // Redirigir SIEMPRE al ERP
            navigate('/erp');
        } else {
            setError(response.message || 'Error al iniciar sesión');
        }
    } catch (err: any) {
        setError(err.message || 'Error de conexión');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm space-y-2">
                    <p>
                        <Link to="/forgot-password" className="text-indigo-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </p>
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-indigo-600 hover:underline font-bold">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
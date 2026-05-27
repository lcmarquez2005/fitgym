// src/pages/auth/ResetPasswordPage.tsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthService } from '@services/auth.service';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';
    const portal = searchParams.get('portal') || 'client';

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await AuthService.resetPassword({ token, newPassword });
            if (response.success) {
                setMessage('Contraseña actualizada. Redirigiendo al login...');
                setTimeout(() => navigate(portal === 'erp' ? '/erp/login' : '/login'), 2000);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Token no válido o expirado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Nueva Contraseña</h2>

                {message && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">
                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};
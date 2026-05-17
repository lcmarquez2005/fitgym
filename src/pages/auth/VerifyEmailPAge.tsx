// src/pages/auth/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [debugInfo, setDebugInfo] = useState(''); // Para debug

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token no proporcionado en la URL.');
                return;
            }

            setDebugInfo(`Verificando token: ${token.substring(0, 20)}...`);

            try {
                const response = await AuthService.verifyEmail(token);
                console.log('📥 Respuesta del backend:', response);
                setDebugInfo(prev => prev + `\nRespuesta: ${JSON.stringify(response)}`);
                
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || 'Email verificado exitosamente.');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Error al verificar email.');
                }
            } catch (err: any) {
                console.error('❌ Error:', err);
                setDebugInfo(prev => prev + `\nError: ${err.message}`);
                setStatus('error');
                setMessage(err.message || 'Error de conexión con el servidor.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Verificando email...</h2>
                        <p className="text-gray-500 mt-2">Por favor espera un momento.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-green-600">¡Email Verificado!</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-red-600">Error de Verificación</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        
                        {/* Debug info en desarrollo */}
                        {debugInfo && (
                            <details className="mt-4 text-left">
                                <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
                                <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                                    {debugInfo}
                                </pre>
                            </details>
                        )}
                        
                        <div className="mt-6 space-y-2">
                            <Link
                                to="/login"
                                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Ir al Login
                            </Link>
                            <br />
                            <Link
                                to="/register"
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                ¿No tienes cuenta? Regístrate
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
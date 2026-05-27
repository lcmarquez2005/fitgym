import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService, type LoginRequest } from '@services/auth.service';
import { useAuth } from '@context/AuthContext';
import { ArrowLeft, LogIn, Sparkles } from 'lucide-react';
import logoImage from '@assets/logo.png';

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, isAuthenticated } = useAuth();
    const planPending = location.state?.planPendingSelection;
    const isErpLogin = location.pathname.startsWith('/erp');

    // Redirección en base a rol y estado al montar si ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isAuthenticated && user && token) {
            const role = user.rol.toUpperCase();
            
            // Si están en el portal de clientes pero son admins, o en el del erp pero son socios
            if (!isErpLogin && (role === 'ADMIN' || role === 'COACH')) {
                navigate('/erp');
            } else if (isErpLogin && (role === 'USER' || role === 'SOCIO')) {
                navigate('/dashboard');
            } else {
                if (planPending) {
                    navigate('/checkout', { state: { plan: planPending } });
                } else if (role === 'ADMIN' || role === 'COACH') {
                    navigate('/erp');
                } else {
                    navigate('/dashboard');
                }
            }
        }
    }, [isAuthenticated, user, planPending, navigate, isErpLogin]);

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
                const targetUser = response.data.user;
                const role = targetUser.rol.toUpperCase();
                
                // Si están en el portal de clientes (/login) pero es un administrador/entrenador, bloquear acceso
                if (!isErpLogin && (role === 'ADMIN' || role === 'COACH')) {
                    setError('Acceso no permitido: Las cuentas administrativas deben iniciar sesión desde el portal del ERP.');
                    setLoading(false);
                    return;
                }

                // Guardar en contexto
                login(response.data.user, response.data.token);
                
                if (planPending) {
                    navigate('/checkout', { state: { plan: planPending } });
                } else if (role === 'ADMIN' || role === 'COACH') {
                    navigate('/erp');
                } else {
                    navigate('/dashboard');
                }
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
        <div className="min-h-screen flex items-center justify-center bg-[#F6F8FE] font-inter p-4">
            {/* Botón Volver - Estilo circular como el de la Sidebar */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-8 left-8 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 text-black active:scale-95 flex items-center gap-2 group"
                aria-label="Volver al inicio"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="pr-2 font-semibold hidden md:block">Volver</span>
            </button>

            <div 
                className="bg-white p-10 rounded-[32px] w-full max-w-md border border-gray-100 relative"
                style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)" }}
            >
                {/* Logo y Encabezado */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-[#F6F8FE] rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                        <img src={logoImage} alt="FitGym Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-[32px] font-bakbak text-black uppercase leading-tight">
                        {isErpLogin ? "ERP Access" : "Iniciar Sesión"}
                    </h2>
                    <p className="text-gray-500 font-medium mt-2">
                        {isErpLogin ? "Accede al portal administrativo de FitGym" : "Accede a tu panel de socio de FitGym"}
                    </p>
                </div>

                {planPending && (
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-black">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#606DE5] flex items-center justify-center text-white shrink-0 shadow-md">
                                <Sparkles size={18} className="animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-[#606DE5] uppercase tracking-widest block">Membresía Seleccionada</span>
                                <span className="font-bold text-sm text-gray-800">{planPending.nombre}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 block uppercase">Total</span>
                            <span className="font-extrabold text-sm text-indigo-600">MXN {planPending.precio.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-4 bg-[#F6F8FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#606DE5] transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-[#606DE5] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-4 bg-[#F6F8FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#606DE5] transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#606DE5] text-white rounded-[20px] font-bakbak text-xl hover:bg-[#4f5bd1] transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={22} />
                                <span>ENTRAR</span>
                            </>
                        )}
                    </button>
                </form>

                {!isErpLogin && (
                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-500 font-medium">
                            ¿No tienes cuenta todavía?{' '}
                            <Link to="/register" className="text-[#606DE5] hover:underline font-bold ml-1">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService, type RegisterRequest } from '@services/auth.service';
import { ArrowLeft, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';
import logoImage from '@assets/logo.png';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const planPending = location.state?.planPendingSelection;

    const [formData, setFormData] = useState<RegisterRequest>({
        name: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // El backend por defecto debería asignar el ROL 'USER' a registros públicos
            const response = await AuthService.register(formData);
            if (response.success) {
                setMessage(response.message);
            } else {
                setError(response.message || 'Error al registrarse');
            }
        } catch (err: any) {
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F8FE] font-inter p-4">
            {/* Botón Volver */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-8 left-8 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 text-black active:scale-95 flex items-center gap-2 group"
                aria-label="Volver al inicio"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="pr-2 font-semibold hidden md:block">Volver</span>
            </button>

            <div 
                className="bg-white p-10 rounded-[32px] w-full max-w-xl border border-gray-100 relative"
                style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)" }}
            >
                {/* Logo y Encabezado */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-[#F6F8FE] rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                        <img src={logoImage} alt="FitGym Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-[32px] font-bakbak text-black uppercase leading-tight">Crear Cuenta</h2>
                    <p className="text-gray-500 font-medium mt-2">Únete a la comunidad FitGym</p>
                </div>

                {message ? (
                    <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[24px] mb-6 flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={48} className="text-green-500" />
                        <div>
                            <p className="font-bold text-lg mb-1">{message}</p>
                            <p className="text-sm opacity-90">
                            </p>
                        </div>
                        <Link 
                            to="/login" 
                            state={{ planPendingSelection: planPending }}
                            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                        >
                            IR AL LOGIN
                        </Link>
                    </div>
                ) : (
                    <>
                        {planPending && (
                            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-black">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#606DE5] flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Sparkles size={18} />
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nombre(s)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-[#F6F8FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#606DE5] transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
                                        placeholder="Juan"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Apellidos</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-[#F6F8FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#606DE5] transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
                                        placeholder="Pérez"
                                        required
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#F6F8FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#606DE5] transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#606DE5] text-white rounded-[20px] font-bakbak text-xl hover:bg-[#4f5bd1] transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 uppercase tracking-widest"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus size={22} />
                                        <span>REGISTRARSE</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {!message && (
                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-500 font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" state={{ planPendingSelection: planPending }} className="text-[#606DE5] hover:underline font-bold ml-1">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
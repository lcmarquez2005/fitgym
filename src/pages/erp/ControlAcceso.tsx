import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Search, Loader2 } from 'lucide-react';
import { BASE_URL } from '@/services/api.config';
import { toast } from 'sonner';
import logoImage from '@assets/logo.png';

interface CheckResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    lastName: string;
    fotoPerfil: string;
    noControl: string;
    fechaFin: string;
    rol: string;
  };
}

const ControlAcceso: React.FC = () => {
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus para agilizar la entrada (lectores de código de barras actúan como teclado)
  useEffect(() => {
    inputRef.current?.focus();
  }, [result]);

  const handleCheck = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!identificador.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}/socios/check-user/${identificador}`);
      const data: CheckResponse = await response.json();
      setResult(data);

      if (data.success) {
        // Sonido de éxito (opcional)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/439/439-preview.mp3');
        audio.play().catch(() => {});
      } else {
        // Sonido de error (opcional)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/441/441-preview.mp3');
        audio.play().catch(() => {});
      }
    } catch (error) {
      toast.error("Error de conexión con el kiosco");
    } finally {
      setLoading(false);
      setIdentificador('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FE] font-inter flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col items-center gap-8">
        
        {/* Header Kiosco */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-gray-100">
            <img src={logoImage} alt="FitGym" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-4xl font-bakbak text-black uppercase tracking-tight">CONTROL DE ACCESO</h1>
            <p className="text-gray-500 font-medium italic mt-2">Bienvenido a FitGym - Desliza tu tarjeta o usa tu huella</p>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white w-full rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col items-center relative overflow-hidden">
          
          {/* Formulario de Entrada */}
          <form onSubmit={handleCheck} className="w-full max-w-lg relative z-10">
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="Identificador (Nro Control / Huella)"
                className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 transition-all outline-none text-xl font-bold text-center placeholder:text-gray-300 shadow-inner"
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                {loading ? (
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                ) : (
                  <button type="submit" className="p-2 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-100">
                    <Search size={24} />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Resultado del Check */}
          <div className="mt-12 w-full min-h-[200px] flex items-center justify-center">
            {!result && !loading && (
              <div className="flex flex-col items-center text-gray-300 gap-4 opacity-50">
                <Fingerprint size={120} className="animate-pulse" />
                <span className="text-xl font-bakbak">ESPERANDO ESCANEO...</span>
              </div>
            )}

            {result && (
              <div className={`w-full flex flex-col md:flex-row items-center gap-8 p-8 rounded-[32px] animate-in fade-in zoom-in duration-300 ${result.success ? 'bg-green-50 border-2 border-green-100' : 'bg-red-50 border-2 border-red-100'}`}>
                {/* Foto / Icono */}
                <div className="relative">
                  {result.data?.fotoPerfil ? (
                    <img 
                      src={result.data.fotoPerfil.startsWith('http') ? result.data.fotoPerfil : `${BASE_URL.replace('/api', '')}${result.data.fotoPerfil}`} 
                      className="w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl"
                      alt="Socio"
                    />
                  ) : (
                    <div className={`w-40 h-40 rounded-3xl flex items-center justify-center ${result.success ? 'bg-green-200' : 'bg-red-200'}`}>
                      {result.success ? <ShieldCheck size={80} className="text-green-600" /> : <ShieldAlert size={80} className="text-red-600" />}
                    </div>
                  )}
                  <div className={`absolute -bottom-4 -right-4 p-4 rounded-2xl shadow-lg ${result.success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {result.success ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bakbak text-black uppercase">
                    {result.data?.name} {result.data?.lastName}
                  </h2>
                  <div className="flex flex-col gap-1">
                    <span className={`text-2xl font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.message}
                    </span>
                    {result.data?.fechaFin && (
                      <span className="text-gray-500 font-medium">
                        Vence: {new Date(result.data.fechaFin).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-gray-400 text-sm font-medium flex items-center gap-2">
          <Loader2 size={16} /> Kiosco activo | Terminal {window.location.hostname}
        </div>
      </div>
    </div>
  );
};

export default ControlAcceso;

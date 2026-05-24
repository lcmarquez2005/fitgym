import React, { useState } from 'react';
import { Database, Play, Loader2, AlertTriangle } from 'lucide-react';
import { UserService } from '@services/user.service';
import { SocioService } from '@services/socio.service';
import { toast } from 'sonner';

export const GenerarDatosPrueba: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ total: number, current: number }>({ total: 0, current: 0 });

  const generarSocios = async () => {
    setLoading(true);
    try {
      // 1. Obtener todos los usuarios
      const users = await UserService.getAll();
      
      // Filtrar los que no son socios (basado en lógica simple o intentar con todos)
      // Para esta utilidad intentaremos con los primeros 5 usuarios que encontremos
      const candidates = users.slice(0, 5);
      setProgress({ total: candidates.length, current: 0 });

      for (let i = 0; i < candidates.length; i++) {
        const user = candidates[i];
        
        const dummySocio = {
          nombreCompleto: `${user.name} ${user.lastName}`,
          email: user.email || `test_${user.id}@fitgym.com`,
          idSocio: user.noControl || `SC-${user.id}`,
          tipoMembresia: i % 2 === 0 ? 'MENSUAL' : 'ANUAL',
          costoMensual: i % 2 === 0 ? '500' : '5000',
          fechaInicio: new Date().toISOString().split('T')[0],
          fechaFin: new Date(new Date().setMonth(new Date().getMonth() + (i % 2 === 0 ? 1 : 12))).toISOString().split('T')[0],
          estatus: 'ACTIVO',
          telefono: '555-000-0000',
          sexo: 'Masculino',
          lesiones: 'Ninguna',
          alergias: 'Ninguna'
        };

        try {
          await SocioService.crear(dummySocio as any);
          setProgress(prev => ({ ...prev, current: i + 1 }));
        } catch (err) {
          console.error(`Error creando socio para usuario ${user.id}:`, err);
        }
      }

      toast.success(`Se procesaron ${candidates.length} socios de prueba.`);
    } catch (error: any) {
      toast.error("Error al obtener usuarios: " + error.message);
    } finally {
      setLoading(false);
      setProgress({ total: 0, current: 0 });
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm font-inter">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          <Database size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bakbak text-black uppercase">Datos de Prueba</h3>
          <p className="text-gray-500 text-sm font-medium italic">Genera socios automáticamente para testing</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6 flex gap-3 items-start text-amber-800 text-sm font-medium">
        <AlertTriangle size={20} className="shrink-0" />
        <p>Esta acción promoverá a los primeros 5 usuarios registrados a "Socios" con planes activos. Úsalo solo en desarrollo.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-bold text-gray-600 uppercase">
            <span>Procesando...</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-300" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-600 animate-pulse font-bold text-xs uppercase">
            <Loader2 size={16} className="animate-spin" />
            No cierres esta pestaña
          </div>
        </div>
      ) : (
        <button
          onClick={generarSocios}
          className="w-full py-4 bg-black text-white rounded-2xl font-bakbak text-lg shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Play size={22} fill="currentColor" />
          GENERAR SOCIOS
        </button>
      )}
    </div>
  );
};
